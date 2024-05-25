import { tw } from 'tw-styled'

const WaveCircle = tw.i`animation-breath absolute rounded-full shadow-bento`
export const Wave = () => {
  return (
    <div className='absolute inset-0 overflow-clip'>
      <div className='absolute inset-0 translate-y-4'>
        <WaveCircle className='-inset-12 bg-white/[0.125] !animation-delay-[-1.6s]' />
        <WaveCircle className='-inset-6 bg-white/25 !animation-delay-[-1.52s]' />
        <WaveCircle className='inset-0 bg-white/[0.375] !animation-delay-[-1.44s]' />
        <WaveCircle className='inset-6 bg-white/50 !animation-delay-[-1.36s]' />
        <WaveCircle className='inset-12 bg-white/[0.625] !animation-delay-[-1.28s]' />
        <WaveCircle className='inset-[4.5rem] bg-white/75 !animation-delay-[-1.2s]' />
        <WaveCircle className='inset-24 bg-white/[0.875] !animation-delay-[-1.12s]' />
      </div>
    </div>
  )
}
