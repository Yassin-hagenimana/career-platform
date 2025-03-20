/**
 * Environment variables utility functions
 */

export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Browser should use relative path
    return ""
  }

  if (process.env.VERCEL_URL) {
    // Reference for vercel.com
    return `https://${process.env.VERCEL_URL}`
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    // Use the environment variable
    return process.env.NEXT_PUBLIC_APP_URL
  }

  // Fallback to localhost
  return "http://localhost:3000"
}

export const getApiUrl = (path: string) => {
  return `${getBaseUrl()}/api${path}`
}

