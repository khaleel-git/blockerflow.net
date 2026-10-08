import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AppRoutes } from './AppRoutes'
import { ROUTE_META, NOT_FOUND_META, type RouteMeta } from './seo/routes'
import { renderHead } from './seo/head'

export { ROUTE_META, NOT_FOUND_META, renderHead }
export type { RouteMeta }

export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>,
  )
}
