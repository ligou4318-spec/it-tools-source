import { type MaybeRef, get, useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import type { Tool, ToolCategory, ToolWithCategory } from './tools.types';
import { toolsWithCategory } from './index';

export const useToolStore = defineStore('tools', () => {
  const favoriteToolsName = useStorage('favoriteToolsName', []) as Ref<string[]>;
  const { t } = useI18n();

  // Memoized tools computation to avoid recalculating on every access
  const tools = computed<ToolWithCategory[]>(() => {
    return toolsWithCategory.map((tool) => {
      const toolI18nKey = tool.path.replace(/\//g, '');

      return {
        ...tool,
        path: tool.path,
        name: t(`tools.${toolI18nKey}.title`, tool.name),
        description: t(`tools.${toolI18nKey}.description`, tool.description),
        category: t(`tools.categories.${tool.category.toLowerCase()}`, tool.category),
      };
    });
  });

  // Optimized category grouping with Map for better performance
  const toolsByCategory = computed<ToolCategory[]>(() => {
    const categoryMap = new Map<string, ToolWithCategory[]>();

    // Group tools by category
    for (const tool of tools.value) {
      const category = tool.category;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(tool);
    }

    // Convert to array format
    return Array.from(categoryMap.entries()).map(([name, components]) => ({
      name,
      path: name.toLowerCase(),
      components,
    }));
  });

  // Optimized favorite tools lookup with Set for O(1) lookup
  const favoriteToolsNameSet = computed(() => new Set(favoriteToolsName.value));

  const favoriteTools = computed(() => {
    const favorites: ToolWithCategory[] = [];

    for (const tool of tools.value) {
      if (favoriteToolsNameSet.value.has(tool.name) || favoriteToolsNameSet.value.has(tool.path)) {
        favorites.push(tool);
      }
    }

    return favorites;
  });

  const newTools = computed(() => tools.value.filter(({ isNew }) => isNew));

  return {
    tools,
    favoriteTools,
    toolsByCategory,
    newTools,

    addToolToFavorites({ tool }: { tool: MaybeRef<Tool> }) {
      const toolPath = get(tool).path;
      if (toolPath && !favoriteToolsName.value.includes(toolPath)) {
        favoriteToolsName.value.push(toolPath);
      }
    },

    removeToolFromFavorites({ tool }: { tool: MaybeRef<Tool> }) {
      const toolName = get(tool).name;
      const toolPath = get(tool).path;

      favoriteToolsName.value = favoriteToolsName.value.filter(
        name => name !== toolName && name !== toolPath,
      );
    },

    isToolFavorite({ tool }: { tool: MaybeRef<Tool> }) {
      const toolRef = get(tool);
      return favoriteToolsNameSet.value.has(toolRef.name) || favoriteToolsNameSet.value.has(toolRef.path);
    },

    updateFavoriteTools(newOrder: ToolWithCategory[]) {
      favoriteToolsName.value = newOrder.map(tool => tool.path);
    },
  };
});
