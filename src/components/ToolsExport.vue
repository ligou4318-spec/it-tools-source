<script setup lang="ts">
import { IconDownload, IconFileJson, IconFileSpreadsheet } from '@tabler/icons-vue';
import { computed } from 'vue';
import { useToolStore } from '@/tools/tools.store';

const toolStore = useToolStore();
const { t } = useI18n();

// Prepare data for export
const exportData = computed(() => {
  return toolStore.tools.map(tool => ({
    name: tool.name,
    description: tool.description,
    category: tool.category,
    path: tool.path,
    keywords: tool.keywords.join(', '),
  }));
});

// Export as JSON
function exportAsJSON() {
  const dataStr = JSON.stringify(exportData.value, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'toolsapp-lab-tools.json';
  link.click();
  URL.revokeObjectURL(url);
}

// Export as CSV
function exportAsCSV() {
  const headers = ['Name', 'Description', 'Category', 'Path', 'Keywords'];
  const rows = exportData.value.map(tool => [
    `"${tool.name}"`,
    `"${tool.description}"`,
    `"${tool.category}"`,
    `"${tool.path}"`,
    `"${tool.keywords}"`,
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
  
  const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'toolsapp-lab-tools.csv';
  link.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="export-section">
    <n-dropdown trigger="hover" :options="[
      {
        label: 'Download as JSON',
        key: 'json',
        icon: () => h(NIcon, null, { default: () => h(IconFileJson) }),
        props: {
          onClick: exportAsJSON,
        },
      },
      {
        label: 'Download as CSV',
        key: 'csv',
        icon: () => h(NIcon, null, { default: () => h(IconFileSpreadsheet) }),
        props: {
          onClick: exportAsCSV,
        },
      },
    ]">
      <c-button type="tertiary" size="small">
        <template #icon>
          <n-icon :component="IconDownload" />
        </template>
        Export Tools
      </c-button>
    </n-dropdown>
  </div>
</template>

<style scoped>
.export-section {
  display: inline-block;
}
</style>
