import { useMemo, useState } from 'react'
import type { ContentItem } from '../types'
import { IconExternal } from './Icons'

const kindLabel: Record<ContentItem['kind'], string> = {
  faq: '常见问题',
  sop: 'SOP',
  tool: '工具',
  manual: '手册',
  recording: '录屏',
  rule: '业务规则',
  notice: '通知',
}

type ContentListProps = {
  items: ContentItem[]
  emptyText?: string
  showKind?: boolean
}

export function ContentList({ items, emptyText = '暂无内容', showKind = false }: ContentListProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category).filter(Boolean) as string[])
    return ['全部', ...Array.from(set)]
  }, [items])
  const [category, setCategory] = useState('全部')

  const filtered = items.filter((item) => category === '全部' || item.category === category)
  const active = filtered.find((item) => item.id === activeId) ?? null

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-3">
        {categories.length > 2 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCategory(c)
                  setActiveId(null)
                }}
                className={`rounded-full px-3 py-1 text-xs transition ${
                  category === c
                    ? 'bg-brand text-white'
                    : 'bg-panel text-ink-muted ring-1 ring-line hover:text-brand-deep'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-panel/70 px-4 py-10 text-center text-sm text-ink-muted">
            {emptyText}
          </div>
        ) : (
          filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className={`fade-up w-full rounded-2xl border px-4 py-4 text-left transition ${
                activeId === item.id
                  ? 'border-brand bg-brand-soft shadow-sm'
                  : 'border-line bg-panel hover:border-brand/40 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    {item.pinned && (
                      <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-[11px] font-medium text-accent">
                        置顶
                      </span>
                    )}
                    {showKind && (
                      <span className="rounded-md bg-surface px-1.5 py-0.5 text-[11px] text-ink-muted ring-1 ring-line">
                        {kindLabel[item.kind]}
                      </span>
                    )}
                    {item.category && (
                      <span className="text-[11px] text-ink-muted">{item.category}</span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                    {item.summary}
                  </p>
                </div>
                <div className="shrink-0 text-right text-xs text-ink-muted">
                  <div>{item.updatedAt}</div>
                  {item.views != null && <div className="mt-1">{item.views} 次浏览</div>}
                  {item.duration && <div className="mt-1">{item.duration}</div>}
                </div>
              </div>
              {item.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-surface px-2 py-0.5 text-[11px] text-ink-muted"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))
        )}
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
          {active ? (
            <div className="fade-up">
              <p className="text-xs font-medium tracking-wide text-brand uppercase">
                {kindLabel[active.kind]}
              </p>
              <h2 className="mt-2 font-display text-2xl text-ink">{active.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{active.summary}</p>
              {active.body && (
                <div className="mt-4 whitespace-pre-line rounded-xl bg-surface px-3 py-3 text-sm leading-relaxed text-ink">
                  {active.body}
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink-muted">
                <span>更新于 {active.updatedAt}</span>
                {active.views != null && <span>· 浏览 {active.views}</span>}
                {active.duration && <span>· 时长 {active.duration}</span>}
              </div>
              {active.href && (
                <a
                  href={active.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-deep"
                >
                  打开链接
                  <IconExternal className="h-4 w-4" />
                </a>
              )}
              {!active.href && !active.body && (
                <p className="mt-5 text-sm text-ink-muted">
                  原型阶段展示摘要。接入后台后可在此阅读全文或跳转文档库。
                </p>
              )}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="font-display text-xl text-ink">选择一条内容</p>
              <p className="mt-2 text-sm text-ink-muted">右侧将展示详情、步骤说明或外链入口。</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
