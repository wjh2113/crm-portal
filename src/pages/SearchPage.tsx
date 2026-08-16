import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchContents } from '../data/content'
import { ContentList } from '../components/ContentList'
import { PageHeader } from '../components/PageHeader'

export function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const results = useMemo(() => searchContents(q), [q])

  return (
    <div>
      <PageHeader
        title="搜索结果"
        description={q ? `关键词「${q}」匹配到的内容` : '请输入关键词进行搜索'}
        meta={`${results.length} 条结果`}
      />
      <ContentList items={results} showKind emptyText="没有找到相关内容，试试更短的关键词。" />
    </div>
  )
}
