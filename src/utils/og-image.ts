import satori from 'satori';
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createElement } from 'satori/jsx';

export interface OGImageOptions {
  title: string;
  description: string;
  type: 'web' | 'app' | 'both';
  category: string;
}

const TYPE_LABEL: Record<string, string> = {
  web: '웹',
  app: '앱',
  both: '웹+앱',
};

const CATEGORY_LABEL: Record<string, string> = {
  productivity: '생산성',
  'developer-tools': '개발 도구',
  design: '디자인',
  communication: '커뮤니케이션',
  education: '교육',
  finance: '금융',
  health: '건강',
  entertainment: '엔터테인먼트',
  social: '소셜',
  utilities: '유틸리티',
  ai: 'AI',
  other: '기타',
};

function loadFont(fontPath: string): ArrayBuffer | null {
  try {
    const buffer = readFileSync(fontPath);
    return buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    ) as ArrayBuffer;
  } catch {
    return null;
  }
}

export async function generateOGImage(options: OGImageOptions): Promise<Buffer> {
  const { title, description, type, category } = options;

  const fontDir = join(process.cwd(), 'src', 'assets', 'fonts');

  const fonts: {
    name: string;
    data: ArrayBuffer;
    weight: 400 | 700;
    style: 'normal';
  }[] = [];

  const regularFont = loadFont(join(fontDir, 'NotoSansKR-Regular.ttf'));
  const boldFont = loadFont(join(fontDir, 'NotoSansKR-Bold.ttf'));

  if (regularFont) {
    fonts.push({ name: 'Noto Sans KR', data: regularFont, weight: 400, style: 'normal' });
  } else {
    console.warn('[og-image] NotoSansKR-Regular.ttf not found in src/assets/fonts/. Text may not render correctly.');
  }

  if (boldFont) {
    fonts.push({ name: 'Noto Sans KR', data: boldFont, weight: 700, style: 'normal' });
  } else {
    console.warn('[og-image] NotoSansKR-Bold.ttf not found in src/assets/fonts/. Bold text may not render correctly.');
  }

  const typeLabel = TYPE_LABEL[type] ?? type;
  const categoryLabel = CATEGORY_LABEL[category] ?? category;

  const truncatedDescription =
    description.length > 120 ? description.slice(0, 117) + '...' : description;

  const fontFamily = fonts.length > 0 ? 'Noto Sans KR' : 'sans-serif';

  const element = createElement(
    'div',
    {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'space-between',
        padding: '56px 64px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        fontFamily,
        boxSizing: 'border-box' as const,
      },
    },
    // Top: branding
    createElement(
      'div',
      { style: { display: 'flex', alignItems: 'center' } },
      createElement(
        'span',
        {
          style: {
            fontSize: '24px',
            fontWeight: 700,
            color: '#a5b4fc',
            letterSpacing: '0.05em',
          },
        },
        'dal.ink'
      )
    ),

    // Center: title + description
    createElement(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '20px',
          flex: 1,
          justifyContent: 'center',
        },
      },
      createElement(
        'div',
        {
          style: {
            fontSize: title.length > 30 ? 52 : 64,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          },
        },
        title
      ),
      createElement(
        'div',
        {
          style: {
            fontSize: 24,
            fontWeight: 400,
            color: '#cbd5e1',
            lineHeight: 1.5,
            maxWidth: '900px',
          },
        },
        truncatedDescription
      )
    ),

    // Bottom: type badge + category badge
    createElement(
      'div',
      {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      },
      createElement(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(99, 102, 241, 0.3)',
            border: '1px solid rgba(99, 102, 241, 0.6)',
            borderRadius: '8px',
            padding: '8px 20px',
          },
        },
        createElement(
          'span',
          {
            style: {
              fontSize: 20,
              fontWeight: 700,
              color: '#a5b4fc',
            },
          },
          typeLabel
        )
      ),
      createElement(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(139, 92, 246, 0.3)',
            border: '1px solid rgba(139, 92, 246, 0.6)',
            borderRadius: '8px',
            padding: '8px 20px',
          },
        },
        createElement(
          'span',
          {
            style: {
              fontSize: 20,
              fontWeight: 400,
              color: '#c4b5fd',
            },
          },
          categoryLabel
        )
      )
    )
  );

  const svg = await satori(element as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts,
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return png;
}
