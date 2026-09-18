import { tw } from 'tw-styled/merge'

const Message = tw.span`absolute -top-5 inline-flex h-11 items-center whitespace-nowrap rounded-[1.33rem] bg-[#30db5b] text-xl max-sm:scale-90 sm:left-32 md:left-[60%] md:scale-110`

const MessageLoadingDot = tw.i`size-3 animate-pulse rounded-full bg-gray-50`
const Hello = ({ children }) => {
  const regex =
    /([\u2700-\u27BF\uE000-\uF8FF\u2011-\u26FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD10-\uDDFF])/g
  const text = children.replace(regex, '')
  return (
    <>
      <span className='animation-hello -mt-12 inline-block text-5xl sm:ml-12 md:text-6xl xl:text-8xl'>
        👋🏻
      </span>
      <Message className='animation-fade-out gap-2 px-4 !animation-delay-[3s] before:absolute before:-left-0.5 before:bottom-0 before:size-4 before:rounded-full before:bg-inherit before:content-["_"] after:absolute after:-bottom-1.5 after:-left-2.5 after:size-2 after:rounded-full after:bg-inherit after:content-["_"]'>
        <MessageLoadingDot />
        <MessageLoadingDot className='animation-delay-[0.666s]' />
        <MessageLoadingDot className='animation-delay-[1.332s]' />
      </Message>
      <Message className='animation-fade-in px-6 font-normal text-white opacity-0 !animation-delay-[3s]'>
        {/* Draw only the tail; its surroundings must reveal the card's gradient. */}
        <svg
          aria-hidden='true'
          viewBox='0 0 24 24'
          className='pointer-events-none absolute -bottom-px -left-2 size-6 fill-[#30db5b]'
        >
          <path d='M8 0H24C24 13.255 13.255 24 0 24C8 20 8 12 8 0Z' />
        </svg>
        {text}
      </Message>
    </>
  )
}

export default Hello
