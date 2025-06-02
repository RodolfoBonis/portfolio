import { defineEventHandler, setResponseHeader } from 'h3'
import { useRuntimeConfig } from 'nuxt/app'

export default defineEventHandler(async (event: any) => {
  const config = useRuntimeConfig()
  const imageUrl = 'https://rb-cdn.rodolfodebonis.com.br/v1/cdn/portfolio/me.jpeg'

  const response = await $fetch(imageUrl, {
    headers: {
      'X-Api-Key': String(config.cdnApiKey),
    },
    responseType: 'arrayBuffer',
  })

  setResponseHeader(event, 'Content-Type', 'image/jpeg')
  return response
}) 