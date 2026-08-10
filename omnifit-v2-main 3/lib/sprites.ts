// Pixel sprite definitions.
// Each string is a row; each character maps to a color in the palette.
// '.' = transparent. Rows are padded to a uniform width when rendered.

export type Sprite = {
  rows: string[]
  palette: Record<string, string>
}

// The player: a lean fighter in a neon training suit.
export const HERO: Sprite = {
  palette: {
    o: '#05060a', // outline
    s: '#e9b48a', // skin
    h: '#2b2b30', // hair
    n: '#e8ff47', // neon suit
    d: '#aebd34', // suit shadow
    b: '#15161b', // boots / gloves
    e: '#0a0a0a', // eyes
  },
  rows: [
    '......oooo......',
    '.....ohhhho.....',
    '....ohhhhhho....',
    '....osssssso....',
    '....oseesseo....',
    '....osssssso....',
    '....osssssso....',
    '.....osssso.....',
    '....onnnnnno....',
    '...onnnnnnnno...',
    '..onndnnnndnno..',
    '..osnnnnnnnnso..',
    '..oo.onnnno.oo..',
    '.....obbbbo.....',
    '....obboobbo....',
    '....obboobbo....',
  ],
}

// The boss: a hulking armored brute with horns and glowing eyes.
export const BOSS: Sprite = {
  palette: {
    o: '#05060a', // outline
    a: '#3a2d4a', // dark armor
    p: '#5a4570', // armor highlight
    r: '#ff4d4d', // glowing eyes / core
    k: '#1d1726', // shadow
    t: '#c9b8e0', // horns / teeth
    m: '#2a2030', // mouth
  },
  rows: [
    '..o........o....',
    '.oto......oto...',
    '.otoo....ooto...',
    '..oaaoooooaao...',
    '.oaaapppppaaao..',
    'oaaaaaaaaaaaaao.',
    'oaarraaaaarraao.',
    'oaarraaaaarraao.',
    'oaaaaaaaaaaaaao.',
    'oaaammmmmmaaaao.',
    'oaaomtttttmoaao.',
    'oaaaommmmoaaaao.',
    '.oaaaaaaaaaaao..',
    '..oaaooooaaao...',
    '..oaao..oaaao...',
    '..oooo..oooo....',
  ],
}
