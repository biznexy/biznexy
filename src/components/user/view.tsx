"use client"

import { useCurrentUser } from "@/context/CurrentUserContext"

export default function UserView({ children }: { children: React.ReactNode }) {
  const { isLoading, currentUser } = useCurrentUser()

  if (isLoading || !currentUser) {
    return null
  }

  return children
}