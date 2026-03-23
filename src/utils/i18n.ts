export type Locale = 'ko' | 'en';
export const locales: Locale[] = ['ko', 'en'];
export const defaultLocale: Locale = 'ko';

export const localeLabels: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
};

interface ServiceData {
  description_ko?: string;
  description_en?: string;
  longDescription_ko?: string;
  longDescription_en?: string;
  faq_ko?: { question: string; answer: string }[];
  faq_en?: { question: string; answer: string }[];
  [key: string]: unknown;
}

// Get localized description with fallback
export function getDescription(data: ServiceData, locale: Locale): string {
  if (locale === 'ko') return data.description_ko || data.description_en || '';
  return data.description_en || data.description_ko || '';
}

// Get localized long description with fallback
export function getLongDescription(data: ServiceData, locale: Locale): string | undefined {
  if (locale === 'ko') return data.longDescription_ko || data.longDescription_en;
  return data.longDescription_en || data.longDescription_ko;
}

// Get localized FAQ with fallback
export function getFaq(data: ServiceData, locale: Locale): { question: string; answer: string }[] | undefined {
  if (locale === 'ko') return data.faq_ko || data.faq_en;
  return data.faq_en || data.faq_ko;
}

// Split body content by <!-- @en --> marker
export function getLocalizedBody(rawBody: string, locale: Locale): string {
  const marker = '<!-- @en -->';
  const parts = rawBody.split(marker);
  if (parts.length < 2) {
    // Only one language provided, use it for both
    return parts[0].trim();
  }
  return locale === 'ko' ? parts[0].trim() : parts[1].trim();
}

// Check if service has content in the specified locale
export function hasLocale(data: ServiceData, locale: Locale): boolean {
  if (locale === 'ko') return !!(data.description_ko);
  return !!(data.description_en);
}

// UI labels per locale
export const uiLabels = {
  ko: {
    home: '홈',
    search: '서비스 검색...',
    allCategories: '전체',
    servicesCount: (n: number) => `${n}개의 서비스`,
    visitService: '서비스 방문하기',
    faqTitle: '자주 묻는 질문',
    relatedServices: '관련 서비스',
    getStarted: '서비스 등록은 이렇게 간단합니다',
    getStartedTitle: '서비스 등록은 이렇게 간단합니다',
    step1Title: '서비스 정보 작성',
    step1Desc: '이름, URL, 설명, 스크린샷을 준비하고 마크다운 파일을 작성합니다.',
    step2Title: 'PR 제출',
    step2Desc: 'GitHub에서 Pull Request를 제출하면 자동 검수가 진행됩니다.',
    step3Title: '자동 배포',
    step3Desc: '승인되면 AI가 메타데이터를 보강하고 사이트에 자동 게시됩니다.',
    registerService: '서비스 등록하기',
    viewHowTo: '등록 방법 보기',
    viewHowToRegister: '등록 방법 보기',
    claudeCodeHint: 'Claude Code로 만들기',
    searchPlaceholder: '서비스 검색...',
    categoryFilterLabel: '카테고리 필터',
    serviceCount: '개의 서비스',
    itemListName: '서비스 목록',
    siteDescription: '누구나 PR로 등록하는 오픈소스 서비스 & 앱 디렉토리.',
    pageTitle: 'Dalink - 서비스 & 앱 디렉토리',
    pageDescription: '누구나 PR로 등록하는 오픈소스 서비스 & 앱 디렉토리. 유용한 웹 서비스와 앱을 발견하세요.',
    heroTitle: '누구나 PR로 등록하는\n오픈소스 서비스 디렉토리',
    heroSubtitle: '유용한 웹 서비스와 앱을 발견하고, 직접 등록해보세요.',
    pageNotFound: '페이지를 찾을 수 없습니다',
    pageNotFoundDesc: '요청하신 페이지가 존재하지 않거나 이동되었습니다.',
    goHome: '홈으로 돌아가기',
    noResults: '검색 결과가 없습니다.',
    poweredBy: 'Powered by',
    todaysService: '오늘의 서비스',
    today: '오늘',
    new: '새로운',
    makers: '메이커',
    makersPageTitle: '메이커 - Dalink',
    makersPageDescription: '서비스를 만든 사람들을 만나보세요',
    makerServices: '등록한 서비스',
    viewProfile: '프로필 보기',
    joinedDate: '가입일',
  },
  en: {
    home: 'Home',
    search: 'Search services...',
    allCategories: 'All',
    servicesCount: (n: number) => `${n} services`,
    visitService: 'Visit Service',
    faqTitle: 'Frequently Asked Questions',
    relatedServices: 'Related Services',
    getStarted: 'Registering a service is simple',
    getStartedTitle: 'Registering a service is simple',
    step1Title: 'Write Service Info',
    step1Desc: 'Prepare the name, URL, description, and screenshot, then create a markdown file.',
    step2Title: 'Submit a PR',
    step2Desc: 'Submit a Pull Request on GitHub and automated review will begin.',
    step3Title: 'Auto Deploy',
    step3Desc: 'Once approved, AI enriches metadata and the site is published automatically.',
    registerService: 'Register a Service',
    viewHowTo: 'View How-To',
    viewHowToRegister: 'View How to Register',
    claudeCodeHint: 'Build with Claude Code',
    searchPlaceholder: 'Search services...',
    categoryFilterLabel: 'Category filter',
    serviceCount: ' services',
    itemListName: 'Service List',
    siteDescription: 'Open-source service & app directory where anyone can register via PR.',
    pageTitle: 'Dalink - Service & App Directory',
    pageDescription: 'Open-source service & app directory where anyone can register via PR. Discover useful web services and apps.',
    heroTitle: 'Open-source service directory\nwhere anyone can register via PR',
    heroSubtitle: 'Discover useful web services and apps, and register your own.',
    pageNotFound: 'Page Not Found',
    pageNotFoundDesc: 'The page you requested does not exist or has been moved.',
    goHome: 'Go Home',
    noResults: 'No results found.',
    poweredBy: 'Powered by',
    todaysService: "Today's Service",
    today: 'Today',
    new: 'New',
    makers: 'Makers',
    makersPageTitle: 'Makers - Dalink',
    makersPageDescription: 'Meet the people behind the services',
    makerServices: 'Registered Services',
    viewProfile: 'View Profile',
    joinedDate: 'Joined',
  },
} as const;

export const categoryLabels: Record<Locale, Record<string, string>> = {
  ko: {
    productivity: '생산성',
    'developer-tools': '개발자 도구',
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
  },
  en: {
    productivity: 'Productivity',
    'developer-tools': 'Developer Tools',
    design: 'Design',
    communication: 'Communication',
    education: 'Education',
    finance: 'Finance',
    health: 'Health',
    entertainment: 'Entertainment',
    social: 'Social',
    utilities: 'Utilities',
    ai: 'AI',
    other: 'Other',
  },
};
