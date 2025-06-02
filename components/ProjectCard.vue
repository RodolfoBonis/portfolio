<template>
  <div
    class="bg-[var(--card-color)] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow sr-reveal"
    :style="{ '--delay': `${delay}ms` }"
  >
    <img
      :src="project.image"
      :alt="project.title"
      class="w-full h-40 object-cover"
    />
    <div class="p-6 space-y-4">
      <h3 class="text-2xl font-medium text-[var(--accent-color)]">
        {{ project.title }}
      </h3>
      <p class="text-sm text-[var(--text-color)]">
        {{ project.description }}
      </p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in project.tags"
          :key="tag"
          class="bg-[var(--bg-color)] text-xs px-2 py-1 rounded-md border border-[var(--border-color)]"
        >
          {{ tag }}
        </span>
      </div>
      <div class="mt-4 flex justify-between items-center">
        <a
          :href="project.githubUrl"
          target="_blank"
          class="text-sm text-[var(--accent-color)] hover:text-[var(--accent-light)]"
          >Ver código</a
        >
        <button
          class="bg-[var(--accent-color)] text-white text-xs px-3 py-2 rounded-md hover:bg-[var(--accent-light)] transition"
          @click="openModal"
        >
          Mais detalhes
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div
      :id="`modal-${project.id}`"
      class="fixed inset-0 hidden bg-black bg-opacity-80 z-50 overflow-auto"
    >
      <div
        class="relative max-w-3xl mx-auto mt-20 p-8 bg-[var(--card-color)] rounded-lg"
      >
        <button
          class="absolute top-4 right-4 text-[var(--text-color)] hover:text-red-500 text-2xl"
          @click="closeModal"
        >
          &times;
        </button>
        <h3 class="text-3xl font-medium text-[var(--accent-color)] mb-4">
          {{ project.title }} – Detalhes do Projeto
        </h3>
        <p class="text-sm text-[var(--text-color)] mb-4">
          {{ project.details.description }}
        </p>

        <h4 class="text-2xl text-[var(--heading-color)] mb-2">
          {{
            project.details.challenges
              ? 'Principais Desafios'
              : 'Destaques Técnicos'
          }}
        </h4>
        <ul
          class="list-disc list-inside text-[var(--text-color)] space-y-2 mb-4"
        >
          <li
            v-for="(item, index) in project.details.challenges ||
            project.details.highlights"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>

        <h4 class="text-2xl text-[var(--heading-color)] mb-2">Tecnologias</h4>
        <div class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="tech in project.details.technologies"
            :key="tech"
            class="bg-[var(--bg-color)] text-xs px-2 py-1 rounded-md border border-[var(--border-color)]"
          >
            {{ tech }}
          </span>
        </div>

        <a
          :href="project.githubUrl"
          target="_blank"
          class="text-[var(--accent-color)] hover:underline text-sm"
          >Ver repositório no GitHub →</a
        >
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  delay: {
    type: Number,
    default: 0,
  },
})

function openModal() {
  const modal = document.getElementById(`modal-${props.project.id}`)
  modal.classList.remove('hidden')
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  const modal = document.getElementById(`modal-${props.project.id}`)
  modal.classList.add('hidden')
  document.body.style.overflow = 'auto'
}
</script>
