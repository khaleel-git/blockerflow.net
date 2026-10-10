import { Link, useParams } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { AppScreenshot } from '../components/AppScreenshot'
import { DemoVideo } from '../components/DemoVideo'
import { GooglePlayBadge } from '../components/GooglePlayBadge'
import { DownloadButton } from '../components/DownloadButton'
import { Notice } from '../components/Notice'
import { SupportCard } from '../components/SupportSection'
import { JsonLd } from '../components/JsonLd'
import { ARTICLES, getArticle } from '../seo/articles'
import { OG_IMAGE, PUBLISHED, SITE_NAME, SITE_URL, absoluteUrl } from '../seo/site'
import { VIDEOS } from '../seo/videos'
import { NotFound } from './NotFound'

export function Article() {
  const { slug = '' } = useParams()
  const article = getArticle(slug)
  usePageMeta(article ? `/guides/${article.slug}` : '/404')

  if (!article) return <NotFound />

  const path = `/guides/${article.slug}`
  const url = absoluteUrl(path)
  const { media } = article
  const video = media?.kind === 'video' ? VIDEOS[media.video] : null
  /** Landscape clips run full width above the text; portrait media sits in a side column. */
  const inline = Boolean(video?.landscape)
  const aside = Boolean(media) && !inline
  /** With nothing in the side column, narrow the page so the text keeps a readable measure. */
  const narrow = !media
  const image = video
    ? `${SITE_URL}${video.poster}`
    : media?.kind === 'screenshot'
      ? `${SITE_URL}${media.src}`
      : OG_IMAGE
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
        image,
        datePublished: PUBLISHED,
        dateModified: PUBLISHED,
        mainEntityOfPage: url,
        author: { '@type': 'Person', name: 'Khaleel', url: 'https://khaleel.eu' },
        publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      },
      ...(video
        ? [
            {
              '@type': 'VideoObject',
              name: video.name,
              description: video.description,
              thumbnailUrl: `${SITE_URL}${video.poster}`,
              contentUrl: `${SITE_URL}${video.src}`,
              uploadDate: PUBLISHED,
              duration: `PT${video.durationSeconds}S`,
            },
          ]
        : media?.kind === 'screenshot'
          ? [{ '@type': 'ImageObject', contentUrl: image, description: media.alt }]
          : []),
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
    <article
      className={`mx-auto ${narrow ? 'max-w-3xl' : 'max-w-5xl'} px-6 pb-24 pt-12 sm:pt-16`}
    >
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
        className={`mt-8 grid gap-12 lg:items-start ${aside ? 'lg:grid-cols-[1fr_260px]' : ''}`}
      >
        <div className="min-w-0">
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {article.h1}
          </h1>
          <p className="mt-6 text-lg text-ink-muted">{article.intro}</p>
          {article.download && <DownloadButton download={article.download} className="mt-8" />}
          {article.notice && <Notice notice={article.notice} className="mt-6" />}
          {inline && media?.kind === 'video' && (
            <DemoVideo video={media.video} caption={media.caption} className="mt-10" />
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
              {section.notice && <Notice notice={section.notice} className="mt-6" />}
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

          {article.support && <SupportCard className="mt-14" />}

          <section className="mt-14 rounded-3xl border border-outline bg-primary-bg px-8 py-10 text-center">
            <h2 className="font-display text-2xl font-semibold text-ink">Try Blockerflow</h2>
            <p className="mx-auto mt-3 max-w-md text-ink-muted">
              Block adult content and distracting feeds on Android and Mac, with an accountability
              system behind it.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {article.download && <DownloadButton download={article.download} bare />}
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

        {aside && media && (
          <aside className="lg:sticky lg:top-24">
            {media.kind === 'video' ? (
              <DemoVideo video={media.video} caption={media.caption} />
            ) : (
              <AppScreenshot src={media.src} alt={media.alt} caption={media.caption} />
            )}
          </aside>
        )}
      </div>
    </article>
  )
}
