import { byKind } from '../data/content'
import type { ContentItem } from '../types'
import { ContentList } from '../components/ContentList'
import { PageHeader } from '../components/PageHeader'

type ContentPageProps = {
  kind: ContentItem['kind']
  title: string
  description: string
}

export function ContentPage({ kind, title, description }: ContentPageProps) {
  const items = byKind(kind)
  return (
    <div>
      <PageHeader title={title} description={description} meta={`共 ${items.length} 条`} />
      <ContentList items={items} />
    </div>
  )
}
