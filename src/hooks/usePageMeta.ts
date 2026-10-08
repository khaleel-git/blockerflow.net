import { useEffect } from 'react'
import { getRouteMeta } from '../seo/routes'
import { absoluteUrl } from '../seo/site'

function setTag(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

function metaTag(key: 'name' | 'property', name: string) {
  return () => {
    const el = document.createElement('meta')
    el.setAttribute(key, name)
    return el
  }
}

/**
 * Keeps the head in sync when the visitor navigates in the browser. The first load already has
 * correct tags because every route is prerendered, so this only matters for client navigation.
 */
export function usePageMeta(path: string) {
  useEffect(() => {
    const meta = getRouteMeta(path)
    const url = absoluteUrl(path)
    document.title = meta.title
    setTag('meta[name="description"]', metaTag('name', 'description'), 'content', meta.description)
    setTag('meta[property="og:title"]', metaTag('property', 'og:title'), 'content', meta.title)
    setTag(
      'meta[property="og:description"]',
      metaTag('property', 'og:description'),
      'content',
      meta.description,
    )
    setTag('meta[name="twitter:title"]', metaTag('name', 'twitter:title'), 'content', meta.title)
    setTag(
      'meta[name="twitter:description"]',
      metaTag('name', 'twitter:description'),
      'content',
      meta.description,
    )
    if (!meta.noindex) {
      setTag('meta[property="og:url"]', metaTag('property', 'og:url'), 'content', url)
      setTag(
        'link[rel="canonical"]',
        () => {
          const el = document.createElement('link')
          el.setAttribute('rel', 'canonical')
          return el
        },
        'href',
        url,
      )
    }
  }, [path])
}
