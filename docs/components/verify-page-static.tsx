import { ThemeSwitcher } from "./theme-switcher"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import styles from "./verify-page.module.css"
import TerminalLoader from "./terminal-loader"

interface VerifyPageStaticProps {
  isLoading?: boolean
}

export default function VerifyPageStatic({ isLoading = false }: VerifyPageStaticProps) {
  return (
    <div className={styles.container} style={{ display: "block" }}>
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

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <TerminalLoader text="Loading tools..." />
        </div>
      ) : null}

      <footer className={styles.footer}>
        <p>© 2025 RetroZenith Builds</p>
      </footer>
    </div>
  )
}

