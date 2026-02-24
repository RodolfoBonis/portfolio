<template>
  <section
    id="hero"
    class="min-h-screen flex items-center justify-center relative overflow-hidden"
  >
    <!-- Gradient background -->
    <div class="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/5 via-transparent to-transparent"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)]/5 rounded-full blur-[128px] pointer-events-none"></div>

    <div class="section-container w-full py-32">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Left: Content -->
        <div class="space-y-8">
          <div class="animate-fade-up">
            <span class="badge">Disponível para projetos</span>
          </div>

          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] animate-fade-up delay-100">
            Rodolfo
            <br />
            <span class="text-[var(--accent)]">De Bonis</span>
          </h1>

          <p class="text-lg md:text-xl text-[var(--text-secondary)] max-w-lg animate-fade-up delay-200">
            Engenheiro de Software com {{ yearsExp }}+ anos transformando
            ideias complexas em sistemas que <span class="text-[var(--text-primary)]">simplesmente funcionam</span>.
          </p>

          <div class="flex flex-wrap gap-4 animate-fade-up delay-300">
            <a
              href="#contact"
              class="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--bg-primary)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors"
            >
              <span class="material-icons text-lg">rocket_launch</span>
              Vamos conversar
            </a>
            <a
              href="#projects"
              class="inline-flex items-center gap-2 border border-[var(--border)] text-[var(--text-primary)] px-6 py-3 rounded-lg font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              Ver projetos
              <span class="material-icons text-lg">arrow_forward</span>
            </a>
          </div>

          <!-- Quick stats -->
          <div class="flex gap-8 pt-4 animate-fade-up delay-400">
            <div>
              <div class="text-2xl font-bold text-[var(--text-primary)] mono">{{ yearsExp }}+</div>
              <div class="text-xs text-[var(--text-muted)] mono">anos de xp</div>
            </div>
            <div class="w-px bg-[var(--border)]"></div>
            <div>
              <div class="text-2xl font-bold text-[var(--text-primary)] mono">24+</div>
              <div class="text-xs text-[var(--text-muted)] mono">tecnologias</div>
            </div>
            <div class="w-px bg-[var(--border)]"></div>
            <div>
              <div class="text-2xl font-bold text-[var(--text-primary)] mono">∞</div>
              <div class="text-xs text-[var(--text-muted)] mono">café consumido</div>
            </div>
          </div>
        </div>

        <!-- Right: Terminal -->
        <div class="animate-fade-up delay-200">
          <div class="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl overflow-hidden shadow-2xl">
            <!-- Terminal header -->
            <div class="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-tertiary)]">
              <div class="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
              <div class="w-3 h-3 rounded-full bg-[#febc2e]"></div>
              <div class="w-3 h-3 rounded-full bg-[#28c840]"></div>
              <span class="ml-2 text-xs text-[var(--text-muted)] mono">rodolfo@rb-lab:~</span>
            </div>
            <!-- Terminal content -->
            <div class="p-6 mono text-sm leading-relaxed space-y-2">
              <div>
                <span class="text-[var(--accent)]">❯</span>
                <span class="text-[var(--text-muted)]"> cat</span>
                <span class="text-[var(--text-primary)]"> sobre.json</span>
              </div>
              <div class="text-[var(--text-muted)] pl-2">
                <div>{</div>
                <div class="pl-4">
                  <span class="text-[var(--accent)]">"nome"</span>: <span class="text-amber-400">"Rodolfo De Bonis"</span>,
                </div>
                <div class="pl-4">
                  <span class="text-[var(--accent)]">"role"</span>: <span class="text-amber-400">"Software Engineer"</span>,
                </div>
                <div class="pl-4">
                  <span class="text-[var(--accent)]">"location"</span>: <span class="text-amber-400">"Maceió, AL 🇧🇷"</span>,
                </div>
                <div class="pl-4">
                  <span class="text-[var(--accent)]">"stack"</span>: [<span class="text-amber-400">"Go"</span>, <span class="text-amber-400">"Flutter"</span>, <span class="text-amber-400">"K8s"</span>, <span class="text-amber-400">"Vue"</span>],
                </div>
                <div class="pl-4">
                  <span class="text-[var(--accent)]">"hobby"</span>: <span class="text-amber-400">"D&amp;D 5e Master 🎲"</span>,
                </div>
                <div class="pl-4">
                  <span class="text-[var(--accent)]">"available"</span>: <span class="text-emerald-400">true</span>
                </div>
                <div>}</div>
              </div>
              <div class="pt-2">
                <span class="text-[var(--accent)]">❯</span>
                <span ref="terminalLine" class="text-[var(--text-primary)]"></span>
                <span class="terminal-cursor"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const yearsExp = new Date().getFullYear() - 2017

const terminalLine = ref(null)
const commands = [
  'kubectl get pods --all-namespaces',
  'go build -o server ./cmd/api',
  'docker compose up -d',
  'git push origin main',
  'terraform apply -auto-approve',
  'flutter run --release',
]

let cmdIdx = 0
let charIdx = 0
const typeSpeed = 60
const eraseSpeed = 30
const delayBetween = 2500

function typeEffect() {
  if (!terminalLine.value) return
  if (charIdx < commands[cmdIdx].length) {
    terminalLine.value.textContent += commands[cmdIdx].charAt(charIdx)
    charIdx++
    setTimeout(typeEffect, typeSpeed)
  } else {
    setTimeout(eraseEffect, delayBetween)
  }
}

function eraseEffect() {
  if (!terminalLine.value) return
  if (charIdx > 0) {
    terminalLine.value.textContent = commands[cmdIdx].substring(0, charIdx - 1)
    charIdx--
    setTimeout(eraseEffect, eraseSpeed)
  } else {
    cmdIdx = (cmdIdx + 1) % commands.length
    setTimeout(typeEffect, 500)
  }
}

onMounted(() => {
  setTimeout(typeEffect, 1500)
})
</script>
