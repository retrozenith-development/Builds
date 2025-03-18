import VerifyPage from "@/components/verify-page"
import { Suspense } from "react"

export default function Verify() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPage />
    </Suspense>
  )
}

