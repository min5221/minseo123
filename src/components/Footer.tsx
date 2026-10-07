import React from 'react';
import { PhoneCall, ShieldCheck, PackageCheck, Shield } from 'lucide-react';

interface FooterProps {
  onOpenLookup?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLookup, onOpenAdmin }) => {
  return (
    <footer className="bg-[#243528] text-[#D8E4DA] pt-16 pb-24 md:pb-16 border-t border-[#314636]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#364D3B]">
          
          {/* Brand Philosophy */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="text-2xl font-black text-white tracking-tight">
              하루한잔 생식
            </h3>
            <p className="text-base text-[#BFD0C2] leading-relaxed">
              우리의 땅에서 정직하게 기른 50가지 곡물과 채소를 동결건조하여 담백하게 담았습니다.
              화려한 과장 없이, 오직 신선한 원재료와 바쁜 일상의 간편한 한 끼에 집중합니다.
            </p>
            <div className="flex items-center gap-2 text-sm text-[#9BB1A0]">
              <ShieldCheck className="w-4 h-4 text-[#8FC39C]" />
              <span>100% 대한민국 원료 계약재배 · 무첨가 원칙</span>
            </div>
          </div>

          {/* Customer Service & Contact */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-lg font-bold text-white">
              고객만족센터
            </h4>
            <div className="text-3xl font-black text-white font-mono flex items-center gap-2">
              <PhoneCall className="w-6 h-6 text-[#8FC39C]" />
              <span>1588-5050</span>
            </div>
            <p className="text-sm text-[#A9BFA9] leading-relaxed">
              운영 시간: 평일 09:30 - 18:00 (점심 12:30 - 13:30)<br />
              주말 및 공휴일 휴무 · 택배 마감: 평일 오후 2시
            </p>

            <div className="pt-2 flex items-center gap-3">
              {onOpenLookup && (
                <button
                  onClick={onOpenLookup}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2D4532] hover:bg-[#39563E] text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  <PackageCheck className="w-3.5 h-3.5 text-[#8FC39C]" />
                  <span>배송/주문조회</span>
                </button>
              )}
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2D4532] hover:bg-[#39563E] text-xs font-semibold text-[#B3CCB7] transition-colors cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-[#8FC39C]" />
                  <span>판매자 실시간 주문관리</span>
                </button>
              )}
            </div>
          </div>

          {/* Food Transparency Notice */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-lg font-bold text-white">
              식품위생법 관련 고지
            </h4>
            <div className="bg-[#1C2C1F] p-4 rounded-xl text-xs text-[#A8BFA8] space-y-1.5 border border-[#2D4532]">
              <p>· <strong>식품유형:</strong> 기타가공품(생식가공품)</p>
              <p>· <strong>제조원:</strong> (주)자연한끼 식품</p>
              <p>· <strong>유통기한:</strong> 제조일로부터 12개월</p>
              <p className="text-[#C6DAC7] pt-1">
                ※ 본 제품은 질병의 예방 및 치료를 위한 의약품이나 건강기능식품이 아닌 일반가공식품입니다.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Legal Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8BA18F]">
          <p>
            © {new Date().getFullYear()} 하루한잔 생식. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">이용약관</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-white cursor-pointer transition-colors font-bold">개인정보처리방침</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-white cursor-pointer transition-colors">사업자정보확인</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

