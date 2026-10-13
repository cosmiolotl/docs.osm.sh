'use client'
import { useState } from 'react'
import { useDocsSearch } from 'fumadocs-core/search/client'
import { fetchClient } from 'fumadocs-core/search/client/fetch'
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  TagsList,
  TagsListItem,
} from 'fumadocs-ui/components/dialog/search'
import type { SharedProps } from 'fumadocs-ui/contexts/search'

const KINDS = ['writing', 'projects', 'notes'] as const

/*
  Find: full-text search over /api/search, narrowed to one kind of page
  by the tags under the results.
*/
export function Search(props: SharedProps) {
  const [tag, setTag] = useState<string | undefined>()
  const search = useDocsSearch({ client: fetchClient({ api: '/api/search', tag }) })

  return (
    <SearchDialog {...search} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput placeholder="find pages" />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList />
        <SearchDialogFooter>
          <TagsList tag={tag} onTagChange={setTag} allowClear>
            {KINDS.map((kind) => (
              <TagsListItem key={kind} value={kind}>
                {kind}
              </TagsListItem>
            ))}
          </TagsList>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  )
}
