"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { ThemeSwitcher } from "./theme-switcher"
import { ArrowLeft, FileCheck, AlertTriangle, Upload, Copy, Check, Settings, AlertCircle } from "lucide-react"
import Link from "next/link"
import styles from "./verify-page.module.css"
import { calculateFileMD5 } from "@/utils/md5"
import { fetchAllRoms, type RomInfo, getAppBaseUrl } from "@/utils/api"

interface VerifyPageProps {
  initialMd5: string | null
  initialDevice: string | null
}

export default function VerifyPage({ initialMd5, initialDevice }: VerifyPageProps) {
  const [roms, setRoms] = useState<RomInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [md5Input, setMd5Input] = useState(initialMd5 || "")
  const [calculatedMd5, setCalculatedMd5] = useState("")
  const [fileName, setFileName] = useState("")
  const [fileSize, setFileSize] = useState(0)
  const [isCalculating, setIsCalculating] = useState(false)
  const [calculationProgress, setCalculationProgress] = useState(0)
  const [matchResult, setMatchResult] = useState<{
    matches: boolean
    rom?: RomInfo
  } | null>(null)
  const [copied, setCopied] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isMounted = useRef(true)
  const [contentReady, setContentReady] = useState(false)
  const dataFetchedRef = useRef(false)
  const baseUrl = useMemo(() => getAppBaseUrl(), [])

  // Memoize the checkForMatches function to prevent recreating it on every render
  const checkForMatches = useCallback((md5: string, romsList: RomInfo[]) => {
    const matchingRom = romsList.find((rom) => rom.md5.toLowerCase() === md5.toLowerCase())

    setMatchResult({
      matches: !!matchingRom,
      rom: matchingRom,
    })
  }, [])

  useEffect(() => {
    // Set up the cleanup function to prevent state updates after unmount
    return () => {
      isMounted.current = false
    }
  }, [])

  // Load data only once when component mounts
  useEffect(() => {
    // Skip if we've already fetched data
    if (dataFetchedRef.current) return
    dataFetchedRef.current = true

    async function loadRoms() {
      try {
        // Keep loading state true for at least 500ms to prevent flickering
        const loadingStartTime = Date.now()

        const data = await fetchAllRoms()

        // Only update state if component is still mounted
        if (!isMounted.current) return

        setRoms(data)
        setError(null)

        // Check if there's an MD5 in the URL params
        if (initialMd5) {
          setMd5Input(initialMd5)
          checkForMatches(initialMd5, data)
        }

        // Ensure loading state shows for at least 500ms to prevent flickering
        const loadingElapsed = Date.now() - loadingStartTime
        if (loadingElapsed < 500) {
          setTimeout(() => {
            if (isMounted.current) {
              setLoading(false)
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
        setContentReady(true)
      }
    }

    loadRoms()
  }, [initialMd5, checkForMatches]) // Include initialMd5 in dependencies

  // Function to calculate MD5 hash of a file
  const calculateMD5 = useCallback(
    async (file: File) => {
      setIsCalculating(true)
      setCalculationProgress(0)
      setFileName(file.name)
      setFileSize(file.size)
      setFileError(null)

      try {
        // Check file size and warn if it's very large
        if (file.size > 1024 * 1024 * 1024) {
          // 1GB
          console.warn("Very large file detected. This may take some time:", file.size)
        }

        const hash = await calculateFileMD5(file)

        // Only update state if component is still mounted
        if (!isMounted.current) return

        setCalculatedMd5(hash)
        setIsCalculating(false)
        setCalculationProgress(100)

        // Check for matches
        checkForMatches(hash, roms)
      } catch (error) {
        console.error("Error calculating hash:", error)

        // Only update state if component is still mounted
        if (!isMounted.current) return

        setIsCalculating(false)
        setCalculationProgress(0)

        // Check if it's an out of memory error
        if (
          error instanceof Error &&
          (error.message.includes("out of memory") ||
            error.message.includes("OOM") ||
            error.message.includes("allocation failed"))
        ) {
          setFileError(
            "Out of Memory error: The file is too large to process in the browser. Please try using the manual verification method with the MD5 hash instead.",
          )
        } else {
          setFileError(`Failed to calculate hash: ${error instanceof Error ? error.message : "Unknown error"}`)
        }
      }
    },
    [roms, checkForMatches],
  )

  // Function to handle file input change
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        calculateMD5(file)
      }
    },
    [calculateMD5],
  )

  // Function to handle drag and drop
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const file = event.dataTransfer.files?.[0]
      if (file) {
        calculateMD5(file)
      }
    },
    [calculateMD5],
  )

  // Prevent default behavior for drag events
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  // Function to handle manual MD5 input
  const handleManualVerify = useCallback(() => {
    if (md5Input.trim().length > 0) {
      checkForMatches(md5Input.trim(), roms)
    }
  }, [md5Input, roms, checkForMatches])

  // Function to copy MD5 to clipboard
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => {
        if (isMounted.current) {
          setCopied(false)
        }
      }, 2000)
    })
  }, [])

  // Function to trigger file input click
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }, [])

  // Common page shell that's consistent across loading/error/content states
  const PageShell = useCallback(
    ({ children }: { children: React.ReactNode }) => (
      <div className={styles.container}>
        <div className={styles.themeSwitcherContainer}>
          <ThemeSwitcher />
        </div>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={20} />
            <span>Back to Builds</span>
          </Link>
          <h1>Verify File Integrity</h1>
          <p>Check if your downloaded ROM file matches the official build</p>
        </header>
        {children}
        <footer className={styles.footer}>
          <p>© 2025 RetroZenith Builds</p>
        </footer>
      </div>
    ),
    [],
  )

  if (loading) {
    return (
      <PageShell>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading ROM information...</p>
        </div>
      </PageShell>
    )
  }

  if (error) {
    return (
      <PageShell>
        <div className={styles.errorContainer}>
          <AlertTriangle size={48} className={styles.errorIcon} />
          <p>{error}</p>
          <Link href="/settings/" className={styles.settingsLink}>
            <Settings size={18} />
            <span>Go to Settings</span>
          </Link>
        </div>
      </PageShell>
    )
  }

  // Apply a CSS class to fade in the content when it's ready
  const contentClass = contentReady ? styles.contentVisible : styles.contentHidden

  return (
    <PageShell>
      <main className={`${styles.main} ${contentClass}`}>
        <div className={styles.verifyCard}>
          <div className={styles.verifySection}>
            <h2>Upload File</h2>
            <p>Upload your ROM file to automatically calculate its MD5 hash</p>

            <div className={styles.dropZone} onDrop={handleDrop} onDragOver={handleDragOver} onClick={triggerFileInput}>
              <Upload size={48} className={styles.uploadIcon} />
              <p>Drag & drop your file here or click to browse</p>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
            </div>

            {isCalculating && (
              <div className={styles.calculating}>
                <div className={styles.spinner}></div>
                <p>Calculating MD5 hash...</p>
                {fileSize > 500 * 1024 * 1024 && (
                  <p className={styles.largeFileWarning}>
                    Large file detected ({formatFileSize(fileSize)}). This may take some time.
                  </p>
                )}
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar} style={{ width: `${calculationProgress}%` }}></div>
                </div>
              </div>
            )}

            {fileError && (
              <div className={styles.fileError}>
                <AlertCircle size={20} />
                <p>{fileError}</p>
              </div>
            )}

            {calculatedMd5 && !isCalculating && (
              <div className={styles.hashResult}>
                <h3>File Details</h3>
                <div className={styles.fileInfo}>
                  <p>
                    <strong>Name:</strong> {fileName}
                  </p>
                  <p>
                    <strong>Size:</strong> {formatFileSize(fileSize)}
                  </p>
                </div>
                <div className={styles.hashDisplay}>
                  <p>
                    <strong>MD5:</strong> {calculatedMd5}
                  </p>
                  <button
                    className={styles.copyButton}
                    onClick={() => copyToClipboard(calculatedMd5)}
                    aria-label="Copy MD5 hash"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.divider}></div>

          <div className={styles.verifySection}>
            <h2>Manual Verification</h2>
            <p>Enter the MD5 hash to check against our database</p>

            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Enter MD5 hash (e.g., bd6e0af71d3d71c5c68ef5c16f920b14)"
                value={md5Input}
                onChange={(e) => setMd5Input(e.target.value)}
                className={styles.md5Input}
              />
              <button
                className={styles.verifyButton}
                onClick={handleManualVerify}
                disabled={md5Input.trim().length === 0}
              >
                Verify
              </button>
            </div>

            {fileError && (
              <div className={styles.manualVerifyTip}>
                <p>
                  <strong>Tip:</strong> For large files, you can calculate the MD5 hash using external tools:
                </p>
                <div className={styles.commandExamples}>
                  <div>
                    <strong>Windows (PowerShell):</strong>
                    <pre>Get-FileHash -Algorithm MD5 -Path "path\to\file.zip"</pre>
                  </div>
                  <div>
                    <strong>macOS/Linux:</strong>
                    <pre>md5sum path/to/file.zip</pre>
                  </div>
                </div>
              </div>
            )}
          </div>

          {matchResult && (
            <div className={`${styles.matchResult} ${matchResult.matches ? styles.matchSuccess : styles.matchError}`}>
              {matchResult.matches ? (
                <>
                  <FileCheck size={24} />
                  <div>
                    <h3>Match Found!</h3>
                    <p>The MD5 hash matches the following ROM:</p>
                    <p>
                      <strong>
                        {matchResult.rom?.oem} {matchResult.rom?.device}
                      </strong>{" "}
                      - {matchResult.rom?.filename}
                    </p>
                    <p>
                      Version: {matchResult.rom?.version} ({matchResult.rom?.buildtype})
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle size={24} />
                  <div>
                    <h3>No Match Found</h3>
                    <p>The MD5 hash does not match any of our official builds.</p>
                    <p>Please double-check your download or try downloading the file again.</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className={styles.availableHashes}>
          <h2>Available ROM Hashes</h2>
          <p>Reference list of official ROM builds and their MD5 hashes</p>

          <div className={styles.hashesTable}>
            <div className={styles.tableHeader}>
              <div>Device</div>
              <div>Filename</div>
              <div>MD5 Hash</div>
            </div>
            {roms.map((rom, index) => (
              <div key={index} className={styles.tableRow}>
                <div>
                  {rom.oem} {rom.device}
                </div>
                <div className={styles.filename}>{rom.filename}</div>
                <div className={styles.hashCell}>
                  <span>{rom.md5}</span>
                  <button
                    className={styles.copyButton}
                    onClick={() => copyToClipboard(rom.md5)}
                    aria-label="Copy MD5 hash"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </PageShell>
  )
}

