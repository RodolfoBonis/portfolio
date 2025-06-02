import {
  defineEventHandler,
  getRouterParam,
  setResponseHeader,
  createError,
  sendError,
} from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const path = getRouterParam(event, 'path')

    if (!path) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Caminho da imagem não fornecido',
      })
    }

    const imageUrl = `https://rb-cdn.rodolfodebonis.com.br/v1/cdn/${path}`

    const response = await $fetch(imageUrl, {
      headers: {
        'X-API-Key': String(process.env.CDN_API_KEY),
      },
      responseType: 'arrayBuffer',
    })

    setResponseHeader(event, 'Content-Type', 'image/jpeg')
    setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000')
    return Buffer.from(response as ArrayBuffer)
  } catch (error: any) {
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: 'Erro ao carregar imagem do CDN',
        data: {
          error: error.message,
        },
      }),
    )
  }
})
