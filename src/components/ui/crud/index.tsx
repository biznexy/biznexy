import React, { createContext, Dispatch, FormEvent, ReactNode, SetStateAction, useContext, useState } from "react"
import CrudTable from "./table"
import { DrawerDialog, DrawerDialogContent, DrawerDialogContentWrapper, DrawerDialogFooter, DrawerDialogHeader, DrawerDialogTitle } from "@/components/ui/drawer-dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import CrudForm from "./form"
import { Plus } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

type CrudType = {
  name: string
  setDialogOpen: (v: boolean) => void
}

const CrudContext = createContext<CrudType | undefined>(undefined)

export function useCrud() {
  const ctx = useContext(CrudContext)
  if (!ctx) throw new Error("useCrud must be used within <Crud>")
  return ctx
}

export type CrudFormType<TData> = {
  method: 'create' | 'update'
  data: TData
}

export type CrudProps<TData, TValue> = {
  name: string
  children: ReactNode
  onCreate: (data: TData, e: FormEvent<HTMLFormElement>) => void
  onEdit: (data: TData, e: FormEvent<HTMLFormElement>) => void
  onDelete: (data: TData) => void
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  formState: [CrudFormType<TData>, Dispatch<SetStateAction<CrudFormType<TData>>>]
  defaultData?: TData
}

export function Crud<TData, TValue>({ name, formState, children, columns, data, onCreate, onEdit, onDelete, defaultData = {} as TData }: CrudProps<TData, TValue>) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteRow, setDeleteRow] = useState<TData | null>(null)
  const [formType, setFormType] = formState
  const [submitting, setSubmitting] = useState(false)

  const onCrudCreate = () => {
    setDialogOpen(true)
    setFormType({ method: 'create', data: defaultData })
  }
  const onCrudEdit = (data: TData) => {
    setDialogOpen(true)
    setFormType({ method: 'update', data })
  }
  const onCrudDelete = (data: TData) => {
    setDeleteRow(data)
    setDeleteDialogOpen(true)
  }
  const Form = React.Children.toArray(children).find((child) => {
    if (React.isValidElement(child) && child.type === CrudForm) {
      return child
    }
  })
  const Content = React.Children.toArray(children).filter((child) => {
    if (React.isValidElement(child) && child.type !== CrudForm) {
      return child
    }
  })
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      if (formType.method === 'update') {
        onEdit(formType.data, e)
      } else {
        onCreate(formType.data, e)
      }
      setSubmitting(false)
      setDialogOpen(false)
    }, 1000)
  }
  return (
    <CrudContext.Provider value={{ name, setDialogOpen }}>
      <div className="flex flex-col gap-2">
        <div className="flex justify-end">
          <Button size="sm" onClick={onCrudCreate}>
            <Plus />
            Add {name}
          </Button>
        </div>
        <CrudTable columns={columns} data={data} onEdit={onCrudEdit} onDelete={onCrudDelete} />
        {Content}
      </div>
      <DrawerDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DrawerDialogContent>
          <form onSubmit={handleSubmit}>
            <DrawerDialogHeader>
              <DrawerDialogTitle>{formType.method === 'update' ? "Edit" : "Add"} {name}</DrawerDialogTitle>
            </DrawerDialogHeader>
            <DrawerDialogContentWrapper>
              <div className="grid gap-4 py-4">
                {Form}
              </div>
            </DrawerDialogContentWrapper>
            <DrawerDialogFooter>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save changes'}
              </Button>
            </DrawerDialogFooter>
          </form>
        </DrawerDialogContent>
      </DrawerDialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {name.toLowerCase()} record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteRow && onDelete?.(deleteRow)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CrudContext.Provider >
  )
}

export { CrudTable, CrudForm }