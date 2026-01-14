<script setup lang="ts">
import { useStyleStore } from '@/stores/style.store';

type MonacoEditor = typeof import('monaco-editor');
type DiffEditor = import('monaco-editor').editor.IStandaloneDiffEditor;
type DiffEditorOptions = import('monaco-editor').editor.IDiffEditorOptions;

const props = withDefaults(defineProps<{ options?: DiffEditorOptions }>(), { options: () => ({}) });
const { options } = toRefs(props);

const editorContainer = ref<HTMLElement | null>(null);
let editor: DiffEditor | null = null;
let monaco: MonacoEditor | null = null;

// Lazy load Monaco Editor
const loadMonaco = async () => {
  if (!monaco) {
    monaco = await import('monaco-editor');

    // Define themes only once
    monaco.editor.defineTheme('it-tools-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#00000000',
      },
    });

    monaco.editor.defineTheme('it-tools-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#00000000',
      },
    });
  }
  return monaco;
};

const styleStore = useStyleStore();

watch(
  () => styleStore.isDarkTheme,
  async (isDarkTheme) => {
    if (monaco) {
      monaco.editor.setTheme(isDarkTheme ? 'it-tools-dark' : 'it-tools-light');
    }
  },
  { immediate: true },
);

watch(
  () => options.value,
  options => editor?.updateOptions(options),
  { immediate: true, deep: true },
);

useResizeObserver(editorContainer, () => {
  editor?.layout();
});

onMounted(async () => {
  if (!editorContainer.value) {
    return;
  }

  const monacoInstance = await loadMonaco();

  editor = monacoInstance.editor.createDiffEditor(editorContainer.value, {
    originalEditable: true,
    minimap: {
      enabled: false,
    },
  });

  editor.setModel({
    original: monacoInstance.editor.createModel('original text', 'txt'),
    modified: monacoInstance.editor.createModel('modified text', 'txt'),
  });

  // Set initial theme
  monacoInstance.editor.setTheme(styleStore.isDarkTheme ? 'it-tools-dark' : 'it-tools-light');
});

// Cleanup on unmount
onUnmounted(() => {
  if (editor) {
    editor.dispose();
    editor = null;
  }
});
</script>

<template>
  <div ref="editorContainer" h-600px />
</template>
