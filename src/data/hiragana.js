/**
 * Japanese Hiragana Dataset
 * Organized into categories: Basic (Gojūon), Dakuten (Voiced), Handakuten (Semi-voiced), and Yōon (Combinations).
 */

export const HIRAGANA_CATEGORIES = [
  { id: 'basic', name: 'Basic (Gojūon)', description: 'Standard 46 core characters' },
  { id: 'dakuten', name: 'Dakuten (Voiced)', description: 'Voiced consonant rows (G, Z, D, B)' },
  { id: 'handakuten', name: 'Handakuten (Semi-voiced)', description: 'P-row characters' },
  { id: 'yoon', name: 'Yōon (Combinations)', description: 'Contracted sounds (Kya, Sha, Cha, etc.)' }
];

export const HIRAGANA_ROWS = [
  // --- BASIC (46 CHARACTERS) ---
  {
    id: 'a',
    name: 'A-row',
    category: 'basic',
    characters: [
      { kana: 'あ', romaji: 'a' },
      { kana: 'い', romaji: 'i' },
      { kana: 'う', romaji: 'u' },
      { kana: 'え', romaji: 'e' },
      { kana: 'お', romaji: 'o' }
    ]
  },
  {
    id: 'ka',
    name: 'Ka-row',
    category: 'basic',
    characters: [
      { kana: 'か', romaji: 'ka' },
      { kana: 'き', romaji: 'ki' },
      { kana: 'く', romaji: 'ku' },
      { kana: 'け', romaji: 'ke' },
      { kana: 'こ', romaji: 'ko' }
    ]
  },
  {
    id: 'sa',
    name: 'Sa-row',
    category: 'basic',
    characters: [
      { kana: 'さ', romaji: 'sa' },
      { kana: 'し', romaji: 'shi' },
      { kana: 'す', romaji: 'su' },
      { kana: 'せ', romaji: 'se' },
      { kana: 'そ', romaji: 'so' }
    ]
  },
  {
    id: 'ta',
    name: 'Ta-row',
    category: 'basic',
    characters: [
      { kana: 'た', romaji: 'ta' },
      { kana: 'ち', romaji: 'chi' },
      { kana: 'つ', romaji: 'tsu' },
      { kana: 'て', romaji: 'te' },
      { kana: 'と', romaji: 'to' }
    ]
  },
  {
    id: 'na',
    name: 'Na-row',
    category: 'basic',
    characters: [
      { kana: 'な', romaji: 'na' },
      { kana: 'に', romaji: 'ni' },
      { kana: 'ぬ', romaji: 'nu' },
      { kana: 'ね', romaji: 'ne' },
      { kana: 'の', romaji: 'no' }
    ]
  },
  {
    id: 'ha',
    name: 'Ha-row',
    category: 'basic',
    characters: [
      { kana: 'は', romaji: 'ha' },
      { kana: 'ひ', romaji: 'hi' },
      { kana: 'ふ', romaji: 'fu' },
      { kana: 'へ', romaji: 'he' },
      { kana: 'ほ', romaji: 'ho' }
    ]
  },
  {
    id: 'ma',
    name: 'Ma-row',
    category: 'basic',
    characters: [
      { kana: 'ま', romaji: 'ma' },
      { kana: 'み', romaji: 'mi' },
      { kana: 'む', romaji: 'mu' },
      { kana: 'め', romaji: 'me' },
      { kana: 'も', romaji: 'mo' }
    ]
  },
  {
    id: 'ya',
    name: 'Ya-row',
    category: 'basic',
    characters: [
      { kana: 'や', romaji: 'ya' },
      { kana: 'ゆ', romaji: 'yu' },
      { kana: 'よ', romaji: 'yo' }
    ]
  },
  {
    id: 'ra',
    name: 'Ra-row',
    category: 'basic',
    characters: [
      { kana: 'ら', romaji: 'ra' },
      { kana: 'り', romaji: 'ri' },
      { kana: 'る', romaji: 'ru' },
      { kana: 'れ', romaji: 're' },
      { kana: 'ろ', romaji: 'ro' }
    ]
  },
  {
    id: 'wa',
    name: 'Wa-row',
    category: 'basic',
    characters: [
      { kana: 'わ', romaji: 'wa' },
      { kana: 'を', romaji: 'wo' },
      { kana: 'ん', romaji: 'n' }
    ]
  },

  // --- DAKUTEN (VOICED) ---
  {
    id: 'ga',
    name: 'Ga-row',
    category: 'dakuten',
    characters: [
      { kana: 'が', romaji: 'ga' },
      { kana: 'ぎ', romaji: 'gi' },
      { kana: 'ぐ', romaji: 'gu' },
      { kana: 'げ', romaji: 'ge' },
      { kana: 'ご', romaji: 'go' }
    ]
  },
  {
    id: 'za',
    name: 'Za-row',
    category: 'dakuten',
    characters: [
      { kana: 'ざ', romaji: 'za' },
      { kana: 'じ', romaji: 'ji' },
      { kana: 'ず', romaji: 'zu' },
      { kana: 'ぜ', romaji: 'ze' },
      { kana: 'ぞ', romaji: 'zo' }
    ]
  },
  {
    id: 'da',
    name: 'Da-row',
    category: 'dakuten',
    characters: [
      { kana: 'だ', romaji: 'da' },
      { kana: 'ぢ', romaji: 'ji (di)' },
      { kana: 'づ', romaji: 'zu (du)' },
      { kana: 'で', romaji: 'de' },
      { kana: 'ど', romaji: 'do' }
    ]
  },
  {
    id: 'ba',
    name: 'Ba-row',
    category: 'dakuten',
    characters: [
      { kana: 'ば', romaji: 'ba' },
      { kana: 'び', romaji: 'bi' },
      { kana: 'ぶ', romaji: 'bu' },
      { kana: 'べ', romaji: 'be' },
      { kana: 'ぼ', romaji: 'bo' }
    ]
  },

  // --- HANDAKUTEN (SEMI-VOICED) ---
  {
    id: 'pa',
    name: 'Pa-row',
    category: 'handakuten',
    characters: [
      { kana: 'ぱ', romaji: 'pa' },
      { kana: 'ぴ', romaji: 'pi' },
      { kana: 'ぷ', romaji: 'pu' },
      { kana: 'ぺ', romaji: 'pe' },
      { kana: 'ぽ', romaji: 'po' }
    ]
  },

  // --- YOON (COMBINATIONS) ---
  {
    id: 'kya',
    name: 'Kya-row',
    category: 'yoon',
    characters: [
      { kana: 'きゃ', romaji: 'kya' },
      { kana: 'きゅ', romaji: 'kyu' },
      { kana: 'きょ', romaji: 'kyo' }
    ]
  },
  {
    id: 'sha',
    name: 'Sha-row',
    category: 'yoon',
    characters: [
      { kana: 'しゃ', romaji: 'sha' },
      { kana: 'しゅ', romaji: 'shu' },
      { kana: 'しょ', romaji: 'sho' }
    ]
  },
  {
    id: 'cha',
    name: 'Cha-row',
    category: 'yoon',
    characters: [
      { kana: 'ちゃ', romaji: 'cha' },
      { kana: 'ちゅ', romaji: 'chu' },
      { kana: 'ちょ', romaji: 'cho' }
    ]
  },
  {
    id: 'nya',
    name: 'Nya-row',
    category: 'yoon',
    characters: [
      { kana: 'にゃ', romaji: 'nya' },
      { kana: 'にゅ', romaji: 'nyu' },
      { kana: 'にょ', romaji: 'nyo' }
    ]
  },
  {
    id: 'hya',
    name: 'Hya-row',
    category: 'yoon',
    characters: [
      { kana: 'ひゃ', romaji: 'hya' },
      { kana: 'ひゅ', romaji: 'hyu' },
      { kana: 'ひょ', romaji: 'hyo' }
    ]
  },
  {
    id: 'mya',
    name: 'Mya-row',
    category: 'yoon',
    characters: [
      { kana: 'みゃ', romaji: 'mya' },
      { kana: 'みゅ', romaji: 'myu' },
      { kana: 'みょ', romaji: 'myo' }
    ]
  },
  {
    id: 'rya',
    name: 'Rya-row',
    category: 'yoon',
    characters: [
      { kana: 'りゃ', romaji: 'rya' },
      { kana: 'りゅ', romaji: 'ryu' },
      { kana: 'りょ', romaji: 'ryo' }
    ]
  },
  {
    id: 'gya',
    name: 'Gya-row',
    category: 'yoon',
    characters: [
      { kana: 'ぎゃ', romaji: 'gya' },
      { kana: 'ぎゅ', romaji: 'gyu' },
      { kana: 'ぎょ', romaji: 'gyo' }
    ]
  },
  {
    id: 'ja',
    name: 'Ja-row',
    category: 'yoon',
    characters: [
      { kana: 'じゃ', romaji: 'ja' },
      { kana: 'じゅ', romaji: 'ju' },
      { kana: 'じょ', romaji: 'jo' }
    ]
  },
  {
    id: 'bya',
    name: 'Bya-row',
    category: 'yoon',
    characters: [
      { kana: 'びゃ', romaji: 'bya' },
      { kana: 'びゅ', romaji: 'byu' },
      { kana: 'びょ', romaji: 'byo' }
    ]
  },
  {
    id: 'pya',
    name: 'Pya-row',
    category: 'yoon',
    characters: [
      { kana: 'ぴゃ', romaji: 'pya' },
      { kana: 'ぴゅ', romaji: 'pyu' },
      { kana: 'ぴょ', romaji: 'pyo' }
    ]
  }
];

// Attach row metadata to each character for easy lookup
HIRAGANA_ROWS.forEach(row => {
  row.characters.forEach(char => {
    char.rowId = row.id;
    char.rowName = row.name;
    char.category = row.category;
  });
});

/**
 * Get all Hiragana characters flattened into a single list
 */
export function getAllCharacters() {
  return HIRAGANA_ROWS.flatMap(row => row.characters);
}

/**
 * Get all basic (Gojūon) row IDs
 */
export function getBasicRowIds() {
  return HIRAGANA_ROWS.filter(row => row.category === 'basic').map(row => row.id);
}

/**
 * Get characters filtered by an array or Set of selected row IDs
 */
export function getCharactersByRowIds(selectedRowIds) {
  const rowIdSet = new Set(selectedRowIds);
  return HIRAGANA_ROWS
    .filter(row => rowIdSet.has(row.id))
    .flatMap(row => row.characters);
}
