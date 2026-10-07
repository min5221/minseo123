import React, { useState } from 'react';
import { ShoppingBag, Truck, Gift, ShieldCheck, Plus, Minus, Check } from 'lucide-react';

export interface ProductPlan {
  id: string;
  name: string;
  quantityText: string;
  originalPrice: number;
  salePrice: number;
  discountRate: number;
  isPopular?: boolean;
  gifts: string;
}

export const PRODUCT_PLANS: ProductPlan[] = [
  {
    id: 'box-1',
    name: '1박스 (30포 / 1개월분)',
    quantityText: '35g × 30포',
    originalPrice: 68000,
    salePrice: 49800,
    discountRate: 27,
    gifts: '친환경 트라이탄 쉐이커 보틀 1개 무료 증정',
  },
  {
    id: 'box-2',
    name: '2박스 (60포 / 2개월분)',
    quantityText: '35g × 60포',
    originalPrice: 136000,
    salePrice: 89000,
    discountRate: 35,
    isPopular: true,
    gifts: '친환경 쉐이커 보틀 2개 무료 증정 + 추가 10,600원 즉시 할인',
  },
  {
    id: 'box-3',
    name: '3박스 (90포 / 3개월분)',
    quantityText: '35g × 90포',
    originalPrice: 204000,
    salePrice: 129000,
    discountRate: 37,
    gifts: '친환경 쉐이커 보틀 2개 + 휴대용 파우치 케이스 무료 증정',
  },
];

interface ProductOrderSectionProps {
  onOpenOrderWithPlan: (plan: ProductPlan, count: number) => void;
}

export const ProductOrderSection: React.FC<ProductOrderSectionProps> = ({ onOpenOrderWithPlan }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('box-2'); // 2박스 기본 추천
  const [orderQuantity, setOrderQuantity] = useState<number>(1);

  const currentPlan = PRODUCT_PLANS.find((p) => p.id === selectedPlanId) || PRODUCT_PLANS[0];
  const totalPrice = currentPlan.salePrice * orderQuantity;

  const handleOrder = () => {
    onOpenOrderWithPlan(currentPlan, orderQuantity);
  };

  return (
    <section id="product" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E8DDCF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-base sm:text-lg font-bold text-[#22482B] block mb-2">
            SIGNATURE PRODUCT
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1C2E20] tracking-tight leading-tight mb-4">
            상품 안내 및 주문하기
          </h2>
          <p className="text-lg sm:text-xl text-[#526657] leading-relaxed">
            국내산 50가지 곡물과 채소를 가득 담은 프리미엄 하루한잔 생식을 지금 바로 만나보세요.
          </p>
        </div>

        {/* Product Purchase Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 border-2 border-[#E5DACB] shadow-xl shadow-[#22482B]/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left: Product Visual Card */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full bg-[#F5EFEB] rounded-3xl p-6 sm:p-8 border border-[#E4D8C8] flex flex-col items-center relative overflow-hidden">
                {/* Badge */}
                <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-[#22482B] mb-4">
                  <span className="bg-[#EAF2EC] px-3 py-1 rounded-full">100% 국내산 50곡물·채소</span>
                  <span className="text-[#647769]">HACCP 인증 제조</span>
                </div>

                {/* Illustrated Product Mockup */}
                <div className="my-6 w-56 sm:w-64 h-64 sm:h-72 bg-gradient-to-br from-[#EDE5D8] to-[#DFCDBA] rounded-2xl p-5 border border-[#D5C4B0] shadow-md flex flex-col justify-between items-center relative">
                  <div className="text-center">
                    <span className="text-xs font-bold text-[#4B6150] block tracking-wider">NATURAL RAW FOOD</span>
                    <h4 className="text-2xl font-black text-[#1D3021] mt-1">하루한잔 생식</h4>
                    <span className="text-xs text-[#5D7062] font-semibold">국내산 50곡물·채소 블렌드</span>
                  </div>

                  {/* Botanical emblem */}
                  <div className="w-24 h-24 rounded-full bg-white/70 backdrop-blur-xs flex items-center justify-center border border-[#22482B]/20">
                    <div className="text-center">
                      <div className="text-2xl font-black text-[#22482B]">50</div>
                      <div className="text-[10px] font-bold text-[#3E5544]">국내산 원물</div>
                    </div>
                  </div>

                  <div className="w-full bg-[#22482B] text-white text-center py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs">
                    개별 위생 스틱 포장 (35g)
                  </div>
                </div>

                {/* Gift Banner */}
                <div className="w-full bg-[#EAF2EC] rounded-2xl p-4 border border-[#CDE0D1] flex items-center gap-3 mt-2">
                  <div className="w-10 h-10 rounded-xl bg-[#22482B] text-white flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#22482B] block">전 구매 고객 특별 사은품</span>
                    <p className="text-sm font-extrabold text-[#1C2E20]">
                      친환경 트라이탄 쉐이커 보틀 100% 무료 증정
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery info bullets */}
              <div className="w-full mt-6 space-y-2 text-sm text-[#4E6153]">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#22482B] shrink-0" />
                  <span className="font-semibold">전국 무료 배송 (CJ대한통운 안전 배송)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#22482B] shrink-0" />
                  <span className="font-semibold">오후 2시 이전 주문 시 당일 발송 보장</span>
                </div>
              </div>
            </div>

            {/* Right: Purchase Controls & Big Order Button */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Title */}
                <div className="mb-6">
                  <span className="text-sm font-bold text-[#22482B] block mb-1">
                    정직한 원재료 · 간편한 일상 한 끼
                  </span>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1C2E20] leading-snug">
                    [하루한잔] 국내산 50곡물·채소 프리미엄 생식
                  </h3>
                  <p className="text-base sm:text-lg text-[#55695A] mt-2">
                    통곡물 15종, 콩류 5종, 잎채소 12종, 뿌리채소 8종, 과채 6종, 버섯·해조 4종
                  </p>
                </div>

                {/* Plan Selection Options */}
                <div className="space-y-3 mb-8">
                  <label className="text-base sm:text-lg font-black text-[#1C2E20] block">
                    구성 선택
                  </label>
                  {PRODUCT_PLANS.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-[#22482B] bg-[#EAF2EC]/40 shadow-xs'
                            : 'border-[#E5DACB] hover:border-[#22482B]/40 bg-white'
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 mt-0.5 sm:mt-0 flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-[#22482B] bg-[#22482B]' : 'border-[#C2B4A3]'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg sm:text-xl font-black text-[#1C2E20]">
                                {plan.name}
                              </span>
                              {plan.isPopular && (
                                <span className="bg-[#22482B] text-white text-xs font-extrabold px-2 py-0.5 rounded-md">
                                  베스트 추천
                                </span>
                              )}
                            </div>
                            <span className="text-xs sm:text-sm text-[#5B6F60] font-medium block mt-0.5">
                              {plan.gifts}
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right sm:shrink-0 pl-8 sm:pl-0">
                          <div className="flex items-center sm:justify-end gap-2">
                            <span className="text-xs sm:text-sm text-[#8E9F92] line-through tabular-nums">
                              {plan.originalPrice.toLocaleString()}원
                            </span>
                            <span className="text-xs sm:text-sm font-black text-[#B33924]">
                              {plan.discountRate}% 할인
                            </span>
                          </div>
                          <span className="text-xl sm:text-2xl font-black text-[#22482B] tabular-nums">
                            {plan.salePrice.toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quantity Adjustment */}
                <div className="flex items-center justify-between p-4 bg-[#F5EFEB] rounded-2xl border border-[#E5DACB] mb-8">
                  <span className="text-base sm:text-lg font-bold text-[#1C2E20]">
                    구매 수량
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                      className="w-10 h-10 rounded-xl bg-white border border-[#DDD0C0] text-[#1C2E20] flex items-center justify-center font-bold hover:bg-[#FAF7F2] active:scale-95 cursor-pointer"
                      disabled={orderQuantity <= 1}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-xl font-black text-[#1C2E20] min-w-8 text-center tabular-nums">
                      {orderQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOrderQuantity(orderQuantity + 1)}
                      className="w-10 h-10 rounded-xl bg-white border border-[#DDD0C0] text-[#1C2E20] flex items-center justify-center font-bold hover:bg-[#FAF7F2] active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Final Total Price Display */}
                <div className="pt-4 border-t border-[#E8DEC0] mb-8 flex items-baseline justify-between">
                  <span className="text-lg sm:text-xl font-bold text-[#55695A]">
                    총 주문 금액
                  </span>
                  <div className="text-right">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[#22482B] tabular-nums">
                      {totalPrice.toLocaleString()}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-[#22482B] ml-1">원</span>
                    <span className="text-xs sm:text-sm text-[#7A8C7F] block font-semibold mt-1">
                      전국 무료 배송 · 사은품 보틀 포함
                    </span>
                  </div>
                </div>
              </div>

              {/* Big Order Button - Requirements: "글자는 크게, 버튼도 크게, 색은 초록과 베이지로 깔끔하게" */}
              <button
                type="button"
                onClick={handleOrder}
                className="w-full inline-flex items-center justify-center gap-3 py-5 sm:py-6 px-8 text-2xl sm:text-3xl font-black text-white bg-[#22482B] hover:bg-[#18361E] active:scale-[0.98] rounded-2xl shadow-xl shadow-[#22482B]/25 transition-all cursor-pointer group"
              >
                <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 transition-transform group-hover:scale-110" />
                <span>주문하기</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
