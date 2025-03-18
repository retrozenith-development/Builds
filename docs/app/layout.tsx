import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import ThemeInitializer from "./theme-init"

export const metadata: Metadata = {
  title: "RetroZenith Builds - Beautiful Android ROMs",
  description: "Download custom Android ROMs with beautiful Monet themes for your device",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeInitializer />
        {children}
      </body>
    </html>
  )
}



import './globals.css'