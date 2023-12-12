"use client"

import {
  Cloud,
  Gift,
  Github,
  LifeBuoy,
  Search,
  LogOut,
  ScrollText,
  Plus,
  Settings,
  User,
  Users,
} from "lucide-react"
import * as userClient from "@/lib/users/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "./ui/use-toast"
import Link from "next/link"
import axios from "axios";
import { useUser } from "./user-provider"

export function QuickLinks() {
  const { setUserState } = useUser()

  const logout = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      setUserState(null);
      toast({
        title: "Successfully Logged Out",
        description: "Come back soon!"
      })
    } catch(error: any) {
      toast({
        title: "Logout failed",
        description: `Something went wrong with your logout: ${error}`
      })
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">Quick Links</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href="/settings">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuLabel>Explore</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/groups">
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              <span>All Groups</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Gift className="mr-2 h-4 w-4" />
              <span>Gifts</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Search className="mr-2 h-4 w-4" />
                  <span>Explore Gifts</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ScrollText className="mr-2 h-4 w-4" />
                  <span>Wishlist</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        <DropdownMenuLabel>Platform</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link href="https://github.com/ben-mallett/secret-shmanta">
          <DropdownMenuItem>
            <Github className="mr-2 h-4 w-4" />
            <span>GitHub</span>
          </DropdownMenuItem>
        </Link>
        <Link href="https://dummyjson.com/docs/products">
          <DropdownMenuItem>
            <Cloud className="mr-2 h-4 w-4" />
            <span>Product API</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <Link href="/" onClick={logout}><span>Log out</span></Link>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}