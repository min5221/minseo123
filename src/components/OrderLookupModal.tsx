import React, { useState, useEffect } from 'react';
import { X, Search, PackageCheck, Clock, Truck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { getOrderById, OrderData } from '../services/orderService';

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({ isOpen, onClose }) => {
  const [searchId, setSearchId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderData[]>([]);

  useEffect(() => {
    if (isOpen) {
      try {
        const local = JSON.parse(localStorage.getItem('my_orders') || '[]');
        setRecentOrders(local);
        if (local.length > 0 && !searchId) {
          setSearchId(local[0].orderId);
        }
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent, directId?: string) => {
    if (e) e.preventDefault();
    const idToSearch = (directId || searchId).trim();
    if (!idToSearch) {
      setErrorMessage('주문 번호를 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setOrderResult(null);

    try {
      const order = await getOrderById(idToSearch);
      if (order) {
        setOrderResult(order);
      } else {
        // Check local storage fallback
        const match = recentOrders.find((o) => o.orderId.toLowerCase() === idToSearch.toLowerCase());
        if (match) {
          setOrderResult(match);
        } else {
          setErrorMessage('입력하신 주문 번호에 해당하는 주문을 찾을 수 없습니다.');
        }
      }
    } catch (err) {
      console.error(err);
      const match = recentOrders.find((o) => o.orderId.toLowerCase() === idToSearch.toLowerCase());
      if (match) {
        setOrderResult(match);
      } else {
        setErrorMessage('주문 정보를 불러오는 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: OrderData['status']) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">주문 접수 완료</span>;
      case 'preparing':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">상품 준비 중</span>;
      case 'shipped':
        return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">배송 중 (CJ대한통운)</span>;
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">배송 완료</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full">주문 취소</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-[#E5DACB] overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-[#FAF7F2] p-5 sm:p-6 border-b border-[#E8DDCF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-[#22482B]" />
            <h3 className="text-xl sm:text-2xl font-black text-[#1C2E20]">
              내 주문 배송 조회
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-[#EAE0D3] flex items-center justify-center text-[#55695A] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Search Form */}
          <form onSubmit={(e) => handleSearch(e)} className="flex gap-2">
            <input
              type="text"
              placeholder="주문번호 입력 (예: HA-20261007-1234)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1 bg-[#FAF7F2] px-4 py-3.5 rounded-xl border border-[#D8C9BC] text-base text-[#1C2E20] focus:outline-none focus:ring-2 focus:ring-[#22482B]"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 sm:px-6 bg-[#22482B] hover:bg-[#18361E] text-white font-bold rounded-xl transition-all flex items-center justify-center cursor-pointer shrink-0"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
          </form>

          {/* Quick select from recent orders on this device */}
          {recentOrders.length > 0 && (
            <div>
              <span className="text-xs font-bold text-[#6D8072] block mb-2">이 기기에서 최근 주문한 내역:</span>
              <div className="flex flex-wrap gap-2">
                {recentOrders.map((rec) => (
                  <button
                    key={rec.orderId}
                    type="button"
                    onClick={() => {
                      setSearchId(rec.orderId);
                      handleSearch(undefined, rec.orderId);
                    }}
                    className="text-xs font-mono font-bold bg-[#FAF7F2] hover:bg-[#EAE1D5] px-2.5 py-1.5 rounded-lg border border-[#E0D3C3] text-[#22482B] cursor-pointer"
                  >
                    {rec.orderId} ({rec.recipientName})
                  </button>
                ))}
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-red-50 text-red-700 text-sm font-semibold rounded-xl border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Search Result */}
          {orderResult && (
            <div className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-[#E5DACB] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E0D3C3]">
                <div>
                  <span className="text-xs text-[#6F8174] block">주문 번호</span>
                  <span className="text-lg font-black text-[#1C2E20] font-mono">{orderResult.orderId}</span>
                </div>
                {getStatusBadge(orderResult.status)}
              </div>

              {/* Progress Steps Visualizer */}
              <div className="py-2">
                <div className="grid grid-cols-4 text-center text-xs font-bold gap-1">
                  <div className={`p-2 rounded-lg ${orderResult.status === 'pending' ? 'bg-[#22482B] text-white' : 'bg-white text-[#708475]'}`}>
                    <Clock className="w-4 h-4 mx-auto mb-1" />
                    <span>접수완료</span>
                  </div>
                  <div className={`p-2 rounded-lg ${orderResult.status === 'preparing' ? 'bg-[#22482B] text-white' : 'bg-white text-[#708475]'}`}>
                    <PackageCheck className="w-4 h-4 mx-auto mb-1" />
                    <span>상품준비</span>
                  </div>
                  <div className={`p-2 rounded-lg ${orderResult.status === 'shipped' ? 'bg-[#22482B] text-white' : 'bg-white text-[#708475]'}`}>
                    <Truck className="w-4 h-4 mx-auto mb-1" />
                    <span>배송중</span>
                  </div>
                  <div className={`p-2 rounded-lg ${orderResult.status === 'completed' ? 'bg-[#22482B] text-white' : 'bg-white text-[#708475]'}`}>
                    <CheckCircle2 className="w-4 h-4 mx-auto mb-1" />
                    <span>배송완료</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-[#384C3E] pt-2 border-t border-[#E0D3C3]">
                <div className="flex justify-between">
                  <span className="text-[#6D8072]">주문 상품</span>
                  <span className="font-bold text-[#1C2E20]">{orderResult.productName} ({orderResult.quantity}개)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6D8072]">받는 분</span>
                  <span className="font-bold text-[#1C2E20]">{orderResult.recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6D8072]">배송지</span>
                  <span className="font-bold text-[#1C2E20] text-right truncate max-w-[220px]">
                    {orderResult.address} {orderResult.detailAddress || ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6D8072]">주문 일시</span>
                  <span className="font-medium text-[#1C2E20]">
                    {new Date(orderResult.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-[#E0D3C3]">
                  <span>결제 금액</span>
                  <span className="text-[#22482B] text-base tabular-nums">{orderResult.totalAmount.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
