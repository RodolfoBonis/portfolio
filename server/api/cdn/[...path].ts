import {
  defineEventHandler,
  getRouterParam,
  createError,
  setResponseHeader,
} from 'h3'
import { $fetch } from 'ofetch'
import { RbAuthenticator } from '@rblab/rb_auth_client'

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  if (!path) {
    throw createError({
      statusCode: 400,
      message: 'Path parameter is required',
    })
  }

  try {

    const auth = new RbAuthenticator({
      clientID: process.env.CLIENT_ID ?? "",
      clientSecret: process.env.CLIENT_SECRET ?? "",
    });

    const token = await auth.getToken();

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
