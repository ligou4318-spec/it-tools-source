import { type MaybeRef, get } from '@vueuse/core';
import Fuse from 'fuse.js';
import { computed, ref, watch } from 'vue';

export { useFuzzySearch };

function useFuzzySearch<Data>({
  search,
  data,
  options = {},
}: {
  search: MaybeRef<string>
  data: MaybeRef<Data[]>
  options?: Fuse.IFuseOptions<Data> & { filterEmpty?: boolean }
}) {
  const filterEmpty = options.filterEmpty ?? true;
  const { filterEmpty: _filterEmpty, ...fuseOptions } = options;

  // Cache Fuse instance and recreate only when data changes
  const fuseInstance = ref<Fuse<Data> | null>(null);

  // Watch for data changes and update Fuse instance
  watch(
    () => get(data),
    (newData) => {
      fuseInstance.value = new Fuse(newData, fuseOptions);
    },
    { immediate: true, deep: true },
  );

  const searchResult = computed<Data[]>(() => {
    const query = get(search);

    if (!fuseInstance.value) {
      return [];
    }

    if (!filterEmpty && query === '') {
      return get(data);
    }

    return fuseInstance.value.search(query).map(({ item }) => item);
  });

  return { searchResult };
}
