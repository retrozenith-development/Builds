// API utility functions for fetching ROM data

// Function to get the base URL from localStorage or use default
function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Use jsDelivr CDN which supports CORS instead of direct GitHub raw URLs
    const savedUrl = localStorage.getItem("retrozenith-api-url")
    if (savedUrl) return savedUrl

    // Default URL using jsDelivr CDN
    return "https://cdn.jsdelivr.net/gh/crdroidandroid/android_vendor_crDroidOTA@14.0"
  }
  return "https://cdn.jsdelivr.net/gh/crdroidandroid/android_vendor_crDroidOTA@14.0"
}

// Get the application base URL for assets and links
export function getAppBaseUrl(): string {
  if (typeof window !== "undefined") {
    // When running in the browser, use the current origin
    return window.location.origin
  }
  // Default to the custom domain during build
  return "https://cdn.zenyhosting.cloud"
}

// Interface for ROM data in device-specific JSON files
export interface RomInfo {
  maintainer: string
  oem: string
  device: string
  filename: string
  download: string
  timestamp: number
  md5: string
  sha256: string
  size: number
  version: string
  buildtype: string
  forum: string
  gapps: string
  firmware: string
  modem: string
  bootloader: string
  recovery: string
  paypal: string
  telegram: string
  dt: string
  "common-dt": string
  kernel: string
}

// List of known device codenames to try
// In a real app, this would be more comprehensive or dynamically determined
const knownDevices = [
  "bluejay",
  "oriole",
  "raven"
]

// Cache for device ROM data to prevent repeated fetches
const deviceRomCache = new Map<string, RomInfo | null>()

// Function to fetch ROM data for a specific device
export async function fetchDeviceRom(codename: string): Promise<RomInfo | null> {
  // Check cache first
  if (deviceRomCache.has(codename)) {
    return deviceRomCache.get(codename) || null
  }

  try {
    const baseUrl = getBaseUrl()
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(`${baseUrl}/${codename}.json`, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.warn(`Failed to fetch ROM data for ${codename}: ${response.status}`)
      deviceRomCache.set(codename, null)
      return null
    }

    const data = await response.json()
    const romData = data.response && data.response.length > 0 ? data.response[0] : null

    // Cache the result
    deviceRomCache.set(codename, romData)
    return romData
  } catch (error) {
    console.error(`Error fetching ROM data for ${codename}:`, error)
    deviceRomCache.set(codename, null)
    return null
  }
}

// Cache for all ROMs to prevent repeated fetches
let allRomsCache: RomInfo[] | null = null

// Function to fetch all ROMs by trying known devices
export async function fetchAllRoms(): Promise<RomInfo[]> {
  // Return cached data if available
  if (allRomsCache) {
    return allRomsCache
  }

  try {
    const baseUrl = getBaseUrl()

    // Check if the base URL is valid
    if (!baseUrl) {
      throw new Error("API URL is not configured. Please set it in the settings.")
    }

    // Try to fetch all known devices in parallel
    const romPromises = knownDevices.map((device) => fetchDeviceRom(device))
    const results = await Promise.all(romPromises)

    // Filter out null results (devices that failed to fetch)
    const validRoms = results.filter((rom) => rom !== null) as RomInfo[]

    if (validRoms.length === 0) {
      console.warn("No valid ROMs found from known devices list")
      // If no valid ROMs found, return mock data
      const mockData = getMockRoms()
      allRomsCache = mockData
      return mockData
    }

    // Cache the results
    allRomsCache = validRoms
    return validRoms
  } catch (error) {
    console.error("Error fetching all ROMs:", error)
    // Return mock data for development/fallback
    const mockData = getMockRoms()
    allRomsCache = mockData
    return mockData
  }
}

// Mock data for development and fallback
function getMockRoms(): RomInfo[] {
  return [
    {
      maintainer: "TestaMic",
      oem: "Samsung",
      device: "Galaxy A52",
      filename: "crDroidAndroid-15.0-20250211-a52q-v11.2.zip",
      download:
        "https://sourceforge.net/projects/crdroid/files/a52q/11.x/crDroidAndroid-15.0-20250211-a52q-v11.2.zip/download",
      timestamp: 1739282626,
      md5: "bd6e0af71d3d71c5c68ef5c16f920b14",
      sha256: "e3eb66d8ca21828ab9a5eb4b6918870bb2f1e440fee1f011373dbc169e834137",
      size: 1463290607,
      version: "11.2",
      buildtype: "Monthly",
      forum: "https://xdaforums.com/t/crdroid-11-1-stable-android-15-qpr1-for-a52-4g-a52q-unofficial.4672356/",
      gapps:
        "https://github.com/MindTheGapps/15.0.0-arm64/releases/download/MindTheGapps-15.0.0-arm64-20240928_150548/MindTheGapps-15.0.0-arm64-20240928_150548.zip",
      firmware: "",
      modem: "",
      bootloader: "",
      recovery: "https://sourceforge.net/projects/crdroid/files/a52q/11.x/recovery20251102.tar/download",
      paypal: "https://paypal.me/FilipCojocaru",
      telegram: "https://t.me/testamic2",
      dt: "https://github.com/crdroidandroid/android_device_samsung_a52q",
      "common-dt": "https://github.com/crdroidandroid/android_device_samsung_sm7125-common",
      kernel: "https://github.com/crdroidandroid/android_kernel_samsung_sm7125",
    },
    {
      maintainer: "DevUser",
      oem: "Google",
      device: "Pixel 7",
      filename: "crDroidAndroid-15.0-20250210-pixel7-v11.2.zip",
      download: "https://example.com/download/pixel7.zip",
      timestamp: 1739182626,
      md5: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
      sha256: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      size: 1563290607,
      version: "11.2",
      buildtype: "Stable",
      forum: "https://example.com/pixel7-thread",
      gapps:
        "https://github.com/MindTheGapps/15.0.0-arm64/releases/download/MindTheGapps-15.0.0-arm64-20240928_150548/MindTheGapps-15.0.0-arm64-20240928_150548.zip",
      firmware: "",
      modem: "",
      bootloader: "",
      recovery: "https://example.com/recovery.img",
      paypal: "https://paypal.me/devuser",
      telegram: "https://t.me/devuser",
      dt: "https://github.com/crdroidandroid/android_device_google_pixel7",
      "common-dt": "https://github.com/crdroidandroid/android_device_google_common",
      kernel: "https://github.com/crdroidandroid/android_kernel_google_pixel7",
    },
  ]
}

// Function to customize the base URL (useful for testing or changing sources)
export function setBaseUrl(url: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("retrozenith-api-url", url)
    // Clear caches when URL changes
    deviceRomCache.clear()
    allRomsCache = null
  }
}

// Function to add a custom device to check
export function addCustomDevice(codename: string) {
  if (!knownDevices.includes(codename)) {
    knownDevices.push(codename)
    // In a real app, you might want to save this to localStorage
    localStorage.setItem("retrozenith-custom-devices", JSON.stringify(knownDevices))
    // Clear caches when devices change
    allRomsCache = null
  }
}

// Function to load custom devices from localStorage
export function loadCustomDevices() {
  const savedDevices = localStorage.getItem("retrozenith-custom-devices")
  if (savedDevices) {
    try {
      const devices = JSON.parse(savedDevices)
      // Merge with known devices, avoiding duplicates
      devices.forEach((device: string) => {
        if (!knownDevices.includes(device)) {
          knownDevices.push(device)
        }
      })
    } catch (e) {
      console.error("Error parsing saved devices:", e)
    }
  }
}

// Initialize by loading custom devices
if (typeof window !== "undefined") {
  loadCustomDevices()
}

