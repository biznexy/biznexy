import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
};

export default function UserAvatar({
  user,
  className,
}: {
  user: UserAvatarProps | null | undefined
  className?: string
}) {
  if (!user) return null

  const initials = (user.displayName || user.email || "U").slice(0, 2).toUpperCase()
  return (
    <Avatar className={cn("h-8 w-8 rounded-full", className)}>
      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || undefined} />
      <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
    </Avatar>
  )
}
