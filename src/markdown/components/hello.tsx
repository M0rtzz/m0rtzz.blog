import { tw } from 'tw-styled'

const Message = tw.span`absolute -top-5 inline-flex h-11 items-center whitespace-nowrap rounded-[1.33rem] bg-[#30db5b] text-xl before:absolute before:content-["_"] after:absolute after:content-["_"] max-sm:scale-90 sm:left-32 md:left-[60%] md:scale-110`

const MessageLoadingDot = tw.i`h-3 w-3 animate-pulse rounded-full bg-gray-50`
const Hello = ({ children }) => {
  const regex =
    /([\u2700-\u27bf]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g
  const text = children.replace(regex, '')
  return (
    <>
      <span className='animation-hello -mt-12 inline-block text-5xl sm:ml-12 md:text-6xl xl:text-8xl'>
        👋
      </span>
      <Message className='animation-fade-out gap-2 px-4 !animation-delay-[3s] before:-left-0.5 before:bottom-0 before:h-4 before:w-4 before:rounded-full before:bg-inherit after:-bottom-1.5 after:-left-2.5 after:h-2 after:w-2 after:rounded-full after:bg-inherit'>
        <MessageLoadingDot />
        <MessageLoadingDot className='animation-delay-[0.666s]' />
        <MessageLoadingDot className='animation-delay-[1.332s]' />
      </Message>
      <Message className='animation-fade-in px-6 font-normal text-white opacity-0 !animation-delay-[3s] before:-bottom-px before:-left-2 before:block before:h-6 before:w-6 before:rounded-br-3xl before:bg-[#30db5b] after:-bottom-px after:-left-3 after:h-6 after:w-3 after:rounded-br-2xl after:bg-white dark:after:bg-surface-1'>
        {text}
      </Message>
    </>
  )
}

export default Hello
