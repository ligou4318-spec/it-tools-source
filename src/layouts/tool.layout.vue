<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useHead } from '@vueuse/head';
import type { HeadObject } from '@vueuse/head';
import { onMounted, watch } from 'vue';

import BaseLayout from './base.layout.vue';
import FavoriteButton from '@/components/FavoriteButton.vue';
import ToolSuggestions from '@/components/ToolSuggestions.vue';
import SocialShare from '@/components/SocialShare.vue';
import type { Tool } from '@/tools/tools.types';
import { useToolSuggestions } from '@/composable/useToolSuggestions';

const route = useRoute();

const head = computed<HeadObject>(() => ({
  title: `${route.meta.name} - IT Tools`,
  meta: [
    {
      name: 'description',
      content: route.meta?.description as string,
    },
    {
      name: 'keywords',
      content: ((route.meta.keywords ?? []) as string[]).join(','),
    },
  ],
}));
useHead(head);
const { t } = useI18n();

const i18nKey = computed<string>(() => route.path.trim().replace('/', ''));
const toolTitle = computed<string>(() => t(`tools.${i18nKey.value}.title`, String(route.meta.name)));
const toolDescription = computed<string>(() => t(`tools.${i18nKey.value}.description`, String(route.meta.description)));

// Lollapalooza Effect: Tool Suggestions (查理芒格)
const { suggestions, analyzeContent, clearSuggestions } = useToolSuggestions();

// Watch for input changes in tool components and suggest related tools
// This is the network effect that makes tools work better together
const setupSuggestions = () => {
  // Observe textarea and input elements
  const observer = new MutationObserver(() => {
    const inputs = document.querySelectorAll('textarea, input[type="text"]');
    inputs.forEach(input => {
      if (!input.dataset.suggestionSetup) {
        input.dataset.suggestionSetup = 'true';

        input.addEventListener('input', (e) => {
          const target = e.target as HTMLTextAreaElement | HTMLInputElement;
          const content = target.value;

          if (content.length > 3) {
            analyzeContent(content, route.path);
          } else {
            clearSuggestions();
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Cleanup on unmount
  onMounted(() => {
    setTimeout(() => {
      observer.disconnect();
    }, 5000);
  });
};

// Initialize suggestions when tool changes
watch(() => route.path, () => {
  setTimeout(setupSuggestions, 100);
}, { immediate: true });
</script>

<template>
  <BaseLayout>
    <div class="tool-layout">
      <div class="tool-header">
        <div flex flex-nowrap items-center justify-between>
          <n-h1>
            {{ toolTitle }}
          </n-h1>

          <div>
            <FavoriteButton :tool="{ name: route.meta.name, path: route.path } as Tool" />
          </div>
        </div>

        <div class="separator" />

        <div class="description">
          {{ toolDescription }}
        </div>

        <div class="trust-badge">
          <n-tag :bordered="false" size="small" type="success">
            <template #icon>
              <icon-mdi-shield-check />
            </template>
            🔒 Data never leaves your browser
          </n-tag>
        </div>

        <!-- Lollapalooza Effect: Tool Suggestions (芒格：1+1>2) -->
        <ToolSuggestions :suggestions="suggestions" />

        <!-- Social Proof (欲望都市：社交认同) -->
        <SocialShare :tool-name="toolTitle" :tool-path="route.path" />
      </div>
    </div>

    <div class="tool-content">
      <slot />
    </div>
  </BaseLayout>
</template>

<style lang="less" scoped>
.tool-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;

  ::v-deep(& > *) {
    flex: 0 1 600px;
  }
}

.tool-layout {
  max-width: 600px;
  margin: 0 auto;
  box-sizing: border-box;

  .tool-header {
    padding: 40px 0;
    width: 100%;

    .n-h1 {
      opacity: 0.9;
      font-size: 40px;
      font-weight: 400;
      margin: 0;
      line-height: 1;
    }

    .separator {
      width: 200px;
      height: 2px;
      background: rgb(161, 161, 161);
      opacity: 0.2;

      margin: 10px 0;
    }

    .description {
      margin: 0;

      opacity: 0.7;
    }

    .trust-badge {
      margin-top: 12px;
    }
  }
}
</style>
