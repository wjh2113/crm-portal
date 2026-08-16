import { Link } from 'react-router-dom'
import { byKind, navItems, serviceStars } from '../data/content'
import { navIcons } from '../components/navIcons'

export function Home() {
  const notices = byKind('notice').slice(0, 3)
  const faqs = byKind('faq').slice(0, 3)
  const tools = byKind('tool').slice(0, 4)
  const topStar = [...serviceStars].sort((a, b) => b.votes - a.votes)[0]

  return (
    <div className="space-y-6">
      <section className="fade-up overflow-hidden rounded-3xl border border-line bg-panel">
        <div className="relative grid gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                'linear-gradient(135deg, rgba(13,110,110,0.12) 0%, transparent 45%, rgba(201,133,42,0.1) 100%)',
            }}
          />
          <div className="relative">
            <p className="text-sm font-medium tracking-wide text-brand">CRM Portal</p>
            <h1 className="mt-2 font-display text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
              把常见问题、SOP 和工具
              <br className="hidden sm:block" />
              放在触手可及的位置
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
              面向 CRM 一线用户的知识与服务门户：查规则、看手册、找工具、参与服务之星评选。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/faq"
                className="shine rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-deep"
              >
                查常见问题
              </Link>
              <Link
                to="/service-star"
                className="rounded-xl border border-line bg-panel px-4 py-2.5 text-sm font-medium text-ink hover:border-brand/40"
              >
                参与服务之星评选
              </Link>
            </div>
          </div>

          <div className="relative rounded-2xl border border-line bg-surface/80 p-4">
            <p className="text-xs font-medium text-ink-muted">本期领先</p>
            <p className="mt-2 font-display text-2xl text-ink">{topStar.name}</p>
            <p className="text-sm text-ink-muted">{topStar.team}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink">{topStar.highlight}</p>
            <p className="mt-4 text-sm font-semibold text-accent">{topStar.votes} 票</p>
          </div>
        </div>
      </section>

      <section className="fade-up fade-up-delay-1 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {navItems
          .filter((item) => item.to !== '/')
          .slice(0, 8)
          .map((item) => {
            const Icon = navIcons[item.to as keyof typeof navIcons]
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group rounded-2xl border border-line bg-panel p-4 transition hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-md"
              >
                <Icon className="h-5 w-5 text-brand transition group-hover:scale-110" />
                <p className="mt-3 font-medium text-ink">{item.label}</p>
                <p className="mt-1 text-xs text-ink-muted">{item.description}</p>
              </Link>
            )
          })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="fade-up fade-up-delay-2 rounded-2xl border border-line bg-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl">系统通知</h2>
            <Link to="/notices" className="text-sm text-brand hover:underline">
              全部
            </Link>
          </div>
          <div className="space-y-3">
            {notices.map((notice) => (
              <Link
                key={notice.id}
                to="/notices"
                className="block rounded-xl border border-transparent bg-surface px-3 py-3 transition hover:border-brand/30"
              >
                <div className="flex items-center gap-2">
                  {notice.pinned && (
                    <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[11px] text-accent">
                      置顶
                    </span>
                  )}
                  <span className="text-xs text-ink-muted">{notice.updatedAt}</span>
                </div>
                <p className="mt-1 font-medium text-ink">{notice.title}</p>
                <p className="mt-1 text-sm text-ink-muted">{notice.summary}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="fade-up fade-up-delay-2 rounded-2xl border border-line bg-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl">高频问题</h2>
              <Link to="/faq" className="text-sm text-brand hover:underline">
                更多
              </Link>
            </div>
            <ul className="space-y-3">
              {faqs.map((faq) => (
                <li key={faq.id}>
                  <Link to="/faq" className="block text-sm font-medium text-ink hover:text-brand">
                    {faq.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-ink-muted">{faq.views} 次浏览</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="fade-up fade-up-delay-3 rounded-2xl border border-line bg-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl">常用工具</h2>
              <Link to="/tools" className="text-sm text-brand hover:underline">
                全部
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {tools.map((tool) => (
                <a
                  key={tool.id}
                  href={tool.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-surface px-3 py-3 text-sm font-medium text-ink transition hover:bg-brand-soft hover:text-brand-deep"
                >
                  {tool.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
