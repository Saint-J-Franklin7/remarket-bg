const NAMES = [
  'Иван П.', 'Мария К.', 'Георги Т.', 'Елена Д.', 'Стефан Н.',
  'Виктория С.', 'Николай Г.', 'Десислава М.', 'Петър В.', 'Ралица Х.',
  'Димитър Й.', 'Анна Р.', 'Христо Б.', 'Славена Л.', 'Тодор Ж.',
]

// Some entries are empty on purpose — not everyone leaves a comment, only a star rating.
const TEXTS = [
  'Много съм доволна, стигна бързо и опаковката беше добра.',
  'Точно както на снимките, препоръчвам!',
  'Топ качество за цената.',
  'Поръчах и останах приятно изненадан от бързината на доставката.',
  'Добро съотношение цена-качество.',
  'Използвам го от седмица, много съм доволен засега.',
  'Идеално, тъкмо това търсех.',
  '',
  'Ще поръчам отново, всичко беше наред.',
  '',
  'Доставката беше супер бърза, продуктът си заслужава парите.',
  'Изглежда качествено, точно както се очаква.',
  '',
  'Купих го като подарък, много хареса на човека.',
]

function seededRandom(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return (h % 10000) / 10000
}

function pick<T>(arr: T[], seed: string): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)]
}

export interface FakeReview {
  name: string
  rating: number
  text: string
  daysAgo: number
}

export function getFakeReviews(productId: string): FakeReview[] {
  const reviewCount = 2 + Math.floor(seededRandom(productId + ':reviewcount') * 3) // 2–4 shown
  const reviews: FakeReview[] = []
  for (let i = 0; i < reviewCount; i++) {
    const seed = `${productId}:review:${i}`
    reviews.push({
      name: pick(NAMES, seed + ':name'),
      rating: seededRandom(seed + ':rating') > 0.25 ? 5 : 4,
      text: pick(TEXTS, seed + ':text'),
      daysAgo: 1 + Math.floor(seededRandom(seed + ':days') * 60),
    })
  }
  return reviews
}
