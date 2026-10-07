export interface IngredientItem {
  id: string;
  name: string;
  category: 'grain' | 'bean' | 'leaf' | 'root' | 'fruit' | 'mushroom';
  categoryLabel: string;
  origin: string;
  characteristic: string;
}

export const CATEGORIES = [
  { id: 'all', label: '전체 (50종)' },
  { id: 'grain', label: '통곡물·잡곡 (15종)' },
  { id: 'bean', label: '콩·두류 (5종)' },
  { id: 'leaf', label: '초록 잎채소 (12종)' },
  { id: 'root', label: '뿌리채소 (8종)' },
  { id: 'fruit', label: '과채·과일 (6종)' },
  { id: 'mushroom', label: '버섯·해조 (4종)' },
] as const;

export const INGREDIENTS_50: IngredientItem[] = [
  // 통곡물·잡곡 15종
  { id: '1', name: '현미', category: 'grain', categoryLabel: '통곡물', origin: '국내산', characteristic: '도정하지 않은 쌀겨와 쌀눈의 풍미' },
  { id: '2', name: '발아현미', category: 'grain', categoryLabel: '통곡물', origin: '국내산', characteristic: '싹을 틔워 더욱 부드럽고 구수한 맛' },
  { id: '3', name: '찰흑미', category: 'grain', categoryLabel: '통곡물', origin: '국내산', characteristic: '깊고 짙은 곡물의 그윽한 향과 색감' },
  { id: '4', name: '찹쌀', category: 'grain', categoryLabel: '통곡물', origin: '국내산', characteristic: '찰기 있고 부드러운 목넘김' },
  { id: '5', name: '보리', category: 'grain', categoryLabel: '통곡물', origin: '국내산', characteristic: '전통 시골 방앗간의 담백하고 구수한 맛' },
  { id: '6', name: '발아보리', category: 'grain', categoryLabel: '통곡물', origin: '국내산', characteristic: '발아 과정을 거쳐 한층 부드러운 곡물' },
  { id: '7', name: '찰수수', category: 'grain', categoryLabel: '통곡물', origin: '국내산', characteristic: '은은한 단맛과 알찬 곡식의 풍미' },
  { id: '8', name: '조', category: 'grain', categoryLabel: '통곡물', origin: '국내산', characteristic: '작고 고소한 노란 알곡의 담백함' },
  { id: '9', name: '기장', category: 'grain', categoryLabel: '통곡물', origin: '국내산', characteristic: '풍성한 식감과 깊은 고소함' },
  { id: '10', name: '율무', category: 'grain', categoryLabel: '통곡물', origin: '국내산', characteristic: '차분하고 묵직한 곡물의 든든함' },
  { id: '11', name: '메밀', category: 'grain', categoryLabel: '통곡물', origin: '국내산', characteristic: '청량하고 산뜻한 봉평 메밀 원물' },
  { id: '12', name: '검은깨(흑임자)', category: 'grain', categoryLabel: '통곡물', origin: '국내산', characteristic: '진하고 꼬소한 천연 블랙 곡물향' },
  { id: '13', name: '참깨', category: 'grain', categoryLabel: '통곡물', origin: '국내산', characteristic: '고소함을 더해주는 자연 볶음 원물' },
  { id: '14', name: '들깨', category: 'grain', categoryLabel: '통곡물', origin: '국내산', characteristic: '포근하고 부드러운 우리 땅 들깨' },
  { id: '15', name: '귀리(오트밀)', category: 'grain', categoryLabel: '통곡물', origin: '국내산', characteristic: '씹을수록 담백하고 든든한 알곡' },

  // 콩·두류 5종
  { id: '16', name: '서리태(검은콩)', category: 'bean', categoryLabel: '콩·두류', origin: '국내산', characteristic: '속이 파란 우리 서리태의 깊은 고소함' },
  { id: '17', name: '백태(메주콩)', category: 'bean', categoryLabel: '콩·두류', origin: '국내산', characteristic: '전통 두부처럼 부드럽고 은은한 단맛' },
  { id: '18', name: '쥐눈이콩(약콩)', category: 'bean', categoryLabel: '콩·두류', origin: '국내산', characteristic: '작고 알찬 국내산 토종 검정콩' },
  { id: '19', name: '완두콩', category: 'bean', categoryLabel: '콩·두류', origin: '국내산', characteristic: '은은한 초록빛과 달큰하고 부드러운 맛' },
  { id: '20', name: '강낭콩', category: 'bean', categoryLabel: '콩·두류', origin: '국내산', characteristic: '담백하고 든든함을 더해주는 원물' },

  // 초록 잎채소 12종
  { id: '21', name: '케일', category: 'leaf', categoryLabel: '잎채소', origin: '국내산', characteristic: '푸른 자연의 생명력을 품은 대표 잎채소' },
  { id: '22', name: '신선초', category: 'leaf', categoryLabel: '잎채소', origin: '국내산', characteristic: '은은한 쌉싸름함과 맑은 채소 본연의 향' },
  { id: '23', name: '시금치', category: 'leaf', categoryLabel: '잎채소', origin: '국내산', characteristic: '부드럽고 달큰한 포항초 시금치 원물' },
  { id: '24', name: '양배추', category: 'leaf', categoryLabel: '잎채소', origin: '국내산', characteristic: '속을 편안하고 산뜻하게 보듬는 맛' },
  { id: '25', name: '브로콜리', category: 'leaf', categoryLabel: '잎채소', origin: '국내산', characteristic: '초록 봉오리의 깔끔하고 담백한 풍미' },
  { id: '26', name: '청경채', category: 'leaf', categoryLabel: '잎채소', origin: '국내산', characteristic: '아삭하고 맑은 수분감을 간직한 잎채소' },
  { id: '27', name: '어린보리싹(새싹보리)', category: 'leaf', categoryLabel: '잎채소', origin: '국내산', characteristic: '초록빛 파릇파릇한 봄의 활력' },
  { id: '28', name: '밀싹', category: 'leaf', categoryLabel: '잎채소', origin: '국내산', characteristic: '싱그럽고 맑은 자연 채소의 풋내음' },
  { id: '29', name: '쑥', category: 'leaf', categoryLabel: '잎채소', origin: '국내산', characteristic: '은은하고 향긋한 전통 우리 봄쑥' },
  { id: '30', name: '미나리', category: 'leaf', categoryLabel: '잎채소', origin: '국내산', characteristic: '청도 맑은 물에서 자란 상쾌한 향' },
  { id: '31', name: '취나물', category: 'leaf', categoryLabel: '잎채소', origin: '국내산', characteristic: '산내음 가득한 향긋한 나물 원물' },
  { id: '32', name: '파슬리', category: 'leaf', categoryLabel: '잎채소', origin: '국내산', characteristic: '깔끔하고 정갈한 끝맛을 주는 채소' },

  // 뿌리채소 8종
  { id: '33', name: '우엉', category: 'root', categoryLabel: '뿌리채소', origin: '국내산', characteristic: '흙의 맑은 기운을 품은 구수한 풍미' },
  { id: '34', name: '연근', category: 'root', categoryLabel: '뿌리채소', origin: '국내산', characteristic: '차분하고 은은한 단맛의 뿌리 원물' },
  { id: '35', name: '당근', category: 'root', categoryLabel: '뿌리채소', origin: '국내산', characteristic: '자연스러운 주황빛과 달달한 감칠맛' },
  { id: '36', name: '마(산약)', category: 'root', categoryLabel: '뿌리채소', origin: '국내산', characteristic: '부드러운 식감과 속 편안한 든든함' },
  { id: '37', name: '더덕', category: 'root', categoryLabel: '뿌리채소', origin: '국내산', characteristic: '숲속 흙내음의 깊고 그윽한 뿌리향' },
  { id: '38', name: '도라지', category: 'root', categoryLabel: '뿌리채소', origin: '국내산', characteristic: '맑고 시원한 맛을 더하는 3년근 도라지' },
  { id: '39', name: '비트', category: 'root', categoryLabel: '뿌리채소', origin: '국내산', characteristic: '고운 붉은빛과 담백한 흙단맛' },
  { id: '40', name: '무', category: 'root', categoryLabel: '뿌리채소', origin: '국내산', characteristic: '시원하고 깔끔한 뒷맛을 내는 제주 무' },

  // 과채·과일 6종
  { id: '41', name: '단호박', category: 'fruit', categoryLabel: '과채류', origin: '국내산', characteristic: '설탕 없이도 은은하게 감도는 천연 단맛' },
  { id: '42', name: '사과', category: 'fruit', categoryLabel: '과일류', origin: '국내산', characteristic: '자연스러운 상큼함으로 목넘김을 산뜻하게' },
  { id: '43', name: '배', category: 'fruit', categoryLabel: '과일류', origin: '국내산', characteristic: '시원하고 은은한 과즙의 청량감' },
  { id: '44', name: '토마토', category: 'fruit', categoryLabel: '과채류', origin: '국내산', characteristic: '완숙 토마토의 풍부하고 감칠맛 나는 원물' },
  { id: '45', name: '대추', category: 'fruit', categoryLabel: '과실류', origin: '국내산', characteristic: '보은 대추의 따뜻하고 포근한 천연 단맛' },
  { id: '46', name: '감', category: 'fruit', categoryLabel: '과일류', origin: '국내산', characteristic: '부드러운 질감과 달콤한 전통 과일 원물' },

  // 버섯·해조 4종
  { id: '47', name: '표고버섯', category: 'mushroom', categoryLabel: '버섯류', origin: '국내산', characteristic: '참나무 원목에서 자란 깊은 감칠맛' },
  { id: '48', name: '영지버섯', category: 'mushroom', categoryLabel: '버섯류', origin: '국내산', characteristic: '자연의 묵직한 풍미를 담은 버섯 원물' },
  { id: '49', name: '완도 미역', category: 'mushroom', categoryLabel: '해조류', origin: '국내산', characteristic: '남해 청정 바다의 미네랄과 부드러움' },
  { id: '50', name: '기장 다시마', category: 'mushroom', categoryLabel: '해조류', origin: '국내산', characteristic: '바다의 깊은 감칠맛과 담백한 조화' }
];
