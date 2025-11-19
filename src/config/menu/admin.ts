import { Menu } from "@/types/menu"
import { Image, LayoutDashboard, Users, MessageSquare, Shield } from "lucide-react"

export const defaultMenu: Menu = {
  title: "General",
  baseUrl: "/admin",
  items: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      url: "/users/",
      icon: Users,
    },
    {
      title: "Roles",
      url: "/roles/",
      icon: Shield,
    },
    {
      title: "Images",
      url: "/images/",
      icon: Image,
    }
  ]
}

const aiMenu: Menu = {
  title: "AI",
  baseUrl: "/admin/ai",
  items: [
    {
      title: "Chat",
      url: "/chat",
      icon: MessageSquare,
    }
  ]
}

export const menus: Menu[] = [
  defaultMenu,
  aiMenu,
]
