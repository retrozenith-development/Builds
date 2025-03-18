import Link from "next/link"
import styles from "./not-found.module.css"

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link href="/" className={styles.homeLink}>
          Return to Home
        </Link>
      </div>
    </div>
  )
}

