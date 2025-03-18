"use client"

import { useState, useEffect, useMemo } from "react"
import { ThemeSwitcher } from "./theme-switcher"
import { ArrowLeft, Save, RotateCcw, Plus, X } from "lucide-react"
import Link from "next/link"
import styles from "./settings-page.module.css"
import { setBaseUrl, addCustomDevice, getAppBaseUrl } from "@/utils/api"

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState("")
  const [savedUrl, setSavedUrl] = useState("")
  const [isSaved, setIsSaved] = useState(false)
  const [customDevice, setCustomDevice] = useState("")
  const [customDevices, setCustomDevices] = useState<string[]>([])
  const [deviceAdded, setDeviceAdded] = useState(false)
  const defaultUrl = "https://cdn.jsdelivr.net/gh/crdroidandroid/android_vendor_crDroidOTA@15.0"
  const baseUrl = useMemo(() => getAppBaseUrl(), [])

  useEffect(() => {
    // Load saved URL from localStorage
    const savedApiUrl = localStorage.getItem("retrozenith-api-url") || defaultUrl
    setApiUrl(savedApiUrl)
    setSavedUrl(savedApiUrl)

    // Load custom devices
    const savedDevices = localStorage.getItem("retrozenith-custom-devices")
    if (savedDevices) {
      try {
        setCustomDevices(JSON.parse(savedDevices))
      } catch (e) {
        console.error("Error parsing saved devices:", e)
      }
    }
  }, [])

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem("retrozenith-api-url", apiUrl)
    setSavedUrl(apiUrl)
    setBaseUrl(apiUrl)
    setIsSaved(true)

    // Reset the saved indicator after 3 seconds
    setTimeout(() => {
      setIsSaved(false)
    }, 3000)
  }

  const handleReset = () => {
    setApiUrl(defaultUrl)
    localStorage.setItem("retrozenith-api-url", defaultUrl)
    setSavedUrl(defaultUrl)
    setBaseUrl(defaultUrl)
  }

  const handleAddDevice = () => {
    if (customDevice.trim()) {
      addCustomDevice(customDevice.trim())
      setCustomDevices((prev) => {
        if (!prev.includes(customDevice.trim())) {
          const newDevices = [...prev, customDevice.trim()]
          localStorage.setItem("retrozenith-custom-devices", JSON.stringify(newDevices))
          return newDevices
        }
        return prev
      })
      setCustomDevice("")
      setDeviceAdded(true)
      setTimeout(() => setDeviceAdded(false), 3000)
    }
  }

  const handleRemoveDevice = (device: string) => {
    setCustomDevices((prev) => {
      const newDevices = prev.filter((d) => d !== device)
      localStorage.setItem("retrozenith-custom-devices", JSON.stringify(newDevices))
      return newDevices
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.themeSwitcherContainer}>
        <ThemeSwitcher />
      </div>

      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={20} />
          <span>Back to Builds</span>
        </Link>
        <h1>Settings</h1>
        <p>Customize your RetroZenith Builds experience</p>
      </header>

      <main className={styles.main}>
        <div className={styles.settingsCard}>
          <div className={styles.settingsSection}>
            <h2>API Source URL</h2>
            <p>Set the base URL for fetching ROM data</p>

            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Enter API URL"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className={styles.apiInput}
              />
              <button
                className={styles.saveButton}
                onClick={handleSave}
                disabled={!apiUrl.trim() || apiUrl === savedUrl}
              >
                <Save size={18} />
                <span>{isSaved ? "Saved!" : "Save"}</span>
              </button>
              <button className={styles.resetButton} onClick={handleReset}>
                <RotateCcw size={18} />
                <span>Reset</span>
              </button>
            </div>

            <div className={styles.helpText}>
              <p>
                Default URL: <code>{defaultUrl}</code>
              </p>
              <p>This URL should point to a repository containing device JSON files.</p>
              <p className={styles.note}>
                Note: Due to CORS restrictions, direct GitHub raw URLs won't work. Use a CORS-enabled CDN like jsDelivr.
              </p>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.settingsSection}>
            <h2>Custom Devices</h2>
            <p>Add device codenames to check for ROM builds</p>

            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Enter device codename (e.g., a52q)"
                value={customDevice}
                onChange={(e) => setCustomDevice(e.target.value)}
                className={styles.apiInput}
              />
              <button
                className={styles.saveButton}
                onClick={handleAddDevice}
                disabled={!customDevice.trim() || customDevices.includes(customDevice.trim())}
              >
                <Plus size={18} />
                <span>{deviceAdded ? "Added!" : "Add"}</span>
              </button>
            </div>

            {customDevices.length > 0 && (
              <div className={styles.deviceList}>
                <h3>Your Custom Devices:</h3>
                <div className={styles.deviceTags}>
                  {customDevices.map((device) => (
                    <div key={device} className={styles.deviceTag}>
                      <span>{device}</span>
                      <button
                        className={styles.removeDevice}
                        onClick={() => handleRemoveDevice(device)}
                        aria-label={`Remove ${device}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.helpText}>
              <p>Add device codenames to check for ROM builds that aren't in our default list.</p>
              <p>The app will try to fetch ROM data for these devices in addition to the known ones.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 RetroZenith Builds</p>
      </footer>
    </div>
  )
}

