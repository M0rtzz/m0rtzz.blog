type PreProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLPreElement>,
  HTMLPreElement
>

export const pre = (props: PreProps) => {
  return (
    <div>
      <pre {...props} />
    </div>
  )
}
