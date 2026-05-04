import { RbAuthenticator } from '@rblab/rb_auth_client'

let authenticator: RbAuthenticator | null = null

export function getAuthenticator(): RbAuthenticator {
  if (!authenticator) {
    authenticator = new RbAuthenticator({
      clientID: process.env.CLIENT_ID ?? '',
      clientSecret: process.env.CLIENT_SECRET ?? '',
    })
  }
  return authenticator
}
