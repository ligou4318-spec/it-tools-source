<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { IconArrowRight, IconSparkles } from '@tabler/icons-vue';
import type { SuggestedTool } from '@/composable/useToolSuggestions';

interface Props {
  suggestions: SuggestedTool[];
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
});

const router = useRouter();

const hasSuggestions = computed(() => props.suggestions.length > 0);

const navigateToTool = (path: string) => {
  router.push(path);
};

const confidenceColor = (confidence: string) => {
  switch (confidence) {
    case 'high':
      return '#38BDF8'; // Sky blue
    case 'medium':
      return '#34D399'; // Emerald
    case 'low':
      return '#FBBF24'; // Amber
    default:
      return '#8B949E';
  }
};
</script>

<template>
  <Transition name="suggestions">
    <div v-if="hasSuggestions" :class="['sv-tool-suggestions', { compact }]">
      <div class="sv-suggestions-header">
        <IconSparkles :size="14" />
        <span>Suggested tools</span>
      </div>

      <div class="sv-suggestions-list">
        <div
          v-for="suggestion in suggestions"
          :key="suggestion.path"
          class="sv-suggestion-item"
          @click="navigateToTool(suggestion.path)"
        >
          <div class="sv-suggestion-icon">
            <div class="sv-confidence-dot" :style="{ backgroundColor: confidenceColor(suggestion.confidence) }" />
          </div>

          <div class="sv-suggestion-content">
            <div class="sv-suggestion-title">{{ suggestion.name }}</div>
            <div v-if="!compact" class="sv-suggestion-reason">{{ suggestion.reason }}</div>
          </div>

          <div class="sv-suggestion-action">
            <IconArrowRight :size="16" />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="less" scoped>
.sv-tool-suggestions {
  margin-top: 20px;
  padding: 16px;
  background: rgba(56, 189, 248, 0.05);
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 12px;

  &.compact {
    padding: 12px;
    margin-top: 12px;
  }
}

.sv-suggestions-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #38BDF8;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sv-suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sv-suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: rgba(22, 27, 34, 0.8);
  border: 1px solid rgba(48, 54, 61, 0.5);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(56, 189, 248, 0.1);
    border-color: rgba(56, 189, 248, 0.3);
    transform: translateX(4px);
  }
}

.sv-suggestion-icon {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
}

.sv-confidence-dot {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
}

.sv-suggestion-content {
  flex: 1;
  min-width: 0;
}

.sv-suggestion-title {
  color: #E2E8F0;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
}

.sv-suggestion-reason {
  color: #8B949E;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sv-suggestion-action {
  flex-shrink: 0;
  color: #8B949E;
  transition: color 0.2s ease;

  .sv-suggestion-item:hover & {
    color: #38BDF8;
  }
}

// Transition
.suggestions-enter-active,
.suggestions-leave-active {
  transition: all 0.3s ease;
}

.suggestions-enter-from,
.suggestions-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

// Responsive
@media (max-width: 768px) {
  .sv-tool-suggestions {
    padding: 12px;
  }

  .sv-suggestion-item {
    padding: 8px 10px;
  }

  .sv-suggestion-title {
    font-size: 13px;
  }

  .sv-suggestion-reason {
    font-size: 11px;
  }
}
</style>
