// API utility functions for fetching ROM data

// Function to get the base URL from localStorage or use default
function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Use jsDelivr CDN which supports CORS instead of direct GitHub raw URLs
    const savedUrl = localStorage.getItem("retrozenith-api-url")
    if (savedUrl) return savedUrl

    // Default URL using jsDelivr CDN
    return "https://cdn.jsdelivr.net/gh/retrozenith-development/Builds@main/data"
  }
  return "https://cdn.jsdelivr.net/gh/retrozenith-development/Builds@main/data"
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
  return []
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

