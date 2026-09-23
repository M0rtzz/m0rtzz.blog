export default function Loading() {
  return (
    <main
      aria-busy='true'
      className='m-auto grid grid-cols-[1fr_min(80ch,100%)_1fr] justify-center px-4 py-28 md:px-8 xl:grid-cols-[80ch_30ch]'
    >
      <div className='max-xl:col-start-2 xl:col-span-2'>
        <div className='h-4 w-32 animate-pulse rounded bg-surface-2' />
        <div className='mt-8 h-14 max-w-2xl animate-pulse rounded bg-surface-2' />
        <div className='mt-8 h-4 w-48 animate-pulse rounded bg-surface-2' />
      </div>
      <div className='mt-24 space-y-5 max-xl:col-start-2'>
        <div className='h-5 w-full animate-pulse rounded bg-surface-2' />
        <div className='h-5 w-11/12 animate-pulse rounded bg-surface-2' />
        <div className='h-5 w-4/5 animate-pulse rounded bg-surface-2' />
        <div className='h-5 w-full animate-pulse rounded bg-surface-2' />
        <div className='h-5 w-3/4 animate-pulse rounded bg-surface-2' />
        <div className='h-64 w-full animate-pulse rounded bg-surface-2' />
        <div className='h-5 w-full animate-pulse rounded bg-surface-2' />
        <div className='h-5 w-5/6 animate-pulse rounded bg-surface-2' />
      </div>
      <noscript>
        <style>{`main[aria-busy] .animate-pulse { display: none !important; }`}</style>
        <p className='mt-24 max-xl:col-start-2'>请启用 JavaScript 以阅读文章。</p>
      </noscript>
    </main>
  )
}
