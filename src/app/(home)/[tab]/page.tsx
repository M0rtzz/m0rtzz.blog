import upperFirst from 'lodash.upperfirst'

import { staticPage } from '@/app/static-page'

type PageProps = {
  params: { tab: string }
}

export const generateStaticParams = () =>
  staticPage.slice(1).map(name => ({ tab: name.toLowerCase() }))

export const generateMetadata = ({ params }: PageProps) => {
  const title = upperFirst(params.tab)
  return {
    title,
  }
}

export const dynamic = 'error'

export default function Page() {
  return null
}
