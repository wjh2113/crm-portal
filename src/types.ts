export type ContentKind =
  | 'faq'
  | 'sop'
  | 'tool'
  | 'manual'
  | 'recording'
  | 'rule'
  | 'notice'

export interface ContentItem {
  id: string
  kind: ContentKind
  title: string
  summary: string
  tags: string[]
  updatedAt: string
  views?: number
  href?: string
  body?: string
  category?: string
  duration?: string
  pinned?: boolean
}

export interface ServiceStarCandidate {
  id: string
  name: string
  team: string
  avatar: string
  highlight: string
  votes: number
}

export interface NavItem {
  to: string
  label: string
  icon: string
  description: string
}
