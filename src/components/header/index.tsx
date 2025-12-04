import Link from "next/link";
import HeaderAccountMenu from "./account-menu";
import { SidebarTrigger } from "../ui/sidebar";
import LogotypeSvg from "../logotype/svg";
import Logomark from "../logomark";
import { cn } from "@/lib/utils";

export default function Header({
  hasSidebar = false,
  className,
  ...props
}: React.ComponentProps<"header"> & {
  hasSidebar?: boolean,
}) {
  return (
    <header className={cn("sticky top-0 z-50 flex w-full h-16 bg-background shrink-0 items-center gap-4 px-2 md:px-4 lg:px-6 border-b transition-[width,height] ease-linear", className)} {...props}>
      {hasSidebar && <SidebarTrigger className="text-muted-foreground size-5 [&_svg:not([class*='size-'])]:size-5" mobileIcon="Menu" mobileOnly={true} />}
      <Link href="/" className="flex gap-2">
        <Logomark className="!size-6" background="default" />
        <LogotypeSvg className="h-6" />
      </Link>
      <div className='grow'></div>
      <HeaderAccountMenu />
    </header>
  )
}
