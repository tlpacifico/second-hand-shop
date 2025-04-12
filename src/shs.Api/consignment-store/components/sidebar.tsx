"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart, ClipboardList, Home, Package, Settings, Users } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      icon: Home,
      title: "Dashboard",
    },
    {
      href: "/owners",
      icon: Users,
      title: "Owners",
    },
    {
      href: "/items",
      icon: Package,
      title: "Items",
    },
    {
      href: "/consignments",
      icon: ClipboardList,
      title: "Consignments",
    },
    {
      href: "/reports",
      icon: BarChart,
      title: "Reports",
    },
    {
      href: "/settings",
      icon: Settings,
      title: "Settings",
    },
  ]

  return (
    <div className="flex h-full w-[240px] flex-col border-r">
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                pathname === route.href && "bg-muted text-foreground",
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
