<!-- eslint-disable camelcase -->
<script setup lang="ts">
import { css as formatCss, html as formatHtml, js as formatJs } from 'js-beautify';
import { editor } from 'monaco-editor';
import { venusMonacoEditorProps } from './props';
import { initResult } from './init';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import IEditorOptions = editor.IEditorOptions;
import IGlobalEditorOptions = editor.IGlobalEditorOptions;

// eslint-disable-next-line vue/define-macros-order
defineOptions({
  name: 'VenusMonacoEditor',
});

const props = defineProps({
  ...venusMonacoEditorProps,
});

const emit = defineEmits<{
  (e: 'update:value', value?: string | null): void;
}>();

const editorContainer = ref<HTMLElement>();
const height = computed(() => {
  if (isString(props.height)) {
    return props.height;
  }

  return `${props.height ?? 320}px`;
});

const width = '100%';

const content = ref<string>(props.value ?? '');
const formattedContent = computed(() => {
  if (props.language == 'json' || props.language == 'javascript' || props.language == 'typescript') {
    return formatJs(content.value, {
      indent_size: 2,
      indent_with_tabs: false,
    });
  }

  if (props.language == 'html') {
    return formatHtml(content.value, {
      indent_size: 2,
      indent_with_tabs: false,
    });
  }

  if (props.language == 'css') {
    return formatCss(content.value, {
      indent_size: 2,
      indent_with_tabs: false,
    });
  }

  return content.value;
});

const disabled = computed(() => props.disabled ?? false);
const editorOptions = computed(() => {
  return {
    theme: props.theme ?? 'venus-light',
    language: props.language,
    readOnly: disabled.value,
    fontSize: props.fontSize ?? 18,
    lineNumbers: props.showLineNumber ?? true ? 'on' : 'off',
  } as IEditorOptions & IGlobalEditorOptions;
});

let monacoEditor: Nullable<IStandaloneCodeEditor> = null;

onMounted(() => {
  initResult.then(monaco => {
    if (editorContainer.value) {
      const instance = monaco.editor.create(editorContainer.value, {
        lineHeight: 1.5,
        value: formattedContent.value,
        fontFamily: 'Consolas, fierce-jetbrains-mono',
        tabIndex: 2,
        folding: false,
        contextmenu: false,
        minimap: {
          enabled: false,
        },
        automaticLayout: true,
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
        formatOnPaste: true,
        mouseWheelZoom: true,
        autoClosingQuotes: 'always',
        ...editorOptions.value,
      });
      monacoEditor = instance;
      instance.onDidChangeModelContent(() => {
        const currentContent = instance.getValue();
        if (currentContent != content.value) {
          content.value = currentContent;
          emit('update:value', currentContent);
          if (isFunction(props.onUpdateValue)) {
            props.onUpdateValue.call(undefined, currentContent);
          }
        }
      });
    }
  });
});

onBeforeUnmount(() => {
  monacoEditor?.dispose();
  monacoEditor = null;
});

watch(editorOptions, options => {
  monacoEditor?.updateOptions({
    ...options,
  });
});
watch(
  () => props.value,
  value => {
    if (value != content.value) {
      content.value = value ?? '';
      monacoEditor?.setValue(formattedContent.value);
    }
  },
);

// 边框样式
const borderStyle = computed(() => {
  if (props.border ?? false) {
    return {
      padding: '10px 10px 10px 0',
      borderWidth: '1px',
      borderColor: 'black',
      borderRadius: '20px',
    };
  }

  return {};
});
</script>

<template>
  <div
    ref="editorContainer"
    class="overflow-hidden"
    :style="{ height, width, ...borderStyle }"
  />
</template>

<style scoped lang="scss">

</style>
