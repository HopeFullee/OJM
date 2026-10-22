import StyleDictionary from 'style-dictionary';

// tokens/ojm-tokens.json → Tailwind CSS v4 테마(@theme)
// { "value": { "colorBrandHover": "#9a3412", "spacingCardSm": 16, ... } } 형태의 평평한 camelCase 키를
// 앞부분(color, spacing, container, radius, font, text)으로 네임스페이스를 나눠 변환합니다.
//   colorBrandHover   → --color-brand-hover    → bg-brand-hover, text-brand-hover
//   spacingCardSm     → --spacing-card-sm      → p-card-sm
//   containerContentLg→ --container-content-lg → max-w-content-lg
//   radiusButtonMd    → --radius-button-md     → rounded-button-md
//   fontSans          → --font-sans            → font-sans
//   textDisplay       → --text-display         → text-display
// 결과 파일을 `@import "tailwindcss";` 다음에 import하세요.

const NAMESPACES = ['color', 'spacing', 'container', 'radius', 'font', 'text'];
const FONT_FALLBACK = { sans: 'system-ui, sans-serif', display: 'sans-serif' };

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

// 평평한 camelCase 키 → { color: { 'brand-hover': { $value, $type } }, ... }
StyleDictionary.registerParser({
  name: 'ojm/flat-camel',
  pattern: /\.json$/,
  parser: ({ contents, filePath }) => {
    const flat = JSON.parse(contents).value ?? {};
    const tree = {};
    for (const [key, value] of Object.entries(flat)) {
      const ns = NAMESPACES.find((n) => key.startsWith(n) && /[A-Z]/.test(key[n.length] ?? ''));
      if (!ns) throw new Error(`[${filePath}] 알 수 없는 토큰 키: ${key}`);
      const name = kebab(key.slice(ns.length));
      const $type = ns === 'color' ? 'color' : typeof value === 'number' ? 'number' : 'string';
      (tree[ns] ??= {})[name] = { $value: value, $type };
    }
    return tree;
  },
});

StyleDictionary.registerTransform({
  name: 'ojm/name',
  type: 'name',
  transform: (token) => token.path.join('-'),
});

StyleDictionary.registerTransform({
  name: 'ojm/value',
  type: 'value',
  filter: (token) => ['number', 'string'].includes(token.$type),
  transform: (token) => {
    const [ns, name] = token.path;
    if (token.$type === 'number') return `${token.$value}px`;
    if (ns === 'font') return [`"${token.$value}"`, FONT_FALLBACK[name]].filter(Boolean).join(', ');
    return token.$value;
  },
});

const sd = new StyleDictionary({
  source: ['tokens/**/*.json'],
  parsers: ['ojm/flat-camel'],
  platforms: {
    css: {
      transforms: ['ojm/name', 'ojm/value'],
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { selector: '@theme' },
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();
