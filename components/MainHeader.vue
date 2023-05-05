<template>
  <header>
    <nav
      class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      aria-label="Global"
    >
      <div class="flex lg:flex-1">
        <a href="/" class="-m-1.5 p-1.5">
          <span class="sr-only">Rodolfo De Bonis</span>
          <img class="h-8 w-auto" src="@/static/logo-light.png" alt="" />
        </a>
      </div>

      <div class="flex lg:hidden">
        <button
          type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          @click="mobileMenuOpen = true"
        >
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div class="hidden lg:flex lg:gap-x-12">
        <a href="#about-me" class="text-sm font-semibold leading-6">About me</a>
        <a href="#stacks" class="text-sm font-semibold leading-6">Stacks</a>
        <a href="#works" class="text-sm font-semibold leading-6">Works</a>
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end leading-6">
        <SocialMedia />
      </div>
    </nav>

    <Dialog
      is="div"
      class="lg:hidden"
      :open="mobileMenuOpen"
      @close="mobileMenuOpen = false"
    >
      <div class="fixed inset-0 z-10" />
      <DialogPanel
        class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto dialog px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
      >
        <div class="flex items-center justify-between">
          <a href="#" class="-m-1.5 p-1.5" @click="mobileMenuOpen = false">
            <span class="sr-only">Rodolfo De Bonis</span>
            <img class="h-8 w-auto" src="@/static/logo-light.png" alt="" />
          </a>
          <button
            type="button"
            class="-m-2.5 rounded-md p-2.5 text-gray-700"
            @click="mobileMenuOpen = false"
          >
            <span class="sr-only">Close menu</span>
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="flex-col">
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-gray-500/10">
              <div class="space-y-2 py-6">
                <a
                  href="#about-me"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-900"
                  @click="mobileMenuOpen = false"
                  >About me</a
                >
                <a
                  href="#stacks"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-900"
                  @click="mobileMenuOpen = false"
                  >Stacks</a
                >
                <a
                  href="#works"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-900"
                  @click="mobileMenuOpen = false"
                  >Works</a
                >
              </div>
            </div>
          </div>

          <div class="absolute bottom-5 left-2">
            <SocialMedia />
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>

<script>
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { DialogPanel, Dialog } from '@headlessui/vue'
import SocialMedia from '~/components/SocialMedia.vue'

const mobileMenuOpen = ref(false)

export default {
  name: 'MainHeader',
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { DialogPanel, Dialog, Bars3Icon, XMarkIcon, SocialMedia },
  data: function () {
    return {
      mobileMenuOpen,
    }
  },
}
</script>
