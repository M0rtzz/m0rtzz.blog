import Link from 'next/link'

import { IconHourglassHigh, IconHash } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { TOC } from 'react-markdown-toc/server'

import { repoName, repoOwner } from '~/blog-config'

import { GiscusScript } from '@/components/giscus'
import { Markdown } from '@/markdown'
import { queryAllPosts, queryByNumber } from '@/service'
import { getSummary } from '@/service/summary'
import { readingTime } from '@/utils'

export const generateStaticParams = async () => {
  const {
    search: { nodes },
  } = await queryAllPosts()
  return nodes.map(node => ({ id: `${node.number}` }))
}

export const generateMetadata = async ({ params }: PageProps) => {
  const { id } = params

  const { repository } = await queryByNumber(+id)
  const { discussion } = repository!
  const { title } = discussion!

  // TODO og, twitter
  const summery = await getSummary()
  const description = summery[id]
  return {
    title,
    description,
  }
}

interface PageProps {
  params: {
    id: string
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = params

  const { repository } = await queryByNumber(+id)

  const { discussion } = repository!
  const { title, body, bodyText, labels, createdAt, number } = discussion!

  return (
    <>
      <main className='m-auto grid grid-cols-[1fr_min(80ch,100%)_1fr] justify-center bg-[linear-gradient(to_bottom,transparent,var(--surface)_150px,var(--surface)_calc(100%_-_150px),transparent_100%)] px-4 py-28 md:px-8 xl:grid-cols-[80ch_30ch]'>
        <header className='mb-24 w-fit space-y-8 max-xl:col-start-2 xl:col-span-2'>
          <small>{dayjs(createdAt).format('MMMM D, YYYY')}</small>
          <h1 className='text-5xl'>{title}</h1>
          <div className='flex items-center justify-between text-sm text-color-3'>
            <span className='flex gap-2'>
              {labels.nodes.map(node => (
                <Link
                  key={node.id}
                  className='inline-flex items-center hover:underline'
                  href={`/tags/${node.name}`}
                >
                  <IconHash className='size-3.5' />
                  {node.name}
                </Link>
              ))}
            </span>
            <span className='flex items-center gap-1'>
              <IconHourglassHigh className='size-3.5' />
              {readingTime(bodyText!.length)} min to read
            </span>
          </div>
        </header>
        <article className='prose prose-slate max-w-none dark:prose-invert prose-code:break-words prose-pre:-ml-4 prose-pre:-mr-4 prose-img:-ml-4 prose-img:-mr-4 prose-img:rounded dark:prose-img:brightness-75 max-xl:col-start-2 md:prose-pre:-ml-8 md:prose-pre:-mr-8'>
          <Markdown source={body!} />
          <GiscusScript number={number} repo={`${repoOwner}/${repoName}`} />
        </article>
        <aside className='sticky top-32 ml-auto h-fit w-[22ch] max-xl:hidden'>
          <h2 className='mb-4 whitespace-nowrap text-lg font-semibold tracking-wider has-[+ul:empty]:hidden'>
            TABLE OF CONTENTS
          </h2>
          <TOC
            markdown={body!}
            className='space-y-3 dark:text-color-4'
            ul='pl-6 space-y-2'
            a='data-[active=true]:text-brand dark:data-[active=true]:text-white block text-sm mb-2'
          />
        </aside>
      </main>
    </>
  )
}
