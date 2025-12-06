"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { createContext, useContext } from "react"

const DrawerDialogContext = createContext<{ isDesktop: boolean } | null>(null)

export function useDrawerDialog() {
  const ctx = useContext(DrawerDialogContext)
  if (!ctx) throw new Error("useDrawerDialog must be used within <DrawerDialog>")
  return ctx
}

type DrawerDialogProps = {
  open?: boolean
  onOpenChange?: (v: boolean) => void
  children: React.ReactNode
}

export function DrawerDialog({ children, open = false, onOpenChange }: DrawerDialogProps) {
  onOpenChange = onOpenChange || (() => { })
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const Wrapper = isDesktop ? Dialog : Drawer

  return (
    <DrawerDialogContext.Provider value={{ isDesktop }}>
      <Wrapper open={open} onOpenChange={onOpenChange}>
        {children}
      </Wrapper>
    </DrawerDialogContext.Provider>
  )
}

export function DrawerDialogTrigger({ children }: { children: React.ReactNode }) {
  const { isDesktop } = useDrawerDialog()
  const Trigger = isDesktop ? DialogTrigger : DrawerTrigger
  return <Trigger asChild>{children}</Trigger>
}

export function DrawerDialogContent({ children }: { children: React.ReactNode }) {
  const { isDesktop } = useDrawerDialog()
  const Content = isDesktop ? DialogContent : DrawerContent
  return <Content>{children}</Content>
}

export function DrawerDialogContentWrapper({ children }: { children: React.ReactNode }) {
  const { isDesktop } = useDrawerDialog()
  const className = isDesktop ? "" : "px-4"
  return <div className={className}>{children}</div>
}

export function DrawerDialogHeader({ children }: { children: React.ReactNode }) {
  const { isDesktop } = useDrawerDialog()
  const Header = isDesktop ? DialogHeader : DrawerHeader
  return <Header>{children}</Header>
}

export function DrawerDialogTitle({ children }: { children: React.ReactNode }) {
  const { isDesktop } = useDrawerDialog()
  const Title = isDesktop ? DialogTitle : DrawerTitle
  return <Title>{children}</Title>
}

export function DrawerDialogDescription({ children }: { children: React.ReactNode }) {
  const { isDesktop } = useDrawerDialog()
  const Desc = isDesktop ? DialogDescription : DrawerDescription
  return <Desc>{children}</Desc>
}

export function DrawerDialogFooter({ children }: { children: React.ReactNode }) {
  const { isDesktop } = useDrawerDialog()
  if (isDesktop) return children
  const Footer = DrawerFooter
  return (
    <Footer>
      {children}
      <DrawerClose>
        Cancel
      </DrawerClose>
    </Footer>
  )
}