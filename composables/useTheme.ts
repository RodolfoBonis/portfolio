import { ref, onMounted } from 'vue'

export const useTheme = () => {
  const isDarkMode = ref(false)

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      isDarkMode.value = true
      document.documentElement.classList.remove('light-mode')
    } else {
      isDarkMode.value = false
      document.documentElement.classList.add('light-mode')
    }
  }

  onMounted(() => {
    initTheme()
  })

  return {
    isDarkMode,
    initTheme,
  }
}
