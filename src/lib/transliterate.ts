// Lets users search office locations typing Latin letters (common on BG keyboards/habits)
// even though all courier data is in Cyrillic. Characters we don't recognize pass through
// unchanged, so Cyrillic input keeps working exactly as before.

// A few major cities don't transliterate cleanly letter-by-letter (irregular spelling,
// historic Latin names, or а/ъ ambiguity), so they're special-cased here.
const CITY_ALIASES: Record<string, string> = {
  sofia: 'софия',
  plovdiv: 'пловдив',
  varna: 'варна',
  burgas: 'бургас',
  ruse: 'русе',
  pleven: 'плевен',
  sliven: 'сливен',
  dobrich: 'добрич',
  shumen: 'шумен',
  pernik: 'перник',
  haskovo: 'хасково',
  yambol: 'ямбол',
  pazardzhik: 'пазарджик',
  blagoevgrad: 'благоевград',
  vratsa: 'враца',
  gabrovo: 'габрово',
  asenovgrad: 'асеновград',
  kazanlak: 'казанлък',
  kazanluk: 'казанлък',
  kyustendil: 'кюстендил',
  montana: 'монтана',
  lovech: 'ловеч',
  silistra: 'силистра',
  razgrad: 'разград',
  targovishte: 'търговище',
  smolyan: 'смолян',
  vidin: 'видин',
  kardzhali: 'кърджали',
  svishtov: 'свищов',
  dimitrovgrad: 'димитровград',
  petrich: 'петрич',
  samokov: 'самоков',
  karlovo: 'карлово',
  'veliko tarnovo': 'велико търново',
  'stara zagora': 'стара загора',
}

const DIGRAPHS: [string, string][] = [
  ['sht', 'щ'],
  ['zh', 'ж'],
  ['ts', 'ц'],
  ['ch', 'ч'],
  ['sh', 'ш'],
  ['yu', 'ю'],
  ['ya', 'я'],
]

const SINGLE: Record<string, string> = {
  a: 'а', b: 'б', v: 'в', g: 'г', d: 'д', e: 'е', z: 'з', i: 'и', j: 'й',
  k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', r: 'р', s: 'с', t: 'т',
  u: 'у', f: 'ф', h: 'х', c: 'ц', y: 'ъ', w: 'в', q: 'к',
}

export function transliterateToCyrillic(input: string): string {
  const lower = input.toLowerCase().trim()
  if (CITY_ALIASES[lower]) return CITY_ALIASES[lower]

  let result = ''
  let i = 0
  while (i < lower.length) {
    const rest = lower.slice(i)
    const digraph = DIGRAPHS.find(([latin]) => rest.startsWith(latin))
    if (digraph) {
      result += digraph[1]
      i += digraph[0].length
      continue
    }
    result += SINGLE[lower[i]] ?? lower[i]
    i += 1
  }
  return result
}
