"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Sun, Palette } from "lucide-react"
import styles from "./theme-switcher.module.css"

export type ThemeName = "amber" | "green" | "blue" | "purple" | "system"

interface ThemeOption {
  name: ThemeName
  label: string
  icon?: React.ReactNode
}

const themeOptions: ThemeOption[] = [
  { name: "amber", label: "Amber" },
  { name: "green", label: "Green" },
  { name: "blue", label: "Blue" },
  { name: "purple", label: "Purple" },
  { name: "system", label: "System", icon: <Sun className={styles.themeIcon} /> },
]

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>("amber")
  const [isOpen, setIsOpen] = useState(false)

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("retrozenith-theme") as ThemeName
    if (savedTheme) {
      setCurrentTheme(savedTheme)
      document.documentElement.setAttribute("data-theme", savedTheme)
    }
  }, [])

  const changeTheme = (theme: ThemeName) => {
    setCurrentTheme(theme)
    localStorage.setItem("retrozenith-theme", theme)
    document.documentElement.setAttribute("data-theme", theme)
    setIsOpen(false)
  }

  return (
    <div className={styles.themeSwitcher}>
      <button className={styles.themeButton} onClick={() => setIsOpen(!isOpen)} aria-label="Change theme">
        <Palette size={20} />
        <span>Theme</span>
      </button>

      {isOpen && (
        <div className={styles.themeMenu}>
          {themeOptions.map((option) => (
            <button
              key={option.name}
              className={`${styles.themeOption} ${currentTheme === option.name ? styles.active : ""}`}
              onClick={() => changeTheme(option.name)}
            >
              <span className={`${styles.themeColor} ${styles[option.name]}`}></span>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

