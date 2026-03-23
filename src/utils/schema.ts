const BASE_URL = 'https://dal.ink';

const CATEGORY_MAP: Record<string, string> = {
  productivity: 'ProductivityApplication',
  'developer-tools': 'DeveloperApplication',
  design: 'DesignApplication',
  communication: 'CommunicationApplication',
  education: 'EducationalApplication',
  finance: 'FinanceApplication',
  health: 'HealthApplication',
  entertainment: 'EntertainmentApplication',
  social: 'SocialNetworkingApplication',
  utilities: 'UtilitiesApplication',
  ai: 'AIApplication',
  other: 'WebApplication',
};

export interface ServiceData {
  name: string;
  url: string;
  type: 'web' | 'app' | 'both';
  description: string;
  screenshot: string;
  category: string;
  tags: string[];
  author: string;
  repo?: string;
  appStore?: string;
  playStore?: string;
  longDescription?: string;
  ogImage?: string;
  faq?: { question: string; answer: string }[];
  featured: boolean;
  publishedAt: Date;
  enriched: boolean;
}

export function generateWebSiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dalink',
    url: BASE_URL,
    description: 'Open-source service & app directory. Discover and share useful tools and apps.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/services?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateItemListSchema(
  services: { data: ServiceData; id: string }[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Dalink — Service & App Directory',
    url: `${BASE_URL}/services`,
    numberOfItems: services.length,
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: service.data.name,
      description: service.data.description,
      url: `${BASE_URL}/services/${service.id}`,
    })),
  };
}

export function generateApplicationSchema(service: ServiceData, slug: string): object {
  const isMobile = service.type === 'app' || service.type === 'both';
  const schemaType = isMobile ? 'MobileApplication' : 'SoftwareApplication';

  const operatingSystems: string[] = [];
  if (service.appStore) operatingSystems.push('iOS');
  if (service.playStore) operatingSystems.push('Android');
  if (service.type === 'web' || service.type === 'both') operatingSystems.push('Web');

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: service.name,
    url: service.url,
    description: service.longDescription ?? service.description,
    applicationCategory: CATEGORY_MAP[service.category] ?? 'WebApplication',
    datePublished: service.publishedAt.toISOString().split('T')[0],
    author: {
      '@type': 'Person',
      name: service.author,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/services/${slug}`,
    },
  };

  if (operatingSystems.length > 0) {
    schema.operatingSystem = operatingSystems.join(', ');
  }

  if (service.screenshot) {
    schema.screenshot = service.screenshot.startsWith('http')
      ? service.screenshot
      : `${BASE_URL}${service.screenshot}`;
  }

  if (service.appStore) {
    schema.installUrl = service.appStore;
  }

  if (service.repo) {
    schema.codeRepository = service.repo;
  }

  if (service.tags && service.tags.length > 0) {
    schema.keywords = service.tags.join(', ');
  }

  return schema;
}

export function generateFAQSchema(
  faq: { question: string; answer: string }[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(serviceName: string, slug: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: `${BASE_URL}/services`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: serviceName,
        item: `${BASE_URL}/services/${slug}`,
      },
    ],
  };
}
