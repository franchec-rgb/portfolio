import { useEffect } from 'react'

interface DocumentMeta {
  title: string
  description?: string
  canonical?: string
}

function upsertMeta(name: string, content: string): () => void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  const created = !el
  const previous = el?.getAttribute('content') ?? null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
  return () => {
    if (created) {
      el?.remove()
    } else if (previous !== null) {
      el?.setAttribute('content', previous)
    }
  }
}

function upsertLink(rel: string, href: string): () => void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  const created = !el
  const previous = el?.getAttribute('href') ?? null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
  return () => {
    if (created) {
      el?.remove()
    } else if (previous !== null) {
      el?.setAttribute('href', previous)
    }
  }
}

/**
 * Sets document.title and (optionally) the meta description and canonical link
 * for the current route. Restores prior values on unmount so navigation between
 * routes leaves no stale tags behind.
 *
 * Per-route OG/Twitter tags are intentionally not updated here: most social
 * scrapers (Slack, Twitter, LinkedIn, iMessage) do not execute JavaScript and
 * will only ever read the static index.html. Googlebot, which does execute JS,
 * is the primary consumer of the per-route values set here.
 */
export function useDocumentMeta({ title, description, canonical }: DocumentMeta): void {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    const restorers: Array<() => void> = []
    if (description) restorers.push(upsertMeta('description', description))
    if (canonical) restorers.push(upsertLink('canonical', canonical))

    return () => {
      document.title = previousTitle
      for (const restore of restorers) restore()
    }
  }, [title, description, canonical])
}
