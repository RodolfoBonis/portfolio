import {
  defineEventHandler,
  getRouterParam,
  createError,
  setResponseHeader,
} from 'h3'
import { $fetch } from 'ofetch'
import { getAuthenticator } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  if (!path) {
    throw createError({
      statusCode: 400,
      message: 'Path parameter is required',
    })
  }

  try {
    const token = await getAuthenticator().getToken()

    const imageUrl = `https://rb-cdn.rodolfodebonis.com.br/v1/cdn/${path}`
    const response = await $fetch(imageUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setResponseHeader(event, 'Content-Type', 'image/png')
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Error fetching image from CDN',
    })
  }
})
