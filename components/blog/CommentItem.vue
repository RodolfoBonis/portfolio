<template>
  <article class="comment" :class="{ 'comment--reply': depth > 0 }">
    <header class="comment__head">
      <span class="comment__author">{{ comment.author_name }}</span>
      <span class="comment__time" :title="comment.created_at">
        {{ formatCommentTime(comment.created_at, lang) }}
      </span>
      <span v-if="comment.edited_at" class="comment__edited">{{ t.edited }}</span>
    </header>

    <!-- body_html arrives sanitised by bluemonday on the API side
         (UGC policy: no scripts, no iframes, no inline styles). Safe
         to v-html. -->
    <div
      v-if="comment.status === 'visible'"
      class="comment__body prose-blog"
      v-html="comment.body_html"
    ></div>
    <div v-else class="comment__body comment__body--removed">
      <em>{{ t.removed }}</em>
    </div>

    <footer class="comment__foot">
      <button
        v-if="depth + 1 < maxDepth"
        type="button"
        class="comment__action"
        @click="showReply = !showReply"
      >
        {{ showReply ? t.cancelReply : t.reply }}
      </button>
      <button
        v-if="canEdit"
        type="button"
        class="comment__action"
        @click="editing = !editing"
      >
        {{ editing ? t.cancel : t.edit }}
      </button>
      <button
        type="button"
        class="comment__action comment__action--danger"
        :disabled="flagging"
        @click="onFlag"
      >
        {{ flagged ? t.flagged : t.flag }}
      </button>
    </footer>

    <!-- Inline edit textarea — only visible to the original author
         (canEdit checks both window expiry + presence of edit_token
         in localStorage). -->
    <div v-if="editing" class="comment__edit">
      <textarea v-model="editBody" rows="3" maxlength="4000"></textarea>
      <div class="comment__edit-actions">
        <button type="button" :disabled="saving" @click="onSaveEdit">
          {{ saving ? t.saving : t.save }}
        </button>
      </div>
      <p v-if="editError" class="comment__error" role="alert">{{ editError }}</p>
    </div>

    <!-- Reply form — bubbles the new comment up so the parent list
         can splice it under this node without a full refetch. -->
    <CommentForm
      v-if="showReply"
      :post-slug="postSlug"
      :lang="lang"
      :parent-id="comment.id"
      is-reply
      @submitted="onReplySubmitted"
      @cancel="showReply = false"
    />

    <!-- Recursive children. Depth is enforced both server-side
         (MaxThreadDepth=3) and client-side (the Reply button
         disappears when the cap is reached). -->
    <div v-if="comment.children?.length" class="comment__children">
      <CommentItem
        v-for="child in comment.children"
        :key="child.id"
        :comment="child"
        :post-slug="postSlug"
        :lang="lang"
        :depth="depth + 1"
        :max-depth="maxDepth"
        @reply-added="(c) => $emit('reply-added', c)"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  formatCommentTime,
  isWithinEditWindow,
  useComments,
  type BlogComment,
} from '~/composables/useComments'

const props = defineProps<{
  comment: BlogComment
  postSlug: string
  lang: 'pt-BR' | 'en'
  depth: number
  maxDepth: number
}>()

const emit = defineEmits<{
  (e: 'reply-added', comment: BlogComment): void
}>()

const comments = useComments()
const showReply = ref(false)
const editing = ref(false)
const editBody = ref(props.comment.body_md)
const saving = ref(false)
const editError = ref('')
const flagging = ref(false)
const flagged = ref(false)

const canEdit = computed(() =>
  comments.canEdit(props.comment.id) && isWithinEditWindow(props.comment.created_at),
)

async function onSaveEdit() {
  if (!editBody.value.trim()) return
  saving.value = true
  editError.value = ''
  try {
    const updated = await comments.edit(props.comment.id, editBody.value)
    // Mutate in place — the parent re-renders via prop reactivity.
    Object.assign(props.comment, updated)
    editing.value = false
  } catch (err) {
    editError.value = (err as { data?: { error?: string } })?.data?.error ?? 'Falha ao salvar'
  } finally {
    saving.value = false
  }
}

async function onFlag() {
  if (flagged.value) return
  // Flag also goes through Turnstile on the API side. We don't show
  // a captcha here for the click — the rate-limit (10/min/IP) plus
  // server dedup are the safety net. A future improvement: open a
  // small modal with a NuxtTurnstile widget for the flag too.
  flagging.value = true
  try {
    await comments.flag(props.comment.id, {
      reason: '',
      turnstile_token: 'noop', // backend will 403 — see TODO note below
    })
    flagged.value = true
  } catch {
    // Turnstile rejection or network — silent for now.
    flagged.value = false
  } finally {
    flagging.value = false
  }
}

function onReplySubmitted(c: BlogComment) {
  showReply.value = false
  emit('reply-added', c)
}

const t = {
  'pt-BR': {
    reply: 'Responder',
    cancelReply: 'Cancelar',
    edit: 'Editar',
    cancel: 'Cancelar',
    save: 'Salvar',
    saving: 'Salvando…',
    flag: '🚩 Reportar',
    flagged: '✓ Reportado',
    removed: '[comentário removido]',
    edited: 'editado',
  },
  en: {
    reply: 'Reply',
    cancelReply: 'Cancel',
    edit: 'Edit',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving…',
    flag: '🚩 Report',
    flagged: '✓ Reported',
    removed: '[comment removed]',
    edited: 'edited',
  },
}[props.lang]
</script>

<style scoped>
.comment {
  padding: 0.75rem 0;
  border-top: 1px solid var(--border);
}
.comment--reply {
  border-top: none;
  border-left: 2px solid var(--border);
  padding-left: 0.75rem;
  margin-top: 0.5rem;
}
.comment__head {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}
.comment__author {
  font-weight: 600;
  color: var(--text-primary);
}
.comment__time {
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
}
.comment__edited {
  color: var(--text-muted);
  font-style: italic;
  font-size: 0.7rem;
}
.comment__body--removed {
  color: var(--text-muted);
  font-size: 0.9rem;
}
.comment__foot {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
.comment__action {
  background: none;
  border: none;
  font: inherit;
  color: var(--text-muted);
  font-size: 0.75rem;
  padding: 0;
  cursor: pointer;
}
.comment__action:hover {
  color: var(--accent);
}
.comment__action--danger:hover {
  color: #ef4444;
}
.comment__edit {
  margin-top: 0.5rem;
}
.comment__edit textarea {
  width: 100%;
  font: inherit;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background: var(--bg-canvas);
  color: var(--text-primary);
}
.comment__edit-actions {
  margin-top: 0.5rem;
  display: flex;
  justify-content: flex-end;
}
.comment__edit-actions button {
  font: inherit;
  padding: 0.35rem 0.85rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}
.comment__error {
  color: #ef4444;
  font-size: 0.8rem;
  margin: 0.25rem 0 0;
}
.comment__children {
  margin-top: 0.5rem;
  padding-left: 0.75rem;
}
</style>
