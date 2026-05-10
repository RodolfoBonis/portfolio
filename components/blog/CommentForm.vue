<template>
  <form
    class="comment-form"
    :class="{ 'comment-form--reply': isReply }"
    @submit.prevent="onSubmit"
  >
    <div v-if="!isReply" class="comment-form__row">
      <div class="comment-form__field">
        <label :for="`name-${formId}`">{{ t.name }} *</label>
        <input
          :id="`name-${formId}`"
          v-model="form.name"
          type="text"
          maxlength="80"
          required
          autocomplete="name"
        />
      </div>
      <div class="comment-form__field">
        <label :for="`email-${formId}`">{{ t.email }} *</label>
        <input
          :id="`email-${formId}`"
          v-model="form.email"
          type="email"
          maxlength="254"
          required
          autocomplete="email"
        />
      </div>
    </div>
    <div class="comment-form__field">
      <label :for="`body-${formId}`">{{ isReply ? t.reply : t.body }} *</label>
      <textarea
        :id="`body-${formId}`"
        v-model="form.body"
        rows="4"
        maxlength="4000"
        required
        :placeholder="t.placeholder"
      ></textarea>
      <small class="comment-form__hint">{{ t.markdownHint }}</small>
    </div>

    <!-- Honeypot: real users never fill this; bots filling everything do. -->
    <input
      v-model="form.website"
      type="text"
      class="comment-form__honeypot"
      tabindex="-1"
      autocomplete="off"
      aria-hidden="true"
    />

    <div class="comment-form__turnstile">
      <NuxtTurnstile v-model="form.turnstile" />
    </div>

    <div class="comment-form__actions">
      <button v-if="isReply" type="button" class="comment-form__cancel" @click="$emit('cancel')">
        {{ t.cancel }}
      </button>
      <button
        type="submit"
        class="comment-form__submit"
        :disabled="submitting || !form.turnstile"
      >
        {{ submitting ? t.sending : t.submit }}
      </button>
    </div>

    <p v-if="error" class="comment-form__error" role="alert">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, useId } from 'vue'
import { useComments, type BlogComment } from '~/composables/useComments'

const props = defineProps<{
  postSlug: string
  lang: 'pt-BR' | 'en'
  parentId?: string | null
  // When the form is rendered inside a reply tree we hide the
  // identity fields and reuse the cached name/email from the
  // previous root submission (see usePersistedAuthor below).
  isReply?: boolean
}>()

const emit = defineEmits<{
  (e: 'submitted', comment: BlogComment): void
  (e: 'cancel'): void
}>()

const formId = useId()
const comments = useComments()

// Persist name+email per browser so the second comment doesn't ask
// again. Email never echoes back from the server (privacy), so we
// have to store it client-side. localStorage is fine: this is the
// commenter's own data.
const stored = usePersistedAuthor()

const form = reactive({
  name: stored.name,
  email: stored.email,
  body: '',
  website: '', // honeypot
  turnstile: '',
})

const submitting = ref(false)
const error = ref('')

const t = computed(() => translations[props.lang])

async function onSubmit() {
  // Honeypot trap: silently drop without telling the bot it failed.
  if (form.website) {
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      form.body = ''
    }, 800)
    return
  }
  // Reply path inherits the cached author identity; we don't bother
  // showing the inputs again so the form stays compact.
  const name = props.isReply ? stored.name : form.name
  const email = props.isReply ? stored.email : form.email
  if (!name || !email) {
    error.value = t.value.identityRequired
    return
  }
  if (!form.turnstile) {
    error.value = t.value.captchaRequired
    return
  }

  submitting.value = true
  error.value = ''
  try {
    const created = await comments.create(
      props.postSlug,
      {
        parent_id: props.parentId ?? null,
        author_name: name,
        author_email: email,
        body_md: form.body,
        turnstile_token: form.turnstile,
      },
      props.lang,
    )
    if (!props.isReply) {
      stored.persist(name, email)
    }
    form.body = ''
    form.turnstile = ''
    emit('submitted', created)
  } catch (err: unknown) {
    error.value = extractError(err, t.value.failed)
  } finally {
    submitting.value = false
  }
}

function extractError(err: unknown, fallback: string): string {
  if (typeof err === 'object' && err && 'data' in err) {
    const data = (err as { data?: { error?: string; detail?: string; message?: string } }).data
    return data?.detail || data?.error || data?.message || fallback
  }
  return fallback
}

interface PersistedAuthor {
  name: string
  email: string
  persist: (name: string, email: string) => void
}

function usePersistedAuthor(): PersistedAuthor {
  const out: PersistedAuthor = {
    name: '',
    email: '',
    persist(n, e) {
      this.name = n
      this.email = e
      if (import.meta.client) {
        try {
          window.localStorage.setItem('blog:comment:author', JSON.stringify({ name: n, email: e }))
        } catch {
          /* swallow */
        }
      }
    },
  }
  if (import.meta.client) {
    try {
      const raw = window.localStorage.getItem('blog:comment:author')
      if (raw) {
        const parsed = JSON.parse(raw) as { name?: string; email?: string }
        out.name = parsed.name ?? ''
        out.email = parsed.email ?? ''
      }
    } catch {
      /* swallow */
    }
  }
  return out
}

const translations = {
  'pt-BR': {
    name: 'Nome',
    email: 'E-mail (não publicado)',
    body: 'Comentário',
    reply: 'Resposta',
    placeholder: 'Suporta markdown básico (negrito, itálico, links, listas).',
    markdownHint: '*itálico*, **negrito**, [link](url) — sem imagens.',
    submit: 'Comentar',
    sending: 'Enviando…',
    cancel: 'Cancelar',
    failed: 'Não foi possível enviar. Tente novamente.',
    identityRequired: 'Informe nome e e-mail.',
    captchaRequired: 'Confirme que você não é um bot.',
  },
  en: {
    name: 'Name',
    email: 'Email (not published)',
    body: 'Comment',
    reply: 'Reply',
    placeholder: 'Basic markdown supported (bold, italic, links, lists).',
    markdownHint: '*italic*, **bold**, [link](url) — no images.',
    submit: 'Post',
    sending: 'Sending…',
    cancel: 'Cancel',
    failed: 'Could not submit. Please try again.',
    identityRequired: 'Name and email required.',
    captchaRequired: 'Please confirm you are not a bot.',
  },
} as const
</script>

<style scoped>
.comment-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--bg-elevated, transparent);
}
.comment-form--reply {
  margin-top: 0.5rem;
  background: transparent;
}
.comment-form__row {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: 1fr;
}
@media (min-width: 640px) {
  .comment-form__row {
    grid-template-columns: 1fr 1fr;
  }
}
.comment-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.comment-form__field label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.comment-form__field input,
.comment-form__field textarea {
  font: inherit;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background: var(--bg-canvas);
  color: var(--text-primary);
  resize: vertical;
}
.comment-form__field textarea {
  min-height: 6rem;
}
.comment-form__hint {
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-muted);
  font-size: 0.7rem;
}
.comment-form__honeypot {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}
.comment-form__turnstile {
  min-height: 65px;
}
.comment-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
.comment-form__submit,
.comment-form__cancel {
  font: inherit;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  border: 1px solid transparent;
}
.comment-form__submit {
  background: var(--accent);
  color: white;
}
.comment-form__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.comment-form__cancel {
  background: transparent;
  border-color: var(--border);
  color: var(--text-primary);
}
.comment-form__error {
  color: #ef4444;
  font-size: 0.85rem;
  margin: 0;
}
</style>
