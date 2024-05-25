import { tw } from 'tw-styled'

export const Grid = tw.div`grid grid-flow-row-dense auto-rows-[140px] grid-cols-[repeat(2,140px)] justify-center gap-4 p-4 transition-all duration-1000 ease-out dark:bg-[radial-gradient(ellipse_100%_40%_at_50%_60%,rgba(102,99,246,0.07),transparent)] sm:grid-cols-[repeat(4,140px)] md:auto-rows-[180px] md:grid-cols-[repeat(4,180px)] lg:auto-rows-[220px] lg:grid-cols-[repeat(4,220px)] lg:gap-6 lg:p-8 xl:auto-rows-[280px] xl:grid-cols-[repeat(4,280px)] xl:gap-8 xl:p-12`
