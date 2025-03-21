"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import styles from "./rom-download-page.module.css"
import { Download, Github, MessageCircle, CreditCard, FileCheck, Settings, RefreshCw, Smartphone } from "lucide-react"
import { ThemeSwitcher } from "./theme-switcher"
import Link from "next/link"
import { fetchAllRoms, type RomInfo, getAppBaseUrl } from "@/utils/api"
// Add import for the TerminalLoader component
import TerminalLoader from "./terminal-loader"

export default function RomDownloadPage() {
  const [roms, setRoms] = useState<RomInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const isMounted = useRef(true)
  const [contentReady, setContentReady] = useState(false)
  const initialLoadRef = useRef(true)
  const baseUrl = useMemo(() => getAppBaseUrl(), [])

  useEffect(() => {
    // Set up the cleanup function to prevent state updates after unmount
    return () => {
      isMounted.current = false
    }
  }, [])

  const loadRoms = async () => {
    try {
      setLoading(true)
      setContentReady(false)

      // Keep loading state true for at least 500ms to prevent flickering
      const loadingStartTime = Date.now()

      const data = await fetchAllRoms()

      // Only update state if component is still mounted
      if (!isMounted.current) return

      setRoms(data)
      setError(null)

      // Ensure loading state shows for at least 500ms to prevent flickering
      const loadingElapsed = Date.now() - loadingStartTime
      if (loadingElapsed < 500) {
        setTimeout(() => {
          if (isMounted.current) {
            setLoading(false)
            setRefreshing(false)
            // Add a small delay before showing content to ensure smooth transition
            setTimeout(() => {
              if (isMounted.current) {
                setContentReady(true)
              }
            }, 50)
          }
        }, 500 - loadingElapsed)
      } else {
        setLoading(false)
        setRefreshing(false)
        // Add a small delay before showing content to ensure smooth transition
        setTimeout(() => {
          if (isMounted.current) {
            setContentReady(true)
          }
        }, 50)
      }
    } catch (err) {
      console.error("Failed to load ROMs:", err)

      // Only update state if component is still mounted
      if (!isMounted.current) return

      // Show a more helpful error message
      if (err instanceof Error) {
        setError(
          `Failed to load ROM data: ${err.message}. Please check your internet connection or try changing the API URL in settings.`,
        )
      } else {
        setError(
          "Failed to load ROM data. Please check your internet connection or try changing the API URL in settings.",
        )
      }

      setLoading(false)
      setRefreshing(false)
      setContentReady(true)
    }
  }

  useEffect(() => {
    // Only run this effect once on initial mount
    if (initialLoadRef.current) {
      initialLoadRef.current = false
      loadRoms()
    }
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    loadRoms()
  }

  function formatFileSize(bytes: number): string {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    if (bytes === 0) return "0 Byte"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  function formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Common page shell that's consistent across loading/error/content states
  const PageShell = ({ children }: { children: React.ReactNode }) => (
    <div className={styles.container}>
      <div className={styles.themeSwitcherContainer}>
        <ThemeSwitcher />
      </div>
      <header className={styles.header}>
        <h1>RetroZenith Builds</h1>
        <p>
          Make your phone <span className="gradient-text">colorful</span>
        </p>
        <p>Beautiful custom Android ROM builds for your devices</p>
      </header>
      {children}
      <footer className={styles.footer}>
        <p>© 2025 RetroZenith Builds</p>
      </footer>
    </div>
  )

  if (loading) {
    return (
      <PageShell>
        <div className={styles.loadingContainer}>
          <TerminalLoader text="Loading ROMs..." />
        </div>
      </PageShell>
    )
  }

  if (error) {
    return (
      <PageShell>
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <div className={styles.errorActions}>
            <button className={styles.refreshButton} onClick={handleRefresh}>
              <RefreshCw size={18} />
              <span>Try Again</span>
            </button>
            <Link href="/settings" className={styles.settingsLink}>
              <Settings size={18} />
              <span>Go to Settings</span>
            </Link>
          </div>
        </div>
      </PageShell>
    )
  }

  // Apply a CSS class to fade in the content when it's ready
  const contentClass = contentReady ? styles.contentVisible : styles.contentHidden

  return (
    <PageShell>
      <div className={styles.headerLinks}>
        <Link href="/verify/" className={styles.verifyLink}>
          <FileCheck size={18} />
          <span>Verify File Integrity</span>
        </Link>

        <Link href="/install/gs101/" className={styles.verifyLink}>
          <Smartphone size={18} />
          <span>Installation Guide</span>
        </Link>

        <Link href="/settings/" className={styles.settingsLink}>
          <Settings size={18} />
          <span>Settings</span>
        </Link>

        <button
          className={`${styles.refreshLink} ${refreshing ? styles.refreshing : ""}`}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={18} />
          <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      <main className={`${styles.main} ${contentClass}`}>
        {roms.length === 0 ? (
          <div className={styles.noRoms}>
            <p>No ROM builds available at this time.</p>
            <p>Try adding custom device codenames in the settings.</p>
          </div>
        ) : (
          roms.map((rom, index) => (
            <div key={index} className={styles.romCard}>
              <div className={styles.romHeader}>
                <h2>
                  {rom.oem} {rom.device}
                </h2>
                <div className={styles.romVersion}>
                  <span className={styles.versionTag}>v{rom.version}</span>
                  <span className={styles.buildType}>{rom.buildtype}</span>
                </div>
              </div>

              <div className={styles.romInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Maintainer:</span>
                  <span>{rom.maintainer}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Build Date:</span>
                  <span>{formatDate(rom.timestamp)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>File Size:</span>
                  <span>{formatFileSize(rom.size)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>MD5:</span>
                  <span className={styles.hash}>{rom.md5}</span>
                </div>
              </div>

              <div className={styles.downloadSection}>
                <h3>Downloads</h3>
                <div className={styles.downloadButtons}>
                  <a href={rom.download} className={`${styles.downloadButton} ${styles.romButton}`}>
                    <Download size={18} />
                    <span>ROM</span>
                  </a>
                  {rom.gapps && (
                    <a href={rom.gapps} className={`${styles.downloadButton} ${styles.gappsButton}`}>
                      <Download size={18} />
                      <span>GApps</span>
                    </a>
                  )}
                  {rom.recovery && (
                    <a href={rom.recovery} className={`${styles.downloadButton} ${styles.recoveryButton}`}>
                      <Download size={18} />
                      <span>Recovery</span>
                    </a>
                  )}
                </div>
              </div>

              <div className={styles.linksSection}>
                <h3>Links</h3>
                <div className={styles.linkButtons}>
                  {rom.forum && (
                    <a href={rom.forum} className={styles.linkButton} target="_blank" rel="noopener noreferrer">
                      <MessageCircle size={18} />
                      <span>XDA Forum</span>
                    </a>
                  )}
                  {rom.telegram && (
                    <a
                      href={`https://${rom.telegram}`}
                      className={styles.linkButton}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle size={18} />
                      <span>Telegram</span>
                    </a>
                  )}
                  {rom.dt && (
                    <a href={rom.dt} className={styles.linkButton} target="_blank" rel="noopener noreferrer">
                      <Github size={18} />
                      <span>Device Tree</span>
                    </a>
                  )}
                  {rom.kernel && (
                    <a href={rom.kernel} className={styles.linkButton} target="_blank" rel="noopener noreferrer">
                      <Github size={18} />
                      <span>Kernel</span>
                    </a>
                  )}
                  {rom.paypal && (
                    <a href={rom.paypal} className={styles.linkButton} target="_blank" rel="noopener noreferrer">
                      <CreditCard size={18} />
                      <span>Donate</span>
                    </a>
                  )}
                  <Link
                    href={`/verify/?md5=${rom.md5}&device=${rom.device}`}
                    className={styles.linkButton}
                    prefetch={false}
                  >
                    <FileCheck size={18} />
                    <span>Verify Integrity</span>
                  </Link>
                  {/* Add installation guide link */}
                  {rom.device.includes("oriole") || rom.device.includes("raven") || rom.device.includes("bluejay") ? (
                    <Link href="/install/gs101/" className={styles.linkButton} prefetch={false}>
                      <Smartphone size={18} />
                      <span>Installation Guide</span>
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </PageShell>
  )
}

