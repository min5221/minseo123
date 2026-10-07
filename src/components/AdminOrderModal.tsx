import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  Search,
  Download,
  Phone,
  MapPin,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  RotateCw,
  Bell,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { OrderData, subscribeToOrders, updateOrderStatus } from '../services/orderService';

interface AdminOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Web Audio synthetic chime for new order arrival alert
 */
function playNewOrderSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.0, ctx.currentTime + 0.12); // A5

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.15);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.5);
  } catch {
    // ignore audio restriction
  }
}

export const AdminOrderModal: React.FC<AdminOrderModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderData[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [newOrderNotice, setNewOrderNotice] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const prevOrderCountRef = useRef<number>(0);
  const isFirstLoadRef = useRef<boolean>(true);

  // 1. Subscribe to Firestore in REAL TIME: "새 주문이 들어오면 내가 새로고침 안해도 자동으로 목록에 뜨게 해줘"
  useEffect(() => {
    if (!isOpen) return;

    isFirstLoadRef.current = true;

    // Load local storage fallback initially
    try {
      const local = JSON.parse(localStorage.getItem('my_orders') || '[]');
      if (local.length > 0) {
        setOrders(local);
        prevOrderCountRef.current = local.length;
      }
    } catch {
      // ignore
    }

    // Subscribe to live Firestore updates
    const unsubscribe = subscribeToOrders(
      (newOrders) => {
        // Check if a new order just arrived in real time
        if (!isFirstLoadRef.current && newOrders.length > prevOrderCountRef.current) {
          const newest = newOrders[0];
          setNewOrderNotice(`🔔 새 주문이 실시간 접수되었습니다! [${newest.orderId}] ${newest.recipientName} 님`);
          if (isSoundEnabled) {
            playNewOrderSound();
          }
          setTimeout(() => setNewOrderNotice(null), 5000);
        }

        prevOrderCountRef.current = newOrders.length;
        isFirstLoadRef.current = false;
        setOrders(newOrders);
      },
      (err) => {
        console.warn('Real-time order subscription warning:', err);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isOpen, isSoundEnabled]);

  // 2. Filter & Search
  useEffect(() => {
    let result = [...orders];

    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.recipientName.toLowerCase().includes(q) ||
          o.phone.includes(q) ||
          o.address.toLowerCase().includes(q) ||
          (o.productName && o.productName.toLowerCase().includes(q))
      );
    }

    setFilteredOrders(result);
  }, [orders, statusFilter, searchQuery]);

  if (!isOpen) return null;

  // 3. One-click status change: "각 주문을 '배송중' '배송완료'로 바꾸는 버튼도 넣어줘"
  const handleQuickStatusChange = async (orderId: string, targetStatus: OrderData['status']) => {
    setUpdatingOrderId(orderId);
    try {
      // Optimistic state update
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: targetStatus } : o))
      );
      // Persist to Firestore
      await updateOrderStatus(orderId, targetStatus);
    } catch (err) {
      console.error('Status update error:', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCopy = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(orderId);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const exportToCSV = () => {
    if (orders.length === 0) {
      alert('다운로드할 주문 내역이 없습니다.');
      return;
    }

    const headers = [
      '주문번호',
      '주문일시',
      '주문자명',
      '연락처',
      '배송지주소',
      '상세주소',
      '배송메모',
      '상품명',
      '수량',
      '결제금액',
      '결제수단',
      '주문상태',
    ];

    const rows = orders.map((o) => [
      o.orderId,
      new Date(o.createdAt).toLocaleString('ko-KR'),
      `"${o.recipientName.replace(/"/g, '""')}"`,
      o.phone,
      `"${o.address.replace(/"/g, '""')}"`,
      `"${(o.detailAddress || '').replace(/"/g, '""')}"`,
      `"${(o.deliveryNote || '').replace(/"/g, '""')}"`,
      `"${o.productName.replace(/"/g, '""')}"`,
      o.quantity,
      o.totalAmount,
      o.paymentMethod,
      o.status,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `생식_주문목록_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics
  const totalCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const getStatusBadge = (status: OrderData['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>신규 주문접수</span>
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-900 border border-blue-300 text-xs font-black px-2.5 py-1 rounded-full">
            <Package className="w-3.5 h-3.5 text-blue-700" />
            <span>상품준비중</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-900 border border-purple-300 text-xs font-black px-2.5 py-1 rounded-full animate-pulse">
            <Truck className="w-3.5 h-3.5 text-purple-700" />
            <span>배송중</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>배송완료</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-900 border border-rose-300 text-xs font-black px-2.5 py-1 rounded-full">
            <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
            <span>주문취소</span>
          </span>
        );
    }
  };

  const getPaymentName = (method: OrderData['paymentMethod']) => {
    switch (method) {
      case 'card':
        return '카드';
      case 'naver':
        return '네이버페이';
      case 'toss':
        return '토스페이';
      case 'kakao':
        return '카카오페이';
      case 'transfer':
        return '가상계좌';
      default:
        return '간편결제';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl border-2 border-[#E5DACB] overflow-hidden my-2 sm:my-4 flex flex-col max-h-[94vh]">
        
        {/* Top Header */}
        <div className="bg-[#FAF7F2] p-4 sm:p-6 border-b border-[#E8DDCF] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#22482B] text-white flex items-center justify-center shadow-md">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1C2E20]">
                  판매자 주문관리 센터
                </h3>
                {/* REQUIRED: "새 주문이 들어오면 내가 새로고침 안해도 자동으로 목록에 뜨게 해줘" indicator */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2EC] border border-[#CDE0D1] text-xs font-black text-[#22482B]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22482B] animate-ping" />
                  <span>실시간 자동 수신 중</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#576D5B] font-medium mt-0.5">
                새 주문이 들어오면 새로고침 없이 화면에 즉시 나타납니다.
              </p>
            </div>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                isSoundEnabled
                  ? 'bg-[#EAF2EC] border-[#CDE0D1] text-[#22482B]'
                  : 'bg-white border-[#D5C6B7] text-[#7E8F82]'
              }`}
              title={isSoundEnabled ? '주문 알림음 켜짐' : '주문 알림음 꺼짐'}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">알림음 {isSoundEnabled ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={exportToCSV}
              className="px-3.5 py-2.5 bg-white border border-[#D5C6B7] hover:bg-[#F2ECE3] text-xs sm:text-sm font-bold text-[#22482B] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="택배사 배송 송장용 엑셀 다운로드"
            >
              <Download className="w-4 h-4" />
              <span>엑셀 다운로드</span>
            </button>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-[#EAE0D3] flex items-center justify-center text-[#55695A] transition-colors cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Real-time Order Arrival Banner */}
        {newOrderNotice && (
          <div className="bg-[#22482B] text-white px-5 py-3 flex items-center justify-between text-sm sm:text-base font-black shadow-inner animate-bounce">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#E6F3EA]" />
              <span>{newOrderNotice}</span>
            </div>
            <button
              onClick={() => setNewOrderNotice(null)}
              className="text-xs text-[#C8DEC8] hover:text-white underline cursor-pointer"
            >
              닫기
            </button>
          </div>
        )}

        {/* Top 5 Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 p-3 sm:p-5 bg-[#F5EFEB] border-b border-[#E8DDCF]">
          <div className="bg-white p-3 rounded-2xl border border-[#E3D6C5]">
            <span className="text-xs text-[#6F8174] font-semibold block">전체 주문</span>
            <div className="text-xl sm:text-2xl font-black text-[#1C2E20] tabular-nums mt-0.5">
              {totalCount}건
            </div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-amber-300 bg-amber-50/50">
            <span className="text-xs text-amber-800 font-bold block">신규 접수 (대기)</span>
            <div className="text-xl sm:text-2xl font-black text-amber-900 tabular-nums mt-0.5">
              {pendingCount}건
            </div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-purple-200">
            <span className="text-xs text-purple-800 font-bold block">배송중</span>
            <div className="text-xl sm:text-2xl font-black text-purple-900 tabular-nums mt-0.5">
              {shippedCount}건
            </div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-emerald-200">
            <span className="text-xs text-emerald-800 font-bold block">배송완료</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-900 tabular-nums mt-0.5">
              {completedCount}건
            </div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-[#E3D6C5] col-span-2 sm:col-span-1">
            <span className="text-xs text-[#6F8174] font-semibold block">총 주문 금액</span>
            <div className="text-lg sm:text-xl font-black text-[#22482B] tabular-nums mt-0.5 truncate">
              {totalRevenue.toLocaleString()}원
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="p-3 sm:p-5 border-b border-[#E8DDCF] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: `전체 (${totalCount})` },
              { id: 'pending', label: `주문접수 (${pendingCount})` },
              { id: 'shipped', label: `배송중 (${shippedCount})` },
              { id: 'completed', label: `배송완료 (${completedCount})` },
              { id: 'cancelled', label: `취소` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-[#22482B] text-white shadow-xs'
                    : 'bg-[#FAF7F2] hover:bg-[#EAE1D5] text-[#4A5D4F] border border-[#DDD0C0]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="주문번호, 주문자명, 전화번호 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F2] pl-9 pr-3.5 py-2.5 rounded-xl border border-[#D8C9BC] text-xs sm:text-sm text-[#1C2E20] focus:outline-none focus:ring-2 focus:ring-[#22482B]"
            />
            <Search className="w-4 h-4 text-[#8A9C8E] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* ========================================================
            REQUIRED: "주문번호, 주문자, 상품, 금액, 상태를 표로 보여줘"
            REQUIRED: "각 주문을 '배송중' '배송완료'로 바꾸는 버튼도 넣어줘"
           ======================================================== */}
        <div className="flex-1 overflow-auto p-3 sm:p-5">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20 text-[#6B7D70]">
              <Clock className="w-14 h-14 mx-auto mb-3 text-[#A0B3A5]" />
              <p className="text-xl font-bold">접수된 주문이 없습니다.</p>
              <p className="text-sm text-[#8A9D8E] mt-1">
                손님이 사이트에서 주문을 넣으면 새로고침 없이 여기에 즉시 나타납니다!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#E5DACB]">
              <table className="w-full text-left border-collapse min-w-[860px]">
                <thead>
                  <tr className="bg-[#F5EFEB] border-b border-[#E0D3C3] text-xs sm:text-sm font-black text-[#2B3F30]">
                    <th className="py-3.5 px-4">주문번호 / 일시</th>
                    <th className="py-3.5 px-4">주문자 정보</th>
                    <th className="py-3.5 px-4">주문 상품</th>
                    <th className="py-3.5 px-4">금액 / 결제수단</th>
                    <th className="py-3.5 px-4">현재 상태</th>
                    <th className="py-3.5 px-4 text-center">상태 변경 액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE0D3] bg-white text-xs sm:text-sm">
                  {filteredOrders.map((order) => {
                    const isUpdating = updatingOrderId === order.orderId;
                    return (
                      <tr
                        key={order.orderId}
                        className="hover:bg-[#FAF7F2] transition-colors"
                      >
                        {/* 1. 주문번호 / 일시 */}
                        <td className="py-4 px-4 align-top">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-sm text-[#22482B]">
                              {order.orderId}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(order.orderId)}
                              className="p-1 rounded text-[#7B8D7E] hover:text-[#22482B] hover:bg-[#EAE0D3] transition-colors cursor-pointer"
                              title="주문번호 복사"
                            >
                              {copiedOrderId === order.orderId ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <span className="text-[11px] text-[#7A8E7F] block mt-1">
                            {new Date(order.createdAt).toLocaleString('ko-KR', {
                              month: 'numeric',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>

                        {/* 2. 주문자 (이름, 연락처, 배송지) */}
                        <td className="py-4 px-4 align-top max-w-[240px]">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-[#1C2E20] text-sm sm:text-base">
                              {order.recipientName}
                            </span>
                            <a
                              href={`tel:${order.phone}`}
                              className="inline-flex items-center gap-1 text-xs text-[#22482B] font-bold hover:underline"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{order.phone}</span>
                            </a>
                          </div>
                          <div className="text-xs text-[#526656] mt-1 flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#22482B] shrink-0 mt-0.5" />
                            <span className="line-clamp-2">
                              {order.address} {order.detailAddress || ''}
                            </span>
                          </div>
                          {order.deliveryNote && (
                            <span className="text-[11px] text-[#86998A] block mt-0.5">
                              메모: {order.deliveryNote}
                            </span>
                          )}
                        </td>

                        {/* 3. 상품 (상품명 및 수량) */}
                        <td className="py-4 px-4 align-top">
                          <span className="font-bold text-[#1C2E20] block">
                            {order.productName}
                          </span>
                          <span className="text-xs font-semibold text-[#667B6B]">
                            수량: <strong>{order.quantity}개</strong>
                          </span>
                        </td>

                        {/* 4. 금액 및 결제수단 */}
                        <td className="py-4 px-4 align-top">
                          <span className="font-black text-[#22482B] text-sm sm:text-base tabular-nums block">
                            {order.totalAmount.toLocaleString()}원
                          </span>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#D5C6B7] text-[11px] font-bold text-[#4E6152]">
                            {getPaymentName(order.paymentMethod)}
                          </span>
                        </td>

                        {/* 5. 현재 상태 */}
                        <td className="py-4 px-4 align-top">
                          {getStatusBadge(order.status)}
                        </td>

                        {/* 6. REQUIRED: "각 주문을 '배송중''배송완료'로 바꾸는 버튼도 넣어줘" */}
                        <td className="py-4 px-4 align-middle text-center">
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5">
                            {/* [배송중] 버튼 */}
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleQuickStatusChange(order.orderId, 'shipped')}
                              className={`w-full sm:w-auto px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                order.status === 'shipped'
                                  ? 'bg-purple-600 text-white shadow-xs'
                                  : 'bg-purple-50 text-purple-800 border border-purple-300 hover:bg-purple-100'
                              }`}
                              title="상태를 배송중으로 변경"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>배송중</span>
                            </button>

                            {/* [배송완료] 버튼 */}
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleQuickStatusChange(order.orderId, 'completed')}
                              className={`w-full sm:w-auto px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                order.status === 'completed'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                              }`}
                              title="상태를 배송완료로 변경"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>배송완료</span>
                            </button>

                            {/* 기타 상태 변경 셀렉터 */}
                            <select
                              value={order.status}
                              disabled={isUpdating}
                              onChange={(e) =>
                                handleQuickStatusChange(order.orderId, e.target.value as OrderData['status'])
                              }
                              className="text-[11px] font-bold bg-[#FAF7F2] border border-[#D5C6B7] text-[#4E6152] rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                              title="다른 상태로 변경"
                            >
                              <option value="pending">주문접수</option>
                              <option value="preparing">상품준비</option>
                              <option value="shipped">배송중</option>
                              <option value="completed">배송완료</option>
                              <option value="cancelled">주문취소</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-[#FAF7F2] p-4 border-t border-[#E8DDCF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6F8274]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Firestore 실시간 동기화 활성화됨 (새 주문 발생 시 <strong>즉시 자동 갱신</strong>)
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#22482B] text-white font-bold rounded-xl hover:bg-[#18361E] transition-colors cursor-pointer shadow-xs"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
