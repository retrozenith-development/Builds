import SparkMD5 from "spark-md5"

// Function to calculate MD5 of a file using SparkMD5 (browser-compatible)
export async function calculateFileMD5(file: File, onProgress?: (progress: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create a file reader
    const reader = new FileReader()
    const spark = new SparkMD5.ArrayBuffer()

    // Define chunk size (2MB)
    const chunkSize = 2 * 1024 * 1024
    let currentChunk = 0
    const chunks = Math.ceil(file.size / chunkSize)

    // Function to load the next chunk
    const loadNext = () => {
      const start = currentChunk * chunkSize
      const end = Math.min(start + chunkSize, file.size)

      reader.readAsArrayBuffer(file.slice(start, end))
    }

    // Error handler
    reader.onerror = (error) => {
      console.error("Error reading file:", error)
      reject(error)
    }

    // On chunk load
    reader.onload = (e) => {
      if (e.target?.result) {
        // Add chunk to spark
        spark.append(e.target.result as ArrayBuffer)

        currentChunk++

        // Report progress
        if (onProgress) {
          const progress = Math.round((currentChunk / chunks) * 100)
          onProgress(progress)
        }

        if (currentChunk < chunks) {
          // Load next chunk
          loadNext()
        } else {
          // All chunks loaded, return the MD5 hash
          const hash = spark.end()
          resolve(hash)
        }
      }
    }

    // Start loading the first chunk
    loadNext()
  })
}

// Function to check if an MD5 hash matches any in the list
export function checkMD5Match(hash: string, romList: any[]): any | null {
  return romList.find((rom) => rom.md5.toLowerCase() === hash.toLowerCase()) || null
}

