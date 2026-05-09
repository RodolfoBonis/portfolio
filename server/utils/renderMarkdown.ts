/**
 * Server-side Markdown→HTML renderer for blog articles.
 *
 * Pipeline: markdown-it (CommonMark + GFM tables/lists) → shiki for
 * fenced code blocks (dual theme dark+light, switched by the same
 * .dark/.light class the rest of the site uses).
 *
 * Why server-side: Nuxt SSR renders the article once, then SWR caches
 * the HTML. Shiki ships ~7MB of grammar files but never reaches the
 * browser — only the highlighted <pre><code> output does.
 */

import MarkdownIt from 'markdown-it'
import { createHighlighter, type Highlighter } from 'shiki'

// Languages we actually use in posts. Adding more is cheap; pick the
// ones present in real articles to keep highlighter startup fast.
const LANGS = [
  'go',
  'typescript',
  'javascript',
  'tsx',
  'jsx',
  'vue',
  'bash',
  'shell',
  'json',
  'yaml',
  'sql',
  'dockerfile',
  'python',
  'rust',
  'css',
  'html',
  'diff',
] as const

const THEMES = {
  dark: 'github-dark',
  light: 'github-light',
} as const

let highlighterPromise: Promise<Highlighter> | null = null

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [THEMES.dark, THEMES.light],
      langs: [...LANGS],
    })
  }
  return highlighterPromise
}

let mdInstance: MarkdownIt | null = null

async function getRenderer(): Promise<MarkdownIt> {
  if (mdInstance) return mdInstance
  const highlighter = await getHighlighter()

  const md = new MarkdownIt({
    html: false, // never trust author-supplied HTML in posts
    linkify: true,
    typographer: true,
    breaks: false,
    highlight: (code, lang) => {
      const safeLang = (LANGS as readonly string[]).includes(lang)
        ? lang
        : 'text'
      try {
        return highlighter.codeToHtml(code, {
          lang: safeLang,
          themes: THEMES,
          // Defaults to <pre><code>… ; we wrap to give the same look as
          // ProjectCard code blocks in the existing portfolio.
          defaultColor: false,
        })
      } catch {
        // Fallback: plain escaped <pre><code>. markdown-it does the
        // escape itself if we return empty string.
        return ''
      }
    },
  })

  // Open external links in a new tab and add rel for SEO/security.
  const defaultLinkRender =
    md.renderer.rules.link_open ||
    ((tokens, idx, options, _env, self) =>
      self.renderToken(tokens, idx, options))
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet('href') ?? ''
    if (/^https?:/.test(href)) {
      tokens[idx].attrSet('target', '_blank')
      tokens[idx].attrSet('rel', 'noopener noreferrer')
    }
    return defaultLinkRender(tokens, idx, options, env, self)
  }

  mdInstance = md
  return md
}

export interface RenderResult {
  html: string
  /** Word count → reading time in minutes (200 wpm, floored at 1). */
  readingTimeMinutes: number
}

export async function renderMarkdown(content: string): Promise<RenderResult> {
  const md = await getRenderer()
  const html = md.render(content || '')
  const words = (content || '').trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return { html, readingTimeMinutes: minutes }
}
