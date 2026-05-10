<template>
  <section class="blog-comments" :aria-label="t.heading">
    <h2 class="blog-comments__heading">{{ t.heading }}</h2>
    <p class="blog-comments__intro">{{ t.intro }}</p>

    <CommentForm
      :post-slug="postSlug"
      :lang="lang"
      @submitted="onRootSubmitted"
    />

    <div v-if="loading" class="blog-comments__status">{{ t.loading }}</div>
    <div v-else-if="error" class="blog-comments__status blog-comments__status--error">
      {{ error }}
    </div>
    <div v-else-if="!list.length" class="blog-comments__status">{{ t.empty }}</div>
    <div v-else class="blog-comments__list">
      <CommentItem
        v-for="c in list"
        :key="c.id"
        :comment="c"
        :post-slug="postSlug"
        :lang="lang"
        :depth="0"
        :max-depth="3"
        @reply-added="onReplyAdded"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useComments, type BlogComment } from '~/composables/useComments'

const props = defineProps<{
  postSlug: string
  lang: 'pt-BR' | 'en'
}>()

const comments = useComments()
const list = ref<BlogComment[]>([])
const loading = ref(true)
const error = ref('')

const t = {
  'pt-BR': {
    heading: 'Comentários',
    intro: 'Sem cadastro. Suporta markdown básico. Validamos com Cloudflare Turnstile pra evitar spam.',
    loading: 'Carregando comentários…',
    empty: 'Seja o primeiro a comentar.',
    failed: 'Não foi possível carregar os comentários.',
  },
  en: {
    heading: 'Comments',
    intro: 'No signup needed. Basic markdown supported. Validated with Cloudflare Turnstile.',
    loading: 'Loading comments…',
    empty: 'Be the first to comment.',
    failed: 'Could not load comments.',
  },
}[props.lang]

onMounted(async () => {
  await load()
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    list.value = await comments.getByPostSlug(props.postSlug, props.lang)
  } catch {
    error.value = t.failed
  } finally {
    loading.value = false
  }
}

// New root comment lands at the bottom (chronological).
function onRootSubmitted(c: BlogComment) {
  list.value = [...list.value, c]
}

// Reply lands as a child of its parent — walk the tree to find it.
// If the parent isn't found (race condition with a prune by an
// admin), fall back to a full reload.
function onReplyAdded(c: BlogComment) {
  if (!c.parent_id) {
    list.value = [...list.value, c]
    return
  }
  const inserted = appendInTree(list.value, c.parent_id, c)
  if (!inserted) {
    load().catch(() => {
      /* swallow — error state will already be set on next user action */
    })
  }
}

function appendInTree(nodes: BlogComment[], parentId: string, child: BlogComment): boolean {
  for (const node of nodes) {
    if (node.id === parentId) {
      node.children = [...(node.children ?? []), child]
      return true
    }
    if (node.children && appendInTree(node.children, parentId, child)) {
      return true
    }
  }
  return false
}
</script>

<style scoped>
.blog-comments {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}
.blog-comments__heading {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--text-primary);
}
.blog-comments__intro {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 0 0 1rem;
}
.blog-comments__list {
  margin-top: 1.5rem;
}
.blog-comments__status {
  margin-top: 1rem;
  padding: 1rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
}
.blog-comments__status--error {
  color: #ef4444;
}
</style>
