"use client"

type CrudFormProps = {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

const CrudForm = ({ children, ...props }: CrudFormProps) => {
  return (
    <div {...props}>
      {children}
    </div>
  )
}

export default CrudForm
