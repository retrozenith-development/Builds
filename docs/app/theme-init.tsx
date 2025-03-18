"use client"

import { useEffect } from "react"

export default function ThemeInitializer() {
  useEffect(() => {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem("retrozenith-theme")

    // Apply the saved theme or default to 'amber'
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme)
    } else {
      document.documentElement.setAttribute("data-theme", "amber")
    }
  }, [])

  return null
}

