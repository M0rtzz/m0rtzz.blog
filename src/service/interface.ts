import type { Repository, Label, Connection } from '@discublog/api/interface'

export interface PinnedItems {
  user: {
    pinnedItems: {
      nodes: PinnedItemContent[]
    }
  }
}

export interface PinnedItemContent {
  name: string
  url: string
  description: string
  homepageUrl: string
  stargazerCount: number
  forkCount: number
  visibility: 'PUBLIC'
  languages: Connection<Label>
}

export type RepositoryFile = Repository<{ object: { text: string } }>
