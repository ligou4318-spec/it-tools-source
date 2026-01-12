<script setup lang="ts">
import { IconHeart, IconCoffee } from '@tabler/icons-vue';

const donationOptions = [
  {
    label: 'Buy Me a Coffee',
    icon: IconCoffee,
    url: 'https://www.buymeacoffee.com/cthmsst',
    color: '#FFDD00',
  },
  {
    label: 'GitHub Sponsors',
    icon: IconHeart,
    url: 'https://github.com/sponsors/CorentinTh',
    color: '#EA4AAA',
  },
];

function openDonation(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}
</script>

<template>
  <div class="support-section">
    <n-dropdown trigger="hover" :options="donationOptions.map(option => ({
      label: option.label,
      key: option.label,
      icon: () => h(NIcon, null, { default: () => h(option.icon) }),
      props: {
        onClick: () => openDonation(option.url),
        style: { color: option.color },
      },
    }))">
      <c-button type="primary" size="small" round>
        <template #icon>
          <n-icon :component="IconHeart" />
        </template>
        Show Support
      </c-button>
    </n-dropdown>
  </div>
</template>

<style scoped>
.support-section {
  display: inline-block;
}
</style>
