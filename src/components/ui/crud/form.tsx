"use client"

type CrudFormProps = {
  children: React.ReactNode
} & React.FormHTMLAttributes<HTMLFormElement>

const CrudForm = ({ children, ...props }: CrudFormProps) => {
  return (
    <form {...props}>
      {children}
    </form>
  )
}

export default CrudForm
