<template>
  <!-- HTML comes from the SSR-rendered Markdown pipeline (markdown-it +
       shiki). Author-supplied HTML is disabled in the renderer so this
       v-html is safe given the trusted authoring path (admin only). -->
  <article
    class="prose-blog max-w-none"
    v-html="html"
  ></article>
</template>

<script setup lang="ts">
defineProps<{
  html: string
}>()
</script>

<style>
/* Local prose styles — keeps the article matching the portfolio's
   industrial/terminal feel without pulling in @tailwindcss/typography. */
.prose-blog {
  color: var(--text-secondary);
  font-family: 'General Sans', 'Inter', system-ui, sans-serif;
  line-height: 1.7;
  font-size: 1.0625rem;
}

.prose-blog > * + * {
  margin-top: 1.25rem;
}

.prose-blog h1,
.prose-blog h2,
.prose-blog h3,
.prose-blog h4 {
  color: var(--text-primary);
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}

.prose-blog h2 {
  font-size: 1.875rem;
  scroll-margin-top: 96px;
}

.prose-blog h3 {
  font-size: 1.5rem;
  scroll-margin-top: 96px;
}

.prose-blog h4 {
  font-size: 1.25rem;
}

.prose-blog a {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid color-mix(in oklab, var(--accent) 40%, transparent);
  transition: border-color 150ms;
}

.prose-blog a:hover {
  border-bottom-color: var(--accent);
}

.prose-blog ul,
.prose-blog ol {
  padding-left: 1.5rem;
}

.prose-blog ul {
  list-style: none;
}

.prose-blog ul > li {
  position: relative;
  padding-left: 1.25rem;
}

.prose-blog ul > li::before {
  content: '▹';
  position: absolute;
  left: 0;
  color: var(--accent);
}

.prose-blog ol {
  list-style: decimal;
}

.prose-blog ol > li::marker {
  color: var(--accent);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
}

.prose-blog blockquote {
  border-left: 3px solid var(--accent);
  padding: 0.75rem 1.25rem;
  background: var(--bg-secondary);
  border-radius: 0 0.5rem 0.5rem 0;
  font-style: italic;
  color: var(--text-primary);
}

.prose-blog code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.875em;
  padding: 0.125rem 0.375rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  color: var(--accent);
}

.prose-blog pre {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.25rem;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.6;
}

.prose-blog pre code {
  background: transparent;
  border: none;
  padding: 0;
  color: inherit;
  font-size: inherit;
}

/* Shiki produces two themes; toggle by the same dark/light class the
   rest of the site uses (see assets/css/colors.css). */
html.dark .prose-blog pre,
html.dark .prose-blog pre code {
  background-color: var(--bg-secondary);
  color: var(--shiki-dark, var(--text-primary)) !important;
}

html.light .prose-blog pre,
html.light .prose-blog pre code {
  color: var(--shiki-light, var(--text-primary)) !important;
}

.prose-blog img {
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  margin: 1.5rem auto;
}

.prose-blog hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2.5rem 0;
}

.prose-blog table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9375rem;
}

.prose-blog th,
.prose-blog td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border);
  text-align: left;
}

.prose-blog th {
  color: var(--text-primary);
  font-weight: 600;
}
</style>
