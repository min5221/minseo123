import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface MobileStickyBarProps {
  onOpenOrder: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ onOpenOrder }) => {
  return (
    <aside aria-label="간편 주문 바" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8DDCF] px-4 py-2.5 shadow-2xl">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-[#55695A] leading-tight">
            하루한잔 생식 (30포)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-[#22482B] tabular-nums">
              49,800원
            </span>
            <span className="text-[11px] font-semibold text-[#8B9C8E]">
              무료배송
            </span>
          </div>
        </div>

        <button
          onClick={onOpenOrder}
          className="flex-1 max-w-[200px] h-12 bg-[#22482B] hover:bg-[#18361E] active:scale-[0.98] text-white font-black text-base rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#22482B]/20 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5 shrink-0" />
          <span>주문하기</span>
        </button>
      </div>
    </aside>
  );
};
