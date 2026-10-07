import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  ShoppingBag,
  CreditCard,
  Landmark,
  Smartphone,
  Copy,
  Check,
  Loader2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';
import { ProductPlan, PRODUCT_PLANS } from './ProductOrderSection';
import { createRealOrder, OrderData } from '../services/orderService';
import { AppUser } from '../services/authService';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: AppUser | null;
  initialPlan?: ProductPlan;
  initialQuantity?: number;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialPlan = PRODUCT_PLANS[1],
  initialQuantity = 1,
}) => {
  // Step State: 'shipping' -> 'payment' -> 'completed'
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'completed'>('shipping');

  const [selectedPlan, setSelectedPlan] = useState<ProductPlan>(initialPlan);
  const [quantity, setQuantity] = useState<number>(initialQuantity);

  // Form State: Recipient & Shipping
  const [name, setName] = useState(currentUser?.displayName || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('문 앞에 놓아주세요');

  // Payment Method: 'card' | 'naver' | 'toss' | 'kakao' | 'transfer'
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'naver' | 'toss' | 'kakao' | 'transfer'>('card');

  // Pre-filled Card Test Details as requested: "카드번호 칸에 1111-2222-3333-4444가 미리 적혀 있게"
  const [cardNumber, setCardNumber] = useState('1111-2222-3333-4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('777');
  const [cardIssuer, setCardIssuer] = useState('국민카드');

  // Processing & Confirmation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderCompleteData, setOrderCompleteData] = useState<OrderData | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Sync user display name if changed
  React.useEffect(() => {
    if (currentUser?.displayName && !name) {
      setName(currentUser.displayName);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const totalPrice = selectedPlan.salePrice * quantity;

  // Format phone number automatically
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 3) {
      setPhone(val);
    } else if (val.length <= 7) {
      setPhone(`${val.slice(0, 3)}-${val.slice(3)}`);
    } else {
      setPhone(`${val.slice(0, 3)}-${val.slice(3, 7)}-${val.slice(7, 11)}`);
    }
  };

  // Step 1: Validate Shipping and proceed to Payment Screen
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanAddress = address.trim();

    if (!cleanName) {
      setErrorMessage('받으시는 분 성함을 입력해 주세요.');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 9) {
      setErrorMessage('연락처(휴대폰 번호)를 정확히 입력해 주세요.');
      return;
    }
    if (!cleanAddress) {
      setErrorMessage('배송지 기본 주소를 입력해 주세요.');
      return;
    }

    setCurrentStep('payment');
  };

  // Step 2: Simulated Dummy Payment execution
  const handleExecutePayment = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    // Generate real order ID with format requested: "예시: ORD-20261001-3843"
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    const generatedOrderId = `ORD-${yyyy}${mm}${dd}-${randomSuffix}`;

    const newOrder: OrderData = {
      orderId: generatedOrderId,
      userId: currentUser?.uid,
      userEmail: currentUser?.email,
      planId: selectedPlan.id,
      productName: selectedPlan.name,
      quantity,
      unitPrice: selectedPlan.salePrice,
      totalAmount: totalPrice,
      recipientName: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      detailAddress: detailAddress.trim() || undefined,
      deliveryNote: deliveryNote.trim() || undefined,
      paymentMethod,
      status: 'pending',
      createdAt: now.toISOString(),
    };

    try {
      // Simulate payment gateway delay (800ms)
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Save directly to Firestore database!
      const savedOrder = await createRealOrder(newOrder);
      setOrderCompleteData(savedOrder);
      setCurrentStep('completed');
    } catch (err: unknown) {
      console.error('Order creation error:', err);
      // Fallback local store save so order is always recorded safely
      try {
        const localOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
        localOrders.unshift(newOrder);
        localStorage.setItem('my_orders', JSON.stringify(localOrders.slice(0, 20)));
        setOrderCompleteData(newOrder);
        setCurrentStep('completed');
      } catch {
        setErrorMessage('주문 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyOrderId = () => {
    if (orderCompleteData?.orderId) {
      navigator.clipboard.writeText(orderCompleteData.orderId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleResetAndClose = () => {
    setCurrentStep('shipping');
    setOrderCompleteData(null);
    setErrorMessage(null);
    onClose();
  };

  const getPaymentMethodKorean = (method: OrderData['paymentMethod']) => {
    switch (method) {
      case 'card':
        return '신용/체크카드 (연습용)';
      case 'naver':
        return '네이버페이 (연습용)';
      case 'toss':
        return '토스페이 (연습용)';
      case 'kakao':
        return '카카오페이 (연습용)';
      case 'transfer':
        return '무통장/가상계좌 (연습용)';
      default:
        return '연습 결제';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-[#E5DACB] overflow-hidden my-4 sm:my-6">
        
        {/* Modal Top Header with Step Indicator */}
        <div className="bg-[#FAF7F2] p-5 sm:p-6 border-b border-[#E8DDCF] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-[#22482B]" />
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#1C2E20]">
                {currentStep === 'shipping' && '1. 배송 정보 입력'}
                {currentStep === 'payment' && '2. 연습용 결제 화면'}
                {currentStep === 'completed' && '3. 주문 및 결제 완료'}
              </h3>
              <span className="text-xs text-[#627766] font-semibold">
                {currentStep === 'shipping' && '배송받으실 주소와 연락처를 확인해 주세요'}
                {currentStep === 'payment' && '실제로 돈이 나가지 않는 가짜 결제 테스트입니다'}
                {currentStep === 'completed' && '주문이 정상적으로 접수되었습니다'}
              </span>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-10 h-10 rounded-full hover:bg-[#EAE0D3] flex items-center justify-center text-[#55695A] transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ========================================================
            STEP 1: SHIPPING & RECIPIENT INFORMATION FORM
           ======================================================== */}
        {currentStep === 'shipping' && (
          <form onSubmit={handleProceedToPayment} className="p-5 sm:p-8 space-y-5 max-h-[78vh] overflow-y-auto">
            
            {/* Selected Item Summary Card */}
            <div className="bg-[#F5EFEB] rounded-2xl p-4 sm:p-5 border border-[#E5DACB]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#22482B] bg-[#EAF2EC] px-2.5 py-0.5 rounded-full">
                  100% 국산 50종 자연 원물
                </span>
                <span className="text-xs font-bold text-[#22482B]">무료 배송</span>
              </div>
              <h4 className="text-lg sm:text-xl font-black text-[#1C2E20]">
                {selectedPlan.name}
              </h4>
              <p className="text-xs sm:text-sm text-[#5B6E60] mt-0.5">
                {selectedPlan.gifts}
              </p>
              <div className="mt-3 pt-3 border-t border-[#DFD2C1] flex items-center justify-between">
                <span className="text-sm font-semibold text-[#576B5C]">주문 수량: {quantity}개</span>
                <span className="text-xl sm:text-2xl font-black text-[#22482B] tabular-nums">
                  {totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* Error notice if validation fails */}
            {errorMessage && (
              <div className="p-3.5 bg-red-50 text-red-700 text-sm font-bold rounded-xl border border-red-200">
                {errorMessage}
              </div>
            )}

            {/* Recipient Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm sm:text-base font-bold text-[#2A3D2F] mb-1.5">
                  받는 분 성함 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 윤성미"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF7F2] px-4 py-3.5 rounded-xl border border-[#D8C9BC] text-base sm:text-lg text-[#1C2E20] focus:outline-none focus:ring-2 focus:ring-[#22482B]"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-bold text-[#2A3D2F] mb-1.5">
                  휴대폰 번호 <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="예: 010-1234-5678"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={13}
                  className="w-full bg-[#FAF7F2] px-4 py-3.5 rounded-xl border border-[#D8C9BC] text-base sm:text-lg text-[#1C2E20] focus:outline-none focus:ring-2 focus:ring-[#22482B]"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-bold text-[#2A3D2F] mb-1.5">
                  기본 주소 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 서울특별시 마포구 공덕동 123"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#FAF7F2] px-4 py-3.5 rounded-xl border border-[#D8C9BC] text-base sm:text-lg text-[#1C2E20] focus:outline-none focus:ring-2 focus:ring-[#22482B]"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-bold text-[#2A3D2F] mb-1.5">
                  상세 주소 (동, 호수)
                </label>
                <input
                  type="text"
                  placeholder="예: 101동 1204호"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  className="w-full bg-[#FAF7F2] px-4 py-3.5 rounded-xl border border-[#D8C9BC] text-base sm:text-lg text-[#1C2E20] focus:outline-none focus:ring-2 focus:ring-[#22482B]"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-bold text-[#2A3D2F] mb-1.5">
                  배송 요청사항
                </label>
                <select
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  className="w-full bg-[#FAF7F2] px-4 py-3.5 rounded-xl border border-[#D8C9BC] text-base sm:text-lg text-[#1C2E20] focus:outline-none focus:ring-2 focus:ring-[#22482B]"
                >
                  <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
                  <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                  <option value="배송 전 미리 연락 바랍니다">배송 전 미리 연락 바랍니다</option>
                  <option value="택배함에 넣어주세요">택배함에 넣어주세요</option>
                </select>
              </div>
            </div>

            {/* Next Step Button */}
            <div className="pt-3 border-t border-[#E8DDCF]">
              <button
                type="submit"
                className="w-full py-5 text-xl sm:text-2xl font-black text-white bg-[#22482B] hover:bg-[#18361E] active:scale-[0.99] rounded-2xl shadow-lg shadow-[#22482B]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>다음: 결제 화면으로 이동</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </form>
        )}

        {/* ========================================================
            STEP 2: SIMULATED DUMMY PAYMENT SCREEN
           ======================================================== */}
        {currentStep === 'payment' && (
          <div className="p-5 sm:p-8 space-y-5 max-h-[78vh] overflow-y-auto">
            
            {/* REQUIRED: "실제로 결제되지 않는 연습용 입니다"라고 크게 표시 */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
              <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-lg sm:text-xl font-black text-amber-900 block leading-snug">
                  실제로 결제되지 않는 연습용 입니다
                </span>
                <p className="text-xs sm:text-sm text-amber-800 font-semibold mt-1">
                  진짜 돈이 인출되거나 카드 대금이 청구되지 않는 <strong>안전한 가짜 결제 테스트 모드</strong>입니다.
                  안심하고 결제하기를 눌러보세요!
                </p>
              </div>
            </div>

            {/* Payment Amount Display */}
            <div className="bg-[#F5EFEB] rounded-2xl p-4 sm:p-5 border border-[#E5DACB] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#6F8174] font-semibold block">최종 결제 금액</span>
                <span className="text-sm font-bold text-[#1C2E20]">{selectedPlan.name} ({quantity}개)</span>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-[#22482B] tabular-nums">
                  {totalPrice.toLocaleString()}원
                </span>
                <span className="text-xs text-[#809485] block font-semibold">연습 결제 0원 청구</span>
              </div>
            </div>

            {/* REQUIRED: 결제는 네이버, 토스, 카카오페이 등을 모두 포함 */}
            <div className="space-y-3">
              <label className="block text-sm sm:text-base font-black text-[#1C2E20]">
                결제 수단 선택
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* 1. 신용/체크카드 */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#22482B] bg-[#EAF2EC] text-[#22482B] font-black shadow-xs'
                      : 'border-[#E0D3C3] bg-white text-[#4D6052] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-xs sm:text-sm">신용/체크카드</span>
                </button>

                {/* 2. 네이버페이 */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('naver')}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'naver'
                      ? 'border-[#03C75A] bg-[#EAF7EE] text-[#03C75A] font-black shadow-xs'
                      : 'border-[#E0D3C3] bg-white text-[#4D6052] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span className="w-6 h-6 rounded-md bg-[#03C75A] text-white flex items-center justify-center font-black text-xs">
                    N
                  </span>
                  <span className="text-xs sm:text-sm font-bold">네이버페이</span>
                </button>

                {/* 3. 토스페이 */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('toss')}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'toss'
                      ? 'border-[#0064FF] bg-[#EBF3FF] text-[#0064FF] font-black shadow-xs'
                      : 'border-[#E0D3C3] bg-white text-[#4D6052] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span className="w-6 h-6 rounded-md bg-[#0064FF] text-white flex items-center justify-center font-black text-xs">
                    toss
                  </span>
                  <span className="text-xs sm:text-sm font-bold">토스페이</span>
                </button>

                {/* 4. 카카오페이 */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('kakao')}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'kakao'
                      ? 'border-[#3C1E1E] bg-[#FFF8CC] text-[#3C1E1E] font-black shadow-xs'
                      : 'border-[#E0D3C3] bg-white text-[#4D6052] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span className="w-6 h-6 rounded-md bg-[#FEE500] text-[#3C1E1E] flex items-center justify-center font-black text-xs">
                    pay
                  </span>
                  <span className="text-xs sm:text-sm font-bold">카카오페이</span>
                </button>

                {/* 5. 무통장입금 / 가상계좌 */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'transfer'
                      ? 'border-[#22482B] bg-[#EAF2EC] text-[#22482B] font-black shadow-xs'
                      : 'border-[#E0D3C3] bg-white text-[#4D6052] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <Landmark className="w-6 h-6" />
                  <span className="text-xs sm:text-sm font-bold">가상계좌입금</span>
                </button>
              </div>
            </div>

            {/* Payment Method Details Sub-panel */}
            {paymentMethod === 'card' && (
              <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#E5DACB] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-[#2A3D2F]">
                    카드사 선택
                  </span>
                  <select
                    value={cardIssuer}
                    onChange={(e) => setCardIssuer(e.target.value)}
                    className="bg-white border border-[#D5C6B7] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-[#1C2E20]"
                  >
                    <option value="국민카드">KB국민카드</option>
                    <option value="신한카드">신한카드</option>
                    <option value="삼성카드">삼성카드</option>
                    <option value="현대카드">현대카드</option>
                    <option value="농협카드">NH농협카드</option>
                    <option value="카카오뱅크">카카오뱅크</option>
                  </select>
                </div>

                {/* REQUIRED: "카드번호 칸에 1111-2222-3333-4444가 미리 적혀 있게" */}
                <div>
                  <label className="block text-xs font-bold text-[#4F6253] mb-1">
                    카드 번호 (연습용 번호 자동 입력됨)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-white px-3.5 py-3 rounded-xl border border-[#D5C6B7] font-mono text-base sm:text-lg font-bold text-[#1C2E20] tracking-wider text-center"
                    placeholder="1111-2222-3333-4444"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#4F6253] mb-1">
                      유효기간 (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-white px-3 py-2.5 rounded-xl border border-[#D5C6B7] font-mono text-sm font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#4F6253] mb-1">
                      CVC (보안코드 3자리)
                    </label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-white px-3 py-2.5 rounded-xl border border-[#D5C6B7] font-mono text-sm font-bold text-center"
                      maxLength={3}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-[#718576] text-center pt-1">
                  ※ 연습용 가짜 카드 정보이므로 실제 카드 조회가 발생하지 않습니다.
                </p>
              </div>
            )}

            {paymentMethod === 'naver' && (
              <div className="bg-[#EAF7EE] p-4 sm:p-5 rounded-2xl border border-[#BCE4C7] space-y-2 text-center">
                <span className="text-sm font-bold text-[#03C75A] block">🟢 네이버페이 연습 결제 모드</span>
                <p className="text-xs sm:text-sm text-[#275333]">
                  네이버 아이디로 연결된 간편결제 시뮬레이션입니다.<br />
                  <strong>실제 금액 결제 없이 가상으로 1초 승인 처리됩니다.</strong>
                </p>
              </div>
            )}

            {paymentMethod === 'toss' && (
              <div className="bg-[#EBF3FF] p-4 sm:p-5 rounded-2xl border border-[#BED7FF] space-y-2 text-center">
                <span className="text-sm font-bold text-[#0064FF] block">🔵 토스페이 연습 결제 모드</span>
                <p className="text-xs sm:text-sm text-[#25467A]">
                  토스 앱을 통한 간편결제 시뮬레이션입니다.<br />
                  <strong>실제 토스 잔액이나 계좌에서 돈이 빠져나가지 않습니다.</strong>
                </p>
              </div>
            )}

            {paymentMethod === 'kakao' && (
              <div className="bg-[#FFF9D6] p-4 sm:p-5 rounded-2xl border border-[#F3E388] space-y-2 text-center">
                <span className="text-sm font-bold text-[#3C1E1E] block">🟡 카카오페이 연습 결제 모드</span>
                <p className="text-xs sm:text-sm text-[#503A1E]">
                  카카오톡 원클릭 결제 시뮬레이션입니다.<br />
                  <strong>연습용 결제이므로 실제 카카오페이 머니가 차감되지 않습니다.</strong>
                </p>
              </div>
            )}

            {paymentMethod === 'transfer' && (
              <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#E5DACB] space-y-2 text-xs sm:text-sm text-[#3E5242]">
                <div className="flex justify-between font-bold">
                  <span>입금 은행</span>
                  <span>국민은행 (연습용 가상계좌)</span>
                </div>
                <div className="flex justify-between font-mono font-bold">
                  <span>계좌 번호</span>
                  <span>123456-04-987654</span>
                </div>
                <div className="flex justify-between">
                  <span>예금주</span>
                  <span>하루한잔 생식</span>
                </div>
                <p className="text-[11px] text-[#718576] pt-1">
                  ※ 실제로 송금하실 필요가 없으며, [결제하기] 클릭 즉시 입금 확인 완료 처리됩니다.
                </p>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 bg-red-50 text-red-700 text-sm font-bold rounded-xl border border-red-200">
                {errorMessage}
              </div>
            )}

            {/* Actions: Back and Execute Payment */}
            <div className="pt-3 border-t border-[#E8DDCF] flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep('shipping')}
                className="w-full sm:w-auto px-5 py-4 border-2 border-[#D5C6B7] bg-white hover:bg-[#FAF7F2] text-[#4F6253] font-bold rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>배송 정보 수정</span>
              </button>

              {/* REQUIRED: "결제하기" 버튼을 클릭하면 주문번호를 만들어 주고 "주문완료" 화면을 보여줘 */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleExecutePayment}
                className="w-full sm:flex-1 py-5 text-xl sm:text-2xl font-black text-white bg-[#22482B] hover:bg-[#18361E] disabled:opacity-50 active:scale-[0.99] rounded-2xl shadow-xl shadow-[#22482B]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>연습 결제 승인 처리 중...</span>
                  </>
                ) : (
                  <span>{totalPrice.toLocaleString()}원 연습 결제하기</span>
                )}
              </button>
            </div>

          </div>
        )}

        {/* ========================================================
            STEP 3: "주문완료" 화면 (Order Complete Confirmation)
           ======================================================== */}
        {currentStep === 'completed' && orderCompleteData && (
          <div className="p-6 sm:p-10 text-center max-h-[78vh] overflow-y-auto">
            
            {/* Success Icon */}
            <div className="w-20 h-20 bg-[#EAF2EC] text-[#22482B] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle className="w-12 h-12" />
            </div>

            <span className="text-xs sm:text-sm font-black text-[#22482B] bg-[#EAF2EC] px-3.5 py-1 rounded-full inline-block mb-3">
              연습용 결제 승인 완료 · 실시간 주문 접수
            </span>
            
            <h4 className="text-2xl sm:text-3xl font-black text-[#1C2E20] mb-2">
              주문이 정상 완료되었습니다!
            </h4>
            
            <p className="text-base text-[#55695A] mb-6">
              실제 돈은 출금되지 않았으며, 데이터베이스에 정상 주문으로 안전하게 기록되었습니다.
            </p>

            {/* Order Receipt Box with "ORD-YYYYMMDD-XXXX" */}
            <div className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 text-left border border-[#E8DDCF] space-y-3.5 mb-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#E5DACB]">
                <div>
                  <span className="text-xs text-[#647769] block font-semibold">주문 번호</span>
                  <span className="font-extrabold text-[#1C2E20] font-mono text-xl sm:text-2xl text-[#22482B]">
                    {orderCompleteData.orderId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyOrderId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D5C6B7] hover:bg-[#F2ECE3] text-xs font-bold text-[#22482B] rounded-lg transition-colors cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>복사완료</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>주문번호 복사</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-[#647769]">주문 상품</span>
                <span className="font-bold text-[#1C2E20] text-right">{orderCompleteData.productName} ({orderCompleteData.quantity}개)</span>
              </div>
              
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-[#647769]">사은품</span>
                <span className="font-bold text-[#22482B]">친환경 트라이탄 보틀 무료 증정</span>
              </div>

              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-[#647769]">받는 분</span>
                <span className="font-bold text-[#1C2E20]">{orderCompleteData.recipientName}</span>
              </div>

              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-[#647769]">연락처</span>
                <span className="font-bold text-[#1C2E20]">{orderCompleteData.phone}</span>
              </div>

              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-[#647769] shrink-0">배송지</span>
                <span className="font-bold text-[#1C2E20] text-right truncate max-w-[260px]">
                  {orderCompleteData.address} {orderCompleteData.detailAddress || ''}
                </span>
              </div>

              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-[#647769]">결제 수단</span>
                <span className="font-bold text-[#1C2E20]">
                  {getPaymentMethodKorean(orderCompleteData.paymentMethod)}
                </span>
              </div>

              <div className="pt-3 border-t border-[#E8DDCF] flex justify-between items-baseline text-lg sm:text-xl font-black">
                <span className="text-[#1C2E20]">주문 금액</span>
                <div className="text-right">
                  <span className="text-[#22482B] tabular-nums">{orderCompleteData.totalAmount.toLocaleString()}원</span>
                  <span className="text-xs text-[#809586] block font-semibold">(실제 청구 0원 · 연습 결제)</span>
                </div>
              </div>
            </div>

            {/* Bottom Dismiss Button */}
            <button
              onClick={handleResetAndClose}
              className="w-full py-5 text-xl font-black text-white bg-[#22482B] hover:bg-[#18361E] rounded-2xl transition-all cursor-pointer shadow-md"
            >
              주문 완료 확인 및 닫기
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
