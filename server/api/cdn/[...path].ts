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
    // rb-cdn names files with the resource UUID, so the URL is
    // effectively immutable: a re-upload changes the slug. 1d browser
    // cache + 1w CDN cache + stale-while-revalidate up to 30d cuts
    // ~1.5 MiB of repeat transfer per visitor (per Lighthouse, the
    // single biggest "Use efficient cache lifetimes" offender).
    setResponseHeader(
      event,
      'Cache-Control',
      'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
    )
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Error fetching image from CDN',
    })
  }
})
