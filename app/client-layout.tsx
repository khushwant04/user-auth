"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { NextAuthProvider } from "@/components/next-auth-provider"
import { SiteHeader } from "@/components/site-header"
import { usePathname } from "next/navigation"

function HeaderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ClientHeader />
      <div className="flex-1">{children}</div>
    </>
  )
}

function ClientHeader() {
  const pathname = usePathname()

  // Don't show header on the home page
  if (pathname === "/") {
    return null
  }

  return <SiteHeader />
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <NextAuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <div className="relative flex min-h-screen flex-col">
          <HeaderWrapper>{children}</HeaderWrapper>
        </div>
        <Toaster position="top-right" />
      </ThemeProvider>
    </NextAuthProvider>
  )
}

