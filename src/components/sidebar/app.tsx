"use client"

import SidebarNav from "@/components/sidebar/nav"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { menus } from "@/config/menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { ComponentProps } from "react"

export default function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="sticky top-(--header-height) h-[calc(100svh-var(--header-height))]!" collapsible="icon" {...props}>
      <SidebarContent>
        <Accordion type="single" collapsible defaultValue="0">
          {menus.map((menu, index) => (
            <AccordionItem key={index} value={index.toString()}>
              <SidebarGroup>
                {menus.length === 1 && (
                  <SidebarNav baseUrl={menu.baseUrl} items={menu.items} />
                )}
                {menus.length > 1 && (
                  <>
                    <AccordionTrigger className="py-1">
                      <SidebarGroupLabel className="h-4">
                        {menu.title}
                      </SidebarGroupLabel>
                    </AccordionTrigger>
                    <AccordionContent asChild>
                      <SidebarNav baseUrl={menu.baseUrl} items={menu.items} />
                    </AccordionContent>
                  </>
                )}
              </SidebarGroup>
            </AccordionItem>
          ))}
        </Accordion>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Toggle Sidebar" asChild>
              <SidebarTrigger mobileIcon="X" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
