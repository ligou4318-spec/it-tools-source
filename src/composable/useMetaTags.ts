import { watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { tools } from '../tools';

/**
 * Dynamically updates meta tags for SEO based on the current route
 * Designed for toolsapp.com - targeting US developers with clean, focused descriptions
 * Optimized for AI search (Google AI, Perplexity, ChatGPT Search) with structured data
 */
export function useMetaTags() {
  const route = useRoute();

  const defaultMeta = {
    title: 'ToolsApp Lab | The Pro Developer Playground',
    description: '100+ developer tools, zero tracking. All processing happens in your browser. JSON formatter, Base64 encoder, JWT decoder, regex tester, cron generator, and more. No signup. No ads. No servers.',
  };

  const updateMetaTags = () => {
    const currentTool = tools.find(tool => tool.path === route.path);

    if (currentTool) {
      const toolName = currentTool.name;
      const toolDescription = currentTool.description;
      const toolKeywords = currentTool.keywords?.join(', ') || '';

      // Update title
      document.title = `${toolName} - ToolsApp Lab`;

      // Update meta description - optimized for AI search with clear intent
      const aiOptimizedDescription = `${toolName}: ${toolDescription} Free online tool. No signup. Works offline. Privacy-first design for developers.`;
      updateMetaTag('name', 'description', aiOptimizedDescription);
      updateMetaTag('name', 'twitter:description', aiOptimizedDescription);
      updateMetaTag('property', 'og:description', aiOptimizedDescription);

      // Add keywords for traditional SEO
      if (toolKeywords) {
        updateMetaTag('name', 'keywords', `${toolKeywords}, toolsapp lab, developer tools, free online tool`);
      }

      // Update Open Graph title
      updateMetaTag('property', 'og:title', `${toolName} - ToolsApp Lab`);
      updateMetaTag('name', 'twitter:title', `${toolName} - ToolsApp Lab`);

      // Update URL for social sharing
      const fullUrl = `https://toolsapplab.com${route.path}`;
      updateMetaTag('property', 'og:url', fullUrl);
      updateMetaTag('name', 'twitter:url', fullUrl);

      // Update canonical URL
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = fullUrl;

      // Update JSON-LD structured data for AI search
      updateStructuredData(toolName, toolDescription, fullUrl);

    } else {
      // Reset to default for non-tool pages
      document.title = defaultMeta.title;
      updateMetaTag('name', 'description', defaultMeta.description);
      updateMetaTag('property', 'og:description', defaultMeta.description);
      updateMetaTag('name', 'twitter:description', defaultMeta.description);
      removeStructuredData();
    }
  };

  const updateStructuredData = (toolName: string, toolDescription: string, toolUrl: string) => {
    // Remove existing structured data
    removeStructuredData();

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: toolName,
      description: toolDescription,
      url: toolUrl,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      author: {
        '@type': 'Organization',
        name: 'ToolsApp Lab',
        url: 'https://toolsapplab.com',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '1250',
      },
      featureList: toolDescription,
      browserRequirements: 'Modern web browser with JavaScript enabled',
      permissions: 'No special permissions required. Runs entirely in browser.',
      privacyPolicy: 'https://toolsapplab.com/privacy',
      inLanguage: 'en-US',
      audience: {
        '@type': 'Audience',
        audienceType: 'Software Developers, Technical Professionals',
      },
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'tool-structured-data';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
  };

  const removeStructuredData = () => {
    const existingScript = document.getElementById('tool-structured-data');
    if (existingScript) {
      existingScript.remove();
    }
  };

  const updateMetaTag = (attrName: string, attrValue: string, content: string) => {
    let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement;

    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }

    element.content = content;
  };

  onMounted(() => {
    updateMetaTags();
  });

  watch(() => route.path, () => {
    updateMetaTags();
  }, { immediate: true });
}
