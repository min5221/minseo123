import React from 'react';
import { ShoppingBag, PackageCheck, Shield, User, LogOut, LogIn } from 'lucide-react';
import { AppUser } from '../services/authService';

interface HeaderProps {
  currentUser: AppUser | null;
  onOpenOrder: () => void;
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenOrder,
  onOpenLookup,
  onOpenAdmin,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DDCF]">
      {/* Top Welcome Notification Bar when logged in */}
      {currentUser && (
        <div className="bg-[#22482B] text-white px-4 py-1.5 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
          <span>🌿</span>
          <span className="font-extrabold text-[#F7EFE3] text-sm sm:text-base">
            {currentUser.displayName || '고객'} 님 환영합니다!
          </span>
          <span className="hidden sm:inline text-xs text-[#BED4C3]">
            (오늘도 건강한 하루한잔 간편한 한 끼 되세요)
          </span>
          <button
            onClick={onLogout}
            className="ml-3 text-xs underline text-[#E2ECE3] hover:text-white cursor-pointer"
          >
            로그아웃
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#22482B] hover:opacity-90 transition-opacity"
        >
          하루한잔
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-[17px] font-semibold text-[#3D5244]">
          <a href="#ingredients" className="hover:text-[#22482B] transition-colors">
            50가지 원재료
          </a>
          <a href="#recommend" className="hover:text-[#22482B] transition-colors">
            이런 분께 추천
          </a>
          <a href="#how-to-eat" className="hover:text-[#22482B] transition-colors">
            맛있게 먹는 법
          </a>
          <a href="#product" className="hover:text-[#22482B] transition-colors">
            상품 안내
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions + user state */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Member Welcome / Login button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-[#EAF2EC] px-3 py-1.5 rounded-xl border border-[#D5E5D8]">
              <span className="w-2 h-2 rounded-full bg-[#22482B]" />
              <span className="text-xs sm:text-sm font-extrabold text-[#22482B] truncate max-w-[130px]">
                {currentUser.displayName} 님
              </span>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#3E5544] hover:text-[#22482B] px-2.5 sm:px-3 py-2 rounded-lg hover:bg-[#EFE7DC] transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>로그인/가입</span>
            </button>
          )}

          {/* Order lookup for customers */}
          <button
            onClick={onOpenLookup}
            className="hidden md:inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#5A7362] hover:text-[#22482B] px-2 py-2 rounded-lg transition-colors cursor-pointer"
            title="주문 번호로 배송 상태 조회"
          >
            <PackageCheck className="w-4 h-4" />
            <span className="whitespace-nowrap">주문조회</span>
          </button>

          {/* Seller Order Management Screen */}
          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#22482B] bg-[#EAF2EC] hover:bg-[#D7E8DA] border border-[#CDE0D1] px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all cursor-pointer shadow-xs"
            title="판매자 전용 실시간 주문관리 대시보드"
          >
            <Shield className="w-4 h-4 text-[#22482B]" />
            <span className="whitespace-nowrap">주문관리</span>
          </button>

          {/* Big Order CTA */}
          <button
            onClick={onOpenOrder}
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg font-bold text-white bg-[#22482B] hover:bg-[#1B3A22] active:scale-[0.98] rounded-xl shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 shrink-0" />
            <span>주문하기</span>
          </button>
        </div>
      </div>
    </header>
  );
};
