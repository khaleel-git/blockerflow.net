import { Link, useParams } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { DemoVideo } from '../components/DemoVideo'
import { GooglePlayBadge } from '../components/GooglePlayBadge'
import { JsonLd } from '../components/JsonLd'
import { ARTICLES, getArticle } from '../seo/articles'
import { PUBLISHED, SITE_NAME, SITE_URL, absoluteUrl } from '../seo/site'
import { VIDEOS } from '../seo/videos'
import { NotFound } from './NotFound'

export function Article() {
  const { slug = '' } = useParams()
  const article = getArticle(slug)
  usePageMeta(article ? `/guides/${article.slug}` : '/404')

  if (!article) return <NotFound />

  const path = `/guides/${article.slug}`
  const url = absoluteUrl(path)
  const video = VIDEOS[article.video]
  const related = article.related
    .map((s) => ARTICLES.find((a) => a.slug === s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: article.h1,
        description: article.description,
        image: `${SITE_URL}${video.poster}`,
        datePublished: PUBLISHED,
        dateModified: PUBLISHED,
        mainEntityOfPage: url,
        author: { '@type': 'Person', name: 'Khaleel', url: 'https://khaleel.eu' },
        publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      },
      {
        '@type': 'VideoObject',
        name: video.name,
        description: video.description,
        thumbnailUrl: `${SITE_URL}${video.poster}`,
        contentUrl: `${SITE_URL}${video.src}`,
        uploadDate: PUBLISHED,
        duration: `PT${video.durationSeconds}S`,
      },
      {
        '@type': 'FAQPage',
        mainEntity: article.faq.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: absoluteUrl('/guides') },
          { '@type': 'ListItem', position: 3, name: article.h1, item: url },
        ],
      },
    ],
  }

  return (
    <article className="mx-auto max-w-5xl px-6 pb-24 pt-12 sm:pt-16">
      <JsonLd data={schema} />

      <nav aria-label="Breadcrumb" className="text-sm text-ink-muted">
        <Link to="/" className="hover:text-ink">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/guides" className="hover:text-ink">
          Guides
        </Link>
      </nav>

      <div
        className={`mt-8 grid gap-12 lg:items-start ${video.landscape ? '' : 'lg:grid-cols-[1fr_260px]'}`}
      >
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {article.h1}
          </h1>
          <p className="mt-6 text-lg text-ink-muted">{article.intro}</p>
          {video.landscape && (
            <DemoVideo video={article.video} caption={article.videoCaption} className="mt-10" />
          )}

          {article.sections.map((section) => (
            <section key={section.heading} className="mt-12">
              <h2 className="font-display text-2xl font-semibold text-ink">{section.heading}</h2>
              {section.paragraphs.map((p) => (
                <p key={p} className="mt-4 text-ink-muted">
                  {p}
                </p>
              ))}
              {section.steps && (
                <ol className="mt-4 list-decimal space-y-2 pl-6 text-ink-muted marker:font-semibold marker:text-primary">
                  {section.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              )}
            </section>
          ))}

          <section className="mt-14">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              {article.faq.map((f) => (
                <div key={f.question} className="rounded-2xl border border-outline bg-surface p-6">
                  <h3 className="font-display text-lg font-semibold text-ink">{f.question}</h3>
                  <p className="mt-2 text-ink-muted">{f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14 rounded-3xl border border-outline bg-primary-bg px-8 py-10 text-center">
            <h2 className="font-display text-2xl font-semibold text-ink">Try Blockerflow</h2>
            <p className="mx-auto mt-3 max-w-md text-ink-muted">
              Block adult content and distracting feeds on Android, with an accountability system
              behind it.
            </p>
            <div className="mt-6 flex justify-center">
              <GooglePlayBadge />
            </div>
          </section>

          <section className="mt-14">
            <h2 className="font-display text-xl font-semibold text-ink">Keep reading</h2>
            <ul className="mt-4 space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link to={`/guides/${r.slug}`} className="font-medium text-primary hover:underline">
                    {r.h1} &rarr;
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/guide" className="font-medium text-primary hover:underline">
                  How to set up Blockerflow &rarr;
                </Link>
              </li>
            </ul>
          </section>
        </div>

        {!video.landscape && (
          <aside className="lg:sticky lg:top-24">
            <DemoVideo video={article.video} caption={article.videoCaption} />
          </aside>
        )}
      </div>
    </article>
  )
}
