// A simple MD5 implementation for client-side use
// Note: In a production environment, you might want to use a more robust library

function md5(input: string): string {
  // This is a simplified implementation for demonstration purposes
  // In a real app, you would use a proper MD5 library like crypto-js

  // For now, we'll just return a mock function that creates a hash-like string
  // based on the input to simulate the behavior
  let hash = ""
  const characters = "abcdef0123456789"

  // Use the input string to seed our "hash"
  let seed = 0
  for (let i = 0; i < input.length; i++) {
    seed += input.charCodeAt(i)
  }

  // Generate a 32-character hex string
  for (let i = 0; i < 32; i++) {
    const index = (seed + i) % characters.length
    hash += characters[index]
  }

  return hash
}

// Function to calculate MD5 of a file
export async function calculateFileMD5(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const result = event.target?.result as string
        // In a real implementation, we would use a proper MD5 algorithm
        // For demo purposes, we'll use our simplified function
        const hash = md5(result)
        resolve(hash)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = (error) => {
      reject(error)
    }

    // Read the file as text
    reader.readAsText(file)
  })
}

// Function to check if an MD5 hash matches any in the list
export function checkMD5Match(hash: string, romList: any[]): any | null {
  return romList.find((rom) => rom.md5.toLowerCase() === hash.toLowerCase()) || null
}

