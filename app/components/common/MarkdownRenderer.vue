<script setup lang="ts">
import MarkdownIt from "markdown-it";
import mila from "markdown-it-link-attributes";

interface Props {
  content: string;
}

const props = defineProps<Props>();

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
}).use(mila, {
  matcher: (link: string) => /^https?:\/\//.test(link),
  attrs: {
    target: "_blank",
    rel: "noopener noreferrer",
  },
});

const renderedHtml = computed(() => md.render(props.content || ""));
</script>

<template>
  <div class="markdown-renderer" v-html="renderedHtml" />
</template>

<style scoped>
.markdown-renderer :deep(h1) {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.markdown-renderer :deep(h2) {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 700;
  margin-top: 1rem;
  margin-bottom: 0.75rem;
}

.markdown-renderer :deep(h3) {
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-weight: 700;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
}

.markdown-renderer :deep(h4) {
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 700;
  margin-top: 0.75rem;
  margin-bottom: 0.25rem;
}

.markdown-renderer :deep(p) {
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 0.75rem;
  color: #1c1917;
}

.markdown-renderer :deep(hr) {
  margin: 1.5rem 0;
  border: 0;
  border-top: 1px solid #d6d3d1;
}

.markdown-renderer :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}

.markdown-renderer :deep(ol) {
  list-style: decimal;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}

.markdown-renderer :deep(li) {
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 0.25rem;
}

.markdown-renderer :deep(strong) {
  font-weight: 700;
}

.markdown-renderer :deep(em) {
  font-style: italic;
}

.markdown-renderer :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}

.markdown-renderer :deep(blockquote) {
  border-left: 4px solid #a8a29e;
  padding-left: 1rem;
  margin: 0.75rem 0;
  color: #57534e;
  font-style: italic;
}

.markdown-renderer :deep(code) {
  background: #f5f5f4;
  padding: 0.125rem 0.375rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.markdown-renderer :deep(pre) {
  background: #292524;
  color: white;
  padding: 0.75rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  margin-bottom: 0.75rem;
}

.markdown-renderer :deep(pre code) {
  background: transparent;
  padding: 0;
  border-radius: 0;
  color: inherit;
}

.markdown-renderer :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
  border-radius: 0.75rem;
  margin: 0.75rem auto;
}
</style>
