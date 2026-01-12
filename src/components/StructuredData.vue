<script setup lang="ts">
import { computed } from 'vue';
import { useToolStore } from '@/tools/tools.store';

const toolStore = useToolStore();

// Generate Schema.org structured data
const structuredData = computed(() => {
  const tools = toolStore.tools.map(tool => ({
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url: `https://toolsapplab.com${tool.path}`,
    keywords: tool.keywords.join(', '),
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ToolsApp Lab',
    alternateName: 'IT-Tools',
    url: 'https://toolsapplab.com',
    description: '100+ privacy-focused developer tools running locally in your browser. JSON formatter, Base64 encoder, JWT decoder, regex tester, and more.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://toolsapplab.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    about: {
      '@type': 'ItemList',
      itemListElement: tools.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: tool,
      })),
    },
    provider: {
      '@type': 'Organization',
      name: 'ToolsApp Lab',
      url: 'https://toolsapplab.com',
      logo: 'https://toolsapplab.com/logo.png',
    },
    copyrightYear: new Date().getFullYear(),
    license: 'https://creativecommons.org/licenses/GPL-3.0/',
  };
});
</script>

<template>
  <script type="application/ld+json" v-html="JSON.stringify(structuredData)"></script>
</template>
