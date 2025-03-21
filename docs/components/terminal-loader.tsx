import type React from "react"
import styles from "./terminal-loader.module.css"

interface TerminalLoaderProps {
  text?: string
  className?: string
}

const TerminalLoader: React.FC<TerminalLoaderProps> = ({ text = "Loading...", className = "" }) => {
  return (
    <div className={`${styles.terminalLoader} ${className}`}>
      <div className={styles.terminalHeader}>
        <div className={styles.terminalTitle}>Status</div>
        <div className={styles.terminalControls}>
          <div className={`${styles.control} ${styles.close}`} />
          <div className={`${styles.control} ${styles.minimize}`} />
          <div className={`${styles.control} ${styles.maximize}`} />
        </div>
      </div>
      <div className={styles.text}>{text}</div>
    </div>
  )
}

export default TerminalLoader

