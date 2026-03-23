import satori from 'satori';
import sharp from 'sharp';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
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

// Google Fonts API에서 Noto Sans KR 폰트를 다운로드하여 캐싱
async function fetchGoogleFont(weight: 400 | 700): Promise<ArrayBuffer | null> {
  const cacheDir = join(process.cwd(), 'node_modules', '.cache', 'fonts');
  const cachePath = join(cacheDir, `NotoSansKR-${weight}.ttf`);

  // 캐시에 있으면 바로 반환
  if (existsSync(cachePath)) {
    const buffer = readFileSync(cachePath);
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
  }

  try {
    // Google Fonts CSS API에서 TTF URL 추출
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@${weight}&display=swap`;
    const cssRes = await fetch(cssUrl, {
      headers: {
        // TTF를 받기 위해 오래된 User-Agent 사용
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
      },
    });
    const css = await cssRes.text();

    // CSS에서 TTF URL 추출
    const urlMatch = css.match(/src:\s*url\(([^)]+\.ttf)\)/);
    if (!urlMatch) {
      console.warn(`[og-image] Could not extract font URL for weight ${weight}`);
      return null;
    }

    const fontRes = await fetch(urlMatch[1]);
    const fontBuffer = await fontRes.arrayBuffer();

    // 캐싱
    mkdirSync(cacheDir, { recursive: true });
    writeFileSync(cachePath, Buffer.from(fontBuffer));
    console.log(`[og-image] Cached Noto Sans KR ${weight} from Google Fonts`);

    return fontBuffer;
  } catch (e) {
    console.warn(`[og-image] Failed to fetch Noto Sans KR ${weight} from Google Fonts:`, e);
    return null;
  }
}

export async function generateOGImage(options: OGImageOptions): Promise<Buffer> {
  const { title, description, type, category } = options;

  const fonts: {
    name: string;
    data: ArrayBuffer;
    weight: 400 | 700;
    style: 'normal';
  }[] = [];

  // Google Fonts에서 Noto Sans KR 다운로드 (캐싱됨)
  const [regularFont, boldFont] = await Promise.all([
    fetchGoogleFont(400),
    fetchGoogleFont(700),
  ]);

  if (regularFont) {
    fonts.push({ name: 'Noto Sans KR', data: regularFont, weight: 400, style: 'normal' });
  } else {
    console.warn('[og-image] Failed to load Noto Sans KR Regular. Korean text may not render.');
  }

  if (boldFont) {
    fonts.push({ name: 'Noto Sans KR', data: boldFont, weight: 700, style: 'normal' });
  } else {
    console.warn('[og-image] Failed to load Noto Sans KR Bold.');
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
