type PageHeaderProps = {
  title: string
  description: string
  meta?: string
}

export function PageHeader({ title, description, meta }: PageHeaderProps) {
  return (
    <div className="fade-up mb-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
            {description}
          </p>
        </div>
        {meta ? <p className="text-xs text-ink-muted">{meta}</p> : null}
      </div>
    </div>
  )
}
