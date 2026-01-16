<script setup lang="ts">
import { ref } from 'vue';
import {
  IconBrandGithub,
  IconBrandX,
  IconBrandLinkedin,
  IconLink,
  IconHeart,
  IconStar,
} from '@tabler/icons-vue';

const props = defineProps<{
  toolName?: string;
  toolPath?: string;
}>();

const url = ref(typeof window !== 'undefined' ? window.location.href : '');
const title = props.toolName
  ? `${props.toolName} - ToolsApp Lab`
  : 'ToolsApp Lab | The Pro Developer Playground';

const copied = ref(false);

const shareLinks = [
  {
    name: 'GitHub',
    icon: IconBrandGithub,
    url: 'https://github.com/ligou4318-spec/it-tools-source',
    color: '#ffffff',
    hover: '#f0f0f0',
  },
  {
    name: 'X (Twitter)',
    icon: IconBrandX,
    url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}\n\n100+ privacy-first developer tools. Runs locally in your browser.\n\n#DeveloperTools #PrivacyFirst #OpenSource`)}&url=${encodeURIComponent(url.value)}`,
    color: '#000000',
    hover: '#333333',
  },
  {
    name: 'LinkedIn',
    icon: IconBrandLinkedin,
    url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url.value)}`,
    color: '#0077B5',
    hover: '#006396',
  },
];

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(url.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

const openShareLink = (link: typeof shareLinks[0]) => {
  window.open(link.url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
};
</script>

<template>
  <div class="sv-social-share">
    <div class="sv-share-header">
      <IconHeart :size="14" />
      <span>Love this tool?</span>
    </div>

    <div class="sv-share-buttons">
      <button
        v-for="link in shareLinks"
        :key="link.name"
        class="sv-share-btn"
        :style="{ '--btn-color': link.color, '--btn-hover': link.hover }"
        :title="`Share on ${link.name}`"
        @click="openShareLink(link)"
      >
        <component :is="link.icon" :size="18" />
        <span>{{ link.name }}</span>
      </button>

      <button
        class="sv-share-btn sv-copy-btn"
        title="Copy link"
        @click="copyToClipboard"
      >
        <IconLink :size="18" />
        <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
      </button>
    </div>

    <div class="sv-share-footer">
      <IconStar :size="14" />
      <a
        href="https://github.com/ligou4318-spec/it-tools-source"
        target="_blank"
        rel="noopener"
      >
        Star us on GitHub
      </a>
    </div>
  </div>
</template>

<style lang="less" scoped>
.sv-social-share {
  margin-top: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.sv-share-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #E2E8F0;
  font-size: 13px;
  font-weight: 600;
}

.sv-share-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.sv-share-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--btn-color, #333);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  &:hover {
    background: var(--btn-hover, #444);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &.sv-copy-btn {
    background: #38BDF8;

    &:hover {
      background: #0ea5e9;
    }
  }
}

.sv-share-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12px;
  color: #8B949E;

  a {
    color: #38BDF8;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: #0ea5e9;
      text-decoration: underline;
    }
  }
}

// Responsive
@media (max-width: 768px) {
  .sv-share-buttons {
    flex-direction: column;
  }

  .sv-share-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
