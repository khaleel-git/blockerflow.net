// Host-level redirects to the canonical domain.
//
// Pages' own `_redirects` file cannot do this: its source is a path, and domain-level redirects
// are explicitly unsupported there. A Redirect Rule on the zone would also work, but keeping it
// here means the rule lives with the site it belongs to and ships with the same deploy.
//
// Putting a `_worker.js` in the output directory turns on Pages' advanced mode, where this Worker
// receives every request and anything it does not answer itself must be handed to the static
// asset server explicitly. `env.ASSETS.fetch` is that asset server, the same one that serves the
// site when no Worker is present, so directory indexes and the custom 404 keep working.
const CANONICAL_HOST = 'blockerflow.net'

/** Old address, kept alive so existing links and search results still arrive. */
const REDIRECT_HOSTS = new Set(['blockerflow.khaleel.eu', 'www.blockerflow.khaleel.eu', 'www.blockerflow.net'])

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (REDIRECT_HOSTS.has(url.hostname)) {
      url.protocol = 'https:'
      url.hostname = CANONICAL_HOST
      url.port = ''
      // 301, not 302: this move is permanent, and search engines only pass ranking on for a
      // permanent redirect.
      return Response.redirect(url.toString(), 301)
    }

    return env.ASSETS.fetch(request)
  },
}
