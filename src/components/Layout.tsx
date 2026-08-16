import { useState, type FormEvent } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { navItems } from '../data/content'
import { IconSearch } from './Icons'
import { navIcons } from './navIcons'

export function Layout() {
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const fromForm = String(formData.get('q') || '').trim()
    const q = fromForm || query.trim()
    if (!q) return
    setQuery(q)
    navigate(`/search?q=${encodeURIComponent(q)}`)
    setMenuOpen(false)
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[260px] border-r border-line bg-[color-mix(in_oklab,var(--color-panel)_92%,transparent)] backdrop-blur-md transition-transform lg:static lg:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col px-4 py-5">
          <div className="mb-6 px-2">
            <p className="font-display text-2xl tracking-tight text-brand-deep">CRM 知识门户</p>
            <p className="mt-1 text-sm text-ink-muted">一线同事的日常工作台</p>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto pb-4">
            {navItems.map((item) => {
              const Icon = navIcons[item.to as keyof typeof navIcons]
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                      isActive
                        ? 'bg-brand text-white shadow-sm shadow-brand/20'
                        : 'text-ink-muted hover:bg-brand-soft hover:text-brand-deep'
                    }`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0 opacity-90" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          <div className="rounded-2xl bg-brand-soft px-3 py-3 text-sm text-brand-deep">
            <p className="font-medium">需要补充资料？</p>
            <p className="mt-1 text-xs leading-relaxed opacity-80">
              将 FAQ / SOP / 录屏提交给知识运营同学，审核后展示在对应栏目。
            </p>
          </div>
        </div>
      </aside>

      {menuOpen && (
        <button
          type="button"
          aria-label="关闭菜单"
          className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-line/80 bg-[color-mix(in_oklab,var(--color-surface)_85%,transparent)] backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-panel text-ink lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="打开菜单"
            >
              ☰
            </button>

            <form onSubmit={onSearch} className="relative flex min-w-0 flex-1 gap-2">
              <div className="relative min-w-0 flex-1">
                <IconSearch className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input
                  name="q"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索常见问题、SOP、手册、业务规则…"
                  className="w-full rounded-xl border border-line bg-panel py-2.5 pr-4 pl-10 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
                />
              </div>
              <button
                type="submit"
                className="inline-flex shrink-0 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-deep"
              >
                搜索
              </button>
            </form>

            <div className="hidden items-center gap-2 sm:flex">
              <div className="rounded-full bg-panel px-3 py-1.5 text-xs text-ink-muted ring-1 ring-line">
                示例账号 · 服务专员
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
