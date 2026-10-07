import React, { useState } from 'react';
import { Droplets, Milk, Sparkles, AlertCircle, Check } from 'lucide-react';

export const HowToConsumeSection: React.FC = () => {
  const [selectedMix, setSelectedMix] = useState<'milk' | 'water' | 'soymilk'>('milk');

  const mixDetails = {
    water: {
      title: '물 200ml에 탈 때',
      taste: '가장 깔끔하고 맑은 자연 곡물·채소 본연의 담백한 맛',
      bestFor: '가볍고 산뜻한 시작을 원하시는 분',
      calorieNote: '생식 본연의 열량(약 130kcal) 그대로 부담 없이 섭취',
    },
    milk: {
      title: '우유 200ml에 탈 때 (가장 인기!)',
      taste: '고소한 곡물 라떼처럼 크리미하고 풍부한 고소함',
      bestFor: '식사 대용으로 든든하고 달콤고소하게 드시고 싶은 분',
      calorieNote: '우유의 부드러움과 어우러져 든든한 포만감',
    },
    soymilk: {
      title: '무가당 두유 200ml에 탈 때',
      taste: '진한 콩의 고소함이 배가 되는 묵직하고 알찬 풍미',
      bestFor: '우유를 잘 못 드시거나 더 진한 맛을 원하시는 분',
      calorieNote: '식물성 단백질과 함께 든든하게 꽉 찬 한 끼',
    },
  };

  return (
    <section id="how-to-eat" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E8DDCF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-base sm:text-lg font-bold text-[#22482B] block mb-2">
            EASY 3 STEPS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1C2E20] tracking-tight leading-tight mb-4">
            물이나 우유에 타서 드세요
          </h2>
          <p className="text-lg sm:text-xl text-[#526657] leading-relaxed">
            복잡한 조리 없이 <strong>1 → 2 → 3 순서</strong>로 누구나 1분 만에 완성하는 간편한 한 끼입니다.
          </p>
        </div>

        {/* 1 -> 2 -> 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-14">
          
          {/* STEP 1 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#E5DACB] shadow-sm relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#22482B] text-white text-2xl font-black">
                  1
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#6D7F72]">STEP 01</span>
              </div>

              {/* Graphic Icon container */}
              <div className="w-full h-36 bg-[#F5EFEB] rounded-2xl flex flex-col items-center justify-center mb-6 border border-[#E9DFD3]">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#22482B] shadow-sm mb-2">
                  <Droplets className="w-8 h-8" />
                </div>
                <span className="text-sm font-bold text-[#22482B]">물 또는 우유 200ml</span>
              </div>

              <h3 className="text-2xl sm:text-[26px] font-black text-[#1C2E20] mb-3">
                액체를 먼저 붓기
              </h3>

              <p className="text-base sm:text-lg text-[#526657] leading-relaxed">
                전용 보틀에 <strong>물, 우유 또는 두유 200ml</strong>를 먼저 채워줍니다.
              </p>
            </div>

            {/* Essential Pro Tip */}
            <div className="mt-6 p-3.5 bg-[#FAF7F2] rounded-xl border border-[#ECE0D1] flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-[#22482B] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#4E6152] font-semibold">
                <strong>꿀팁:</strong> 가루보다 액체를 먼저 넣어야 바닥에 뭉침 없이 잘 풀립니다!
              </p>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#E5DACB] shadow-sm relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#22482B] text-white text-2xl font-black">
                  2
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#6D7F72]">STEP 02</span>
              </div>

              {/* Graphic Icon container */}
              <div className="w-full h-36 bg-[#F5EFEB] rounded-2xl flex flex-col items-center justify-center mb-6 border border-[#E9DFD3]">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#22482B] shadow-sm mb-2">
                  <Milk className="w-8 h-8" />
                </div>
                <span className="text-sm font-bold text-[#22482B]">생식 1포 (35g) 투하</span>
              </div>

              <h3 className="text-2xl sm:text-[26px] font-black text-[#1C2E20] mb-3">
                생식 1포 넣기
              </h3>

              <p className="text-base sm:text-lg text-[#526657] leading-relaxed">
                이지컷을 뜯어 <strong>하루한잔 생식 1포</strong>를 보틀 안에 쏙 넣어줍니다.
              </p>
            </div>

            <div className="mt-6 p-3.5 bg-[#FAF7F2] rounded-xl border border-[#ECE0D1] flex items-start gap-2.5">
              <Check className="w-5 h-5 text-[#22482B] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#4E6152] font-semibold">
                <strong>편리함:</strong> 가위 없이 손으로 쉽게 뜯기는 이지컷 스틱 포장입니다.
              </p>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#22482B] shadow-md relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#22482B] text-white text-2xl font-black">
                  3
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#22482B]">STEP 03 (완성!)</span>
              </div>

              {/* Graphic Icon container */}
              <div className="w-full h-36 bg-[#EAF2EC] rounded-2xl flex flex-col items-center justify-center mb-6 border border-[#CDE0D1]">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#22482B] shadow-sm mb-2">
                  <Sparkles className="w-8 h-8 text-[#22482B]" />
                </div>
                <span className="text-sm font-bold text-[#22482B]">5초간 가볍게 흔들기</span>
              </div>

              <h3 className="text-2xl sm:text-[26px] font-black text-[#1C2E20] mb-3">
                흔들어서 맛있게 마시기
              </h3>

              <p className="text-base sm:text-lg text-[#526657] leading-relaxed">
                뚜껑을 닫고 <strong>5초간 가볍게 흔들어</strong> 고소하고 부드럽게 마십니다.
              </p>
            </div>

            <div className="mt-6 p-3.5 bg-[#EAF2EC] rounded-xl border border-[#CDE0D1] flex items-start gap-2.5">
              <Check className="w-5 h-5 text-[#22482B] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#22482B] font-semibold">
                <strong>초미세 분쇄:</strong> 몇 번만 흔들어도 사르르 잘 녹아 목넘김이 아주 편합니다.
              </p>
            </div>
          </div>

        </div>

        {/* Beverage Flavor Taste Selector Guide */}
        <div className="bg-[#F5EFEB] rounded-3xl p-6 sm:p-10 border border-[#E2D6C6]">
          <div className="text-center sm:text-left mb-6">
            <h3 className="text-2xl sm:text-3xl font-black text-[#1C2E20]">
              내 입맛에 딱 맞는 추천 조합
            </h3>
            <p className="text-base sm:text-lg text-[#55695A] mt-1">
              원하는 베이스를 눌러 맛과 특징을 확인해보세요.
            </p>
          </div>

          {/* Interactive buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setSelectedMix('milk')}
              className={`px-5 py-3 rounded-2xl text-base sm:text-lg font-bold transition-all cursor-pointer ${
                selectedMix === 'milk'
                  ? 'bg-[#22482B] text-white shadow-sm'
                  : 'bg-white text-[#3E5244] border border-[#DDD0BF] hover:bg-[#EAE0D4]'
              }`}
            >
              🥛 우유에 탈 때 (추천)
            </button>
            <button
              onClick={() => setSelectedMix('water')}
              className={`px-5 py-3 rounded-2xl text-base sm:text-lg font-bold transition-all cursor-pointer ${
                selectedMix === 'water'
                  ? 'bg-[#22482B] text-white shadow-sm'
                  : 'bg-white text-[#3E5244] border border-[#DDD0BF] hover:bg-[#EAE0D4]'
              }`}
            >
              💧 물에 탈 때 (깔끔)
            </button>
            <button
              onClick={() => setSelectedMix('soymilk')}
              className={`px-5 py-3 rounded-2xl text-base sm:text-lg font-bold transition-all cursor-pointer ${
                selectedMix === 'soymilk'
                  ? 'bg-[#22482B] text-white shadow-sm'
                  : 'bg-white text-[#3E5244] border border-[#DDD0BF] hover:bg-[#EAE0D4]'
              }`}
            >
              🌱 두유에 탈 때 (진함)
            </button>
          </div>

          {/* Taste Details Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DFD1C0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-sm font-bold text-[#22482B]">{mixDetails[selectedMix].calorieNote}</span>
              <h4 className="text-2xl sm:text-3xl font-black text-[#1C2E20]">
                {mixDetails[selectedMix].title}
              </h4>
              <p className="text-lg sm:text-xl text-[#394B3D] font-medium">
                {mixDetails[selectedMix].taste}
              </p>
              <p className="text-sm sm:text-base text-[#617467]">
                추천: {mixDetails[selectedMix].bestFor}
              </p>
            </div>
            <div className="shrink-0 bg-[#FAF7F2] px-6 py-4 rounded-xl border border-[#ECE0D1] text-center w-full sm:w-auto">
              <span className="text-xs text-[#708275] block">준비 시간</span>
              <span className="text-2xl font-black text-[#22482B]">단 1분</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
