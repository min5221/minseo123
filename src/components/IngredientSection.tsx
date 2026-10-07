import React, { useState } from 'react';
import { INGREDIENTS_50, CATEGORIES } from '../data/ingredientsData';
import { Sprout, ShieldCheck, Snowflake, Wind, Search, CheckCircle2 } from 'lucide-react';

export const IngredientSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredIngredients = INGREDIENTS_50.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
                          item.characteristic.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="ingredients" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E8DDCF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF2EC] text-[#22482B] text-sm sm:text-base font-bold mb-4">
            <Sprout className="w-4 h-4" />
            <span>100% 우리 땅에서 자란 원물</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1C2E20] tracking-tight leading-tight mb-4">
            국내산 50가지 곡물과 채소,<br className="hidden sm:inline" />
            <span className="text-[#22482B]">자연 그대로를 정직하게 담았습니다</span>
          </h2>

          <p className="text-lg sm:text-xl text-[#4B5E50] leading-relaxed">
            통곡물, 콩류, 푸른 잎채소, 깊은 뿌리채소, 과채와 버섯까지.<br />
            수입산이나 가공 분말을 섞지 않고 <strong>순수 국내산 원재료 50종</strong>만을 골라 정성껏 배합했습니다.
          </p>
        </div>

        {/* 3 Core Processing Features (Focusing on raw materials & convenience, strictly avoiding medicinal/diet hype) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E6DACB] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EAF2EC] text-[#22482B] flex items-center justify-center mb-5">
                <Snowflake className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#1C2E20] mb-2">
                영하 40도 동결 건조
              </h3>
              <p className="text-base sm:text-lg text-[#526657] leading-relaxed">
                열을 가하지 않고 영하 40도에서 급속 동결 후 수분만 날려, 자연 원물 고유의 신선한 색과 고소한 풍미를 그대로 지켜냅니다.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2EAE0] text-sm font-bold text-[#22482B]">
              열 가공 無 · 자연 원물 보존
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E6DACB] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EAF2EC] text-[#22482B] flex items-center justify-center mb-5">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#1C2E20] mb-2">
                저온 초미세 분쇄
              </h3>
              <p className="text-base sm:text-lg text-[#526657] leading-relaxed">
                찬물이나 찬 우유에도 뭉침 없이 잘 풀리도록 매우 곱게 갈아냈습니다. 목에 걸리는 텁텁함 없이 부드럽게 꿀꺽 넘어갑니다.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2EAE0] text-sm font-bold text-[#22482B]">
              찬 음료에도 사르르 용해
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E6DACB] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EAF2EC] text-[#22482B] flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#1C2E20] mb-2">
                첨가물 4가지 무첨가
              </h3>
              <p className="text-base sm:text-lg text-[#526657] leading-relaxed">
                설탕, 합성 감미료, 합성 착향료, 보존료를 단 1g도 넣지 않았습니다. 곡물 고유의 담백하고 은은한 단맛을 즐겨보세요.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2EAE0] text-sm font-bold text-[#22482B]">
              설탕 0g · 합성향료 0g
            </div>
          </div>
        </div>

        {/* 50 Ingredients Interactive Browser */}
        <div className="bg-[#F5EFEB] rounded-3xl p-6 sm:p-10 border border-[#E2D5C3]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#1C2E20]">
                50가지 원재료 전체 목록
              </h3>
              <p className="text-base sm:text-lg font-medium text-[#576B5C] mt-1">
                모든 원료는 전량 100% 대한민국 농가 계약 재배 원물입니다.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="곡물 또는 채소 검색 (예: 현미, 케일)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white pl-10 pr-4 py-3 rounded-xl border border-[#D9CABE] text-base text-[#1C2E20] placeholder-[#8A9C8F] focus:outline-none focus:ring-2 focus:ring-[#22482B]"
              />
              <Search className="w-5 h-5 text-[#8A9C8F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Interactive Category Segmented Controls */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-base sm:text-lg font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#22482B] text-white shadow-sm'
                      : 'bg-white text-[#3B4D40] hover:bg-[#EAE1D5] border border-[#DDD0C0]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Ingredients Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 max-h-[500px] overflow-y-auto pr-1">
            {filteredIngredients.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-3.5 sm:p-4 border border-[#E5DACB] shadow-xs hover:border-[#22482B]/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#2E5A36] mb-1">
                    <span>{item.categoryLabel}</span>
                    <span className="text-[#849587] font-semibold">{item.origin}</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-[#1C2E20]">
                    {item.name}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#586A5D] mt-2 line-clamp-2">
                  {item.characteristic}
                </p>
              </div>
            ))}
          </div>

          {filteredIngredients.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-[#E5DACB]">
              <p className="text-lg text-[#5A6D60]">검색 결과에 맞는 원재료가 없습니다.</p>
            </div>
          )}

          {/* Notice bottom */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-[#6C7E71] pt-4 border-t border-[#DFD1C1]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22482B]" />
              <span>본 제품은 보존료, 착색료, 합성향료를 일체 사용하지 않은 <strong>일반가공식품(생식)</strong>입니다.</span>
            </div>
            <span className="text-xs text-[#809185]">원산지: 대한민국 100%</span>
          </div>
        </div>

      </div>
    </section>
  );
};
