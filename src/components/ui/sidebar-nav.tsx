"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Link from "next/link"

const sidebarNavItems = [
    {
      title: "Profile",
      href: "/settings",
      roles: ["PARTICIPANT", "HOST", "ADMIN"]
    },
    {
      title: "Account",
      href: "/settings/account",
      roles: ["PARTICIPANT", "HOST", "ADMIN"]
    },
    {
      title: "Gifts",
      href: "/settings/gifts",
      roles: ["PARTICIPANT", "HOST", "ADMIN"]
    },
    {
      title: "Groups",
      href: "/settings/groups",
      roles: ["HOST", "ADMIN"]
    },
    {
      title: "Users",
      href: "/settings/users",
      roles: ["ADMIN"]
    },
]

type SidebarNavProps = {
    userRole: string | null;
}

export function SidebarNav({ userRole, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className="flex m-10 md:w-1/6 space-x-2 md:flex-col lg:space-x-0 lg:space-y-1"
    >
        <div></div>
        {sidebarNavItems.map((item: any, i: number) => {
            return item.roles.includes(`${userRole}`) ? (
                <Link
                key={i}
                href={item.href}
                className={`${pathname === item.href
                    ? "bg-muted hover:bg-muted"
                    : "hover:bg-transparent hover:underline"} rounded-md`}
            >
                <Button variant={(pathname === item.href) ? "secondary" : "ghost"} className="w-full justify-start rounded-md">{item.title}</Button>
         </Link> ) : (<div key={i}></div>)
      })}
    </nav>
  )
}