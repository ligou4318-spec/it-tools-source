import { ref, computed } from 'vue';
import { tools } from '@/tools';

/**
 * Charlie Munger's Lollapalooza Effect: Tool Suggestion System
 *
 * Detects content patterns and suggests relevant tools.
 * Creates 1+1>2 network effects between tools.
 *
 * Pattern detection:
 * - JWT: ey[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+
 * - Base64: [A-Za-z0-9+/]{4,}={0,2}
 * - JSON: Starts with { or [
 * - Timestamp: 10-13 digit number
 * - UUID: [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}
 * - URL: https?://[^\s]+
 * - Email: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}
 * - IP Address: \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}
 */

export interface SuggestedTool {
  name: string;
  path: string;
  description: string;
  reason: string;
  confidence: 'high' | 'medium' | 'low';
}

const patterns = {
  jwt: {
    regex: /^ey[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/,
    toolPath: '/jwt-parser',
    name: 'JWT Decoder',
    reason: 'This looks like a JSON Web Token',
    confidence: 'high' as const,
  },
  base64: {
    regex: /^[A-Za-z0-9+/]{20,}={0,2}$/,
    toolPath: '/base64-string-converter',
    name: 'Base64 Decoder',
    reason: 'This appears to be Base64 encoded',
    confidence: 'medium' as const,
  },
  json: {
    regex: /^\s*[\{\[]/,
    toolPath: '/json-prettify',
    name: 'JSON Formatter',
    reason: 'This is JSON data',
    confidence: 'high' as const,
  },
  timestamp10: {
    regex: /^\d{10}$/,
    toolPath: '/date-converter',
    name: 'Timestamp Converter',
    reason: 'This looks like a Unix timestamp (seconds)',
    confidence: 'high' as const,
  },
  timestamp13: {
    regex: /^\d{13}$/,
    toolPath: '/date-converter',
    name: 'Timestamp Converter',
    reason: 'This looks like a Unix timestamp (milliseconds)',
    confidence: 'high' as const,
  },
  uuid: {
    regex: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    toolPath: '/uuid-generator',
    name: 'UUID Generator',
    reason: 'This is a UUID/GUID',
    confidence: 'high' as const,
  },
  url: {
    regex: /^https?:\/\/[^\s]+$/,
    toolPath: '/url-parser',
    name: 'URL Parser',
    reason: 'This is a URL',
    confidence: 'medium' as const,
  },
  email: {
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    toolPath: '/email-normalizer',
    name: 'Email Normalizer',
    reason: 'This is an email address',
    confidence: 'medium' as const,
  },
  ipAddress: {
    regex: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
    toolPath: '/ipv4-address-converter',
    name: 'IPv4 Converter',
    reason: 'This is an IP address',
    confidence: 'medium' as const,
  },
  hexColor: {
    regex: /^#[0-9A-Fa-f]{6}$/,
    toolPath: '/color-converter',
    name: 'Color Converter',
    reason: 'This is a hex color',
    confidence: 'high' as const,
  },
  binary: {
    regex: /^[01\s]{8,}$/,
    toolPath: '/text-to-binary',
    name: 'Binary Converter',
    reason: 'This looks like binary data',
    confidence: 'medium' as const,
  },
};

export function useToolSuggestions() {
  const suggestions = ref<SuggestedTool[]>([]);
  const currentPath = ref<string>('');

  /**
   * Analyze input content and suggest tools
   */
  const analyzeContent = (content: string, excludePath?: string): SuggestedTool[] => {
    if (!content || content.length < 3) {
      suggestions.value = [];
      return [];
    }

    const detected: SuggestedTool[] = [];

    for (const [key, pattern] of Object.entries(patterns)) {
      // Skip if we're already on that tool's page
      if (excludePath && pattern.toolPath === excludePath) {
        continue;
      }

      if (pattern.regex.test(content.trim())) {
        const tool = tools.find(t => t.path === pattern.toolPath);
        if (tool) {
          detected.push({
            name: pattern.name,
            path: pattern.toolPath,
            description: tool.description,
            reason: pattern.reason,
            confidence: pattern.confidence,
          });
        }
      }
    }

    // Sort by confidence (high > medium > low)
    const confidenceOrder = { high: 3, medium: 2, low: 1 };
    detected.sort((a, b) => confidenceOrder[b.confidence] - confidenceOrder[a.confidence]);

    // Only return top 2 suggestions
    suggestions.value = detected.slice(0, 2);
    return suggestions.value;
  };

  /**
   * Clear suggestions
   */
  const clearSuggestions = () => {
    suggestions.value = [];
  };

  /**
   * Get high-confidence suggestions (show automatically)
   */
  const autoShowSuggestions = computed(() => {
    return suggestions.value.filter(s => s.confidence === 'high');
  });

  /**
   * Get all suggestions (show in sidebar)
   */
  const allSuggestions = computed(() => {
    return suggestions.value;
  });

  return {
    suggestions: allSuggestions,
    autoShowSuggestions,
    analyzeContent,
    clearSuggestions,
    currentPath,
  };
}
