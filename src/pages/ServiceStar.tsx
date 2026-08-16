import { useMemo, useState } from 'react'
import { serviceStars } from '../data/content'
import { PageHeader } from '../components/PageHeader'

export function ServiceStar() {
  const [votes, setVotes] = useState(() =>
    Object.fromEntries(serviceStars.map((s) => [s.id, s.votes])),
  )
  const [votedId, setVotedId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const ranked = useMemo(
    () =>
      [...serviceStars]
        .map((s) => ({ ...s, votes: votes[s.id] ?? s.votes }))
        .sort((a, b) => b.votes - a.votes),
    [votes],
  )

  const totalVotes = ranked.reduce((sum, s) => sum + s.votes, 0)

  function vote(id: string) {
    if (votedId) {
      setMessage('本月您已投过票，每位同事限投 1 票。')
      return
    }
    setVotes((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
    setVotedId(id)
    setMessage('投票成功，感谢参与本期服务之星评选！')
  }

  return (
    <div>
      <PageHeader
        title="服务之星评选"
        description="表彰本月表现突出的服务同事。投票截止：本月 25 日 18:00，每人 1 票。"
        meta={`累计 ${totalVotes} 票`}
      />

      {message && (
        <div
          className={`fade-up mb-4 rounded-xl px-4 py-3 text-sm ${
            votedId
              ? 'bg-brand-soft text-brand-deep'
              : 'bg-accent-soft text-accent'
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {ranked.map((candidate, index) => {
          const ratio = totalVotes ? Math.round((candidate.votes / totalVotes) * 100) : 0
          return (
            <article
              key={candidate.id}
              className={`fade-up rounded-2xl border bg-panel p-5 transition ${
                index === 0 ? 'border-accent/50 shadow-sm' : 'border-line'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-semibold ${
                    index === 0
                      ? 'bg-accent text-white'
                      : 'bg-brand-soft text-brand-deep'
                  }`}
                >
                  {candidate.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-ink">{candidate.name}</h2>
                    {index === 0 && (
                      <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-[11px] font-medium text-accent">
                        当前领先
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-ink-muted">{candidate.team}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink">{candidate.highlight}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs text-ink-muted">
                  <span>{candidate.votes} 票</span>
                  <span>{ratio}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      index === 0 ? 'bg-accent' : 'bg-brand'
                    }`}
                    style={{ width: `${Math.max(ratio, 6)}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => vote(candidate.id)}
                disabled={votedId === candidate.id}
                className={`mt-4 w-full rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  votedId === candidate.id
                    ? 'bg-brand text-white'
                    : votedId
                      ? 'cursor-not-allowed bg-surface text-ink-muted'
                      : 'bg-ink text-white hover:bg-brand-deep'
                }`}
              >
                {votedId === candidate.id ? '已投票' : votedId ? '本月已投票' : '投 TA 一票'}
              </button>
            </article>
          )
        })}
      </div>
    </div>
  )
}
