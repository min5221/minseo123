import React from 'react';
import { ShoppingBag, ArrowDown, Check, Sparkles, Sprout, HeartHandshake } from 'lucide-react';

interface HeroProps {
  onOpenOrder: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenOrder }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#FAF7F2] pt-8 sm:pt-14 pb-14 sm:pb-20 border-b border-[#E8DDCF]">
      {/* Subtle organic background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#22482B]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C49E68]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
            
            {/* Trust highlights text */}
            <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#2E5A36] mb-4">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#EAF2EC] text-[#22482B]">
                <Sprout className="w-3.5 h-3.5" />
              </span>
              <span>100% 국내산 50종 자연 원물 그대로</span>
              <span aria-hidden="true" className="text-[#A5B8AA]">·</span>
              <span>인공첨가물 0%</span>
            </div>

            {/* Main Headline - Required: "하루한잔, 간편한 한끼" */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#1C2E20] tracking-tight leading-[1.18] sm:leading-[1.15] mb-5 text-balance">
              <span className="block text-[#22482B]">하루한잔,</span>
              <span className="block text-[#223326]">간편한 한끼</span>
            </h1>

            {/* Description - Large, clear font */}
            <p className="text-lg sm:text-xl md:text-2xl font-medium text-[#445648] leading-relaxed max-w-xl mb-8">
              바쁜 아침, 끼니 거르지 마세요. 우리 땅에서 자란 <strong className="text-[#22482B] font-bold">50가지 곡물과 채소</strong>를 
              동결건조해 스틱 하나에 온전히 담았습니다. 물이나 우유에 타서 5초면 든든하고 고소한 식사가 완성됩니다.
            </p>

            {/* Large Order Button & Sub Button */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
              <button
                onClick={onOpenOrder}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 text-xl sm:text-2xl font-black text-white bg-[#22482B] hover:bg-[#1A3821] active:scale-[0.98] rounded-2xl shadow-lg shadow-[#22482B]/20 transition-all cursor-pointer group"
              >
                <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 transition-transform group-hover:scale-110" />
                <span>주문하기</span>
              </button>

              <a
                href="#ingredients"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-4 text-lg font-bold text-[#22482B] bg-[#EAE2D5] hover:bg-[#DFD5C6] rounded-2xl transition-colors cursor-pointer"
              >
                <span>50가지 원재료 보기</span>
                <ArrowDown className="w-5 h-5 text-[#22482B]" />
              </a>
            </div>

            {/* Key Quality Pillars (No forbidden medical or diet claims, pure ingredients & convenience) */}
            <div className="w-full grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-[#E5DACB] text-center">
              <div className="p-2 sm:p-3 bg-[#FAF7F2] rounded-xl border border-[#ECE2D5]">
                <div className="text-xl sm:text-2xl font-black text-[#22482B] tabular-nums">50가지</div>
                <div className="text-xs sm:text-sm font-semibold text-[#5A6F60] mt-0.5">국내산 통곡물·채소</div>
              </div>
              <div className="p-2 sm:p-3 bg-[#FAF7F2] rounded-xl border border-[#ECE2D5]">
                <div className="text-xl sm:text-2xl font-black text-[#22482B]">동결건조</div>
                <div className="text-xs sm:text-sm font-semibold text-[#5A6F60] mt-0.5">원물 영양 보존</div>
              </div>
              <div className="p-2 sm:p-3 bg-[#FAF7F2] rounded-xl border border-[#ECE2D5]">
                <div className="text-xl sm:text-2xl font-black text-[#22482B] tabular-nums">1분</div>
                <div className="text-xs sm:text-sm font-semibold text-[#5A6F60] mt-0.5">간편하게 흔들어 섭취</div>
              </div>
            </div>
          </div>

          {/* Right Visual Card Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#22482B]/5 border border-[#E6DACB] relative">
              {/* Product Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-[#F0E8DC]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22482B]" />
                  <span className="text-xs sm:text-sm font-bold text-[#22482B]">100% 농가 직송 국내산</span>
                </div>
                <span className="text-xs font-semibold text-[#6E8073]">일반가공식품 (생식)</span>
              </div>

              {/* Central Visual Graphic */}
              <div className="my-6 relative py-4 flex flex-col items-center">
                <div className="w-48 h-64 sm:w-56 sm:h-72 rounded-2xl bg-gradient-to-br from-[#F5EFE6] via-[#E8DFD3] to-[#DDD2C2] p-4 flex flex-col items-center justify-between shadow-inner relative overflow-hidden border border-[#D8CABE]">
                  {/* Pouch design */}
                  <div className="w-full text-center pt-2">
                    <span className="text-[11px] font-bold text-[#4B6350] tracking-wider block">PURE GRAIN & GREENS</span>
                    <h3 className="text-lg sm:text-xl font-black text-[#1C2E20] mt-0.5">하루한잔 생식</h3>
                    <p className="text-xs font-semibold text-[#586C5D]">50가지 국내산 원물</p>
                  </div>

                  {/* Botanical art container */}
                  <div className="w-24 h-24 rounded-full bg-[#22482B]/10 flex items-center justify-center my-auto border border-[#22482B]/15">
                    <Sprout className="w-12 h-12 text-[#22482B]" />
                  </div>

                  {/* Pouch bottom info */}
                  <div className="w-full bg-white/70 backdrop-blur-xs rounded-xl p-2 text-center text-xs font-bold text-[#22482B]">
                    35g 개별 이지컷 스틱 포장
                  </div>
                </div>

                {/* Floating Eco Bottle Pill */}
                <div className="absolute -bottom-2 -right-2 sm:-right-4 bg-[#22482B] text-white px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-2 text-sm font-bold">
                  <Sparkles className="w-4 h-4 text-[#F3ECE2]" />
                  <span>전용 쉐이커 보틀 무료증정</span>
                </div>
              </div>

              {/* Highlights below visual */}
              <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#ECE0D0] space-y-2 text-sm font-medium text-[#36493B]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#22482B] shrink-0" />
                  <span><strong>원재료 100% 국산:</strong> 현미, 서리태, 케일 등 50종</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#22482B] shrink-0" />
                  <span><strong>순수 원물 배합:</strong> 설탕 0g, 합성향료 0g</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#22482B] shrink-0" />
                  <span><strong>부드러운 목넘김:</strong> 저온 초미세 분쇄 가공</span>
                </div>
              </div>

              {/* Instant buy callout on mobile */}
              <div className="mt-5 pt-4 border-t border-[#F0E8DC] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#6F8074] block">1개월분 (30포)</span>
                  <span className="text-xl sm:text-2xl font-black text-[#22482B] tabular-nums">49,800원</span>
                </div>
                <button
                  onClick={onOpenOrder}
                  className="px-5 py-2.5 bg-[#22482B] hover:bg-[#1B3A22] text-white text-base font-bold rounded-xl transition-colors cursor-pointer"
                >
                  바로 구매
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
