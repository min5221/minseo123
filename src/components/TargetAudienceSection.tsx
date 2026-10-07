import React from 'react';
import { Sun, UtensilsCrossed, Leaf, ArrowRight } from 'lucide-react';

interface TargetAudienceSectionProps {
  onOpenOrder: () => void;
}

export const TargetAudienceSection: React.FC<TargetAudienceSectionProps> = ({ onOpenOrder }) => {
  const recommendations = [
    {
      num: '01',
      icon: Sun,
      title: '바쁜 출근·등굣길,\n아침 식사를 자꾸 거르는 분',
      situation: '잠 5분도 소중해 빈속으로 집을 나서는 일상',
      solution: '보틀에 담아 1분 만에 훌훌! 이동하면서도 든든하고 속 편안하게 하루를 시작할 수 있습니다.',
      badgeText: '아침 대용 간편식',
    },
    {
      num: '02',
      icon: UtensilsCrossed,
      title: '매 끼니 채소와 곡물을\n따로 챙겨 먹기 번거로운 분',
      situation: '장보고, 씻고, 다듬고, 남아서 버리기 일쑤인 1인 가구',
      solution: '50가지 다양한 우리 땅 채소와 통곡물을 스틱 1포에 골고루 담아 준비 시간과 뒤처리 걱정이 없습니다.',
      badgeText: '원물 50종 간편 섭취',
    },
    {
      num: '03',
      icon: Leaf,
      title: '기름지고 자극적인 식단 대신\n속 편한 간편식을 찾는 분',
      situation: '인스턴트나 배달 음식 후 속이 더부룩하고 부담스러울 때',
      solution: '설탕이나 인공 첨가물 없이, 자연 곡물 본연의 담백하고 구수한 맛으로 편안하고 가볍게 즐깁니다.',
      badgeText: '자연 그대로의 담백함',
    },
  ];

  return (
    <section id="recommend" className="py-16 sm:py-24 bg-[#F5EFEB] border-b border-[#E8DDCF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-base sm:text-lg font-bold text-[#22482B] block mb-2">
            WHO IT'S FOR
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1C2E20] tracking-tight leading-tight mb-4">
            하루한잔 생식,<br />
            <span className="text-[#22482B]">이런 분께 특히 좋아요</span>
          </h2>
          <p className="text-lg sm:text-xl text-[#526657] leading-relaxed">
            복잡한 준비 없이 정직한 재료만으로 간편하게 채우는 일상의 든든한 한 끼입니다.
          </p>
        </div>

        {/* 3 Large Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {recommendations.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3D6C5] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Top row: Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl sm:text-3xl font-black text-[#22482B]/30 tabular-nums">
                      {item.num}
                    </span>
                    <div className="w-14 h-14 rounded-2xl bg-[#EAF2EC] text-[#22482B] flex items-center justify-center">
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>

                  {/* Title - Large font */}
                  <h3 className="text-2xl sm:text-[26px] font-black text-[#1C2E20] leading-snug whitespace-pre-line mb-4">
                    {item.title}
                  </h3>

                  {/* Situation note */}
                  <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EDE2D4] mb-4">
                    <span className="text-xs font-bold text-[#64786A] block mb-1">고민</span>
                    <p className="text-sm sm:text-base font-semibold text-[#3D4F42]">
                      {item.situation}
                    </p>
                  </div>

                  {/* Solution note */}
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#22482B] block">하루한잔의 해결</span>
                    <p className="text-base sm:text-lg text-[#526657] leading-relaxed">
                      {item.solution}
                    </p>
                  </div>
                </div>

                {/* Bottom Tag */}
                <div className="mt-8 pt-4 border-t border-[#F2E8DC] flex items-center justify-between">
                  <span className="text-sm font-bold text-[#22482B]">
                    #{item.badgeText}
                  </span>
                  <button
                    onClick={onOpenOrder}
                    className="text-sm font-bold text-[#22482B] hover:text-[#17331D] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>주문하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner inside recommendation */}
        <div className="bg-[#22482B] rounded-3xl p-6 sm:p-10 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <h4 className="text-2xl sm:text-3xl font-black mb-2">
              나를 위한 간편한 식사 습관, 지금 시작해보세요
            </h4>
            <p className="text-base sm:text-lg text-[#D2E2D5] font-medium">
              국내산 50가지 원물 100% · 보틀 무료 증정 · 무료 배송 혜택
            </p>
          </div>
          <button
            onClick={onOpenOrder}
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#F2ECE3] text-[#22482B] text-xl font-black rounded-2xl transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer"
          >
            간편 주문하기
          </button>
        </div>

      </div>
    </section>
  );
};
