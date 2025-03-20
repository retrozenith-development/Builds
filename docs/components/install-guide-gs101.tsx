"use client"

import { useState } from "react"
import { ThemeSwitcher } from "./theme-switcher"
import { ArrowLeft, AlertTriangle, CheckCircle, Terminal, Smartphone, Download, Shield } from "lucide-react"
import Link from "next/link"
import styles from "./install-guide.module.css"

export default function InstallGuideGS101() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    prerequisites: true,
    bootloader: false,
    recovery: false,
    installation: false,
    postinstall: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className={styles.container}>
      <div className={styles.themeSwitcherContainer}>
        <ThemeSwitcher />
      </div>

      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={20} />
          <span>Back to Builds</span>
        </Link>
        <h1>crDroid Installation Guide</h1>
        <h2>Google Pixel GS101 Series Devices</h2>
        <p>Pixel 6, Pixel 6 Pro, Pixel 6a</p>
      </header>

      <main className={styles.main}>
        <div className={styles.warning}>
          <AlertTriangle size={24} />
          <div>
            <h3>Warning</h3>
            <p>
              These instructions will erase all user data on your device. Make sure to back up important data before
              proceeding.
            </p>
          </div>
        </div>

        {/* Prerequisites Section */}
        <section className={styles.guideSection}>
          <div className={styles.sectionHeader} onClick={() => toggleSection("prerequisites")}>
            <h2>
              <CheckCircle size={24} />
              Prerequisites
            </h2>
            <span className={expandedSections.prerequisites ? styles.arrowDown : styles.arrowRight}>▼</span>
          </div>
          {expandedSections.prerequisites && (
            <div className={styles.sectionContent}>
              <p>Before beginning the installation process, ensure you have the following:</p>

              <h3>Required Items</h3>
              <ul>
                <li>A compatible GS101 device (Pixel 6, 6 Pro, 6a)</li>
                <li>A USB data cable compatible with your device</li>
                <li>A computer with ADB and Fastboot installed</li>
                <li>At least 80% battery charge on your device</li>
                <li>A complete backup of your device</li>
              </ul>

              <h3>Installing ADB and Fastboot</h3>
              <p>You need to have ADB and Fastboot tools installed on your computer.</p>

              <div className={styles.codeBlock}>
                <h4>For Windows:</h4>
                <ol>
                  <li>
                    Download the{" "}
                    <a
                      href="https://developer.android.com/studio/releases/platform-tools"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Android Platform Tools
                    </a>{" "}
                    from Google.
                  </li>
                  <li>Extract the ZIP file to a folder on your computer (e.g., C:\platform-tools).</li>
                  <li>Add the platform-tools folder to your PATH environment variable.</li>
                </ol>

                <h4>For macOS:</h4>
                <pre>brew install android-platform-tools</pre>

                <h4>For Linux:</h4>
                <pre>sudo apt install adb fastboot</pre>
              </div>

              <h3>Enable Developer Options</h3>
              <ol>
                <li>
                  Go to <strong>Settings</strong> {">"} <strong>About phone</strong>.
                </li>
                <li>
                  Tap <strong>Build number</strong> seven times to enable Developer Options.
                </li>
                <li>
                  Go back to <strong>Settings</strong> {">"} <strong>System</strong> {">"}{" "}
                  <strong>Developer options</strong>.
                </li>
                <li>
                  Enable <strong>USB debugging</strong> and <strong>OEM unlocking</strong>.
                </li>
              </ol>

              <h3>Download Required Files</h3>
              <ul>
                <li>
                  <strong>crDroid ROM:</strong> Download the latest version for your specific device from the{" "}
                  <Link href="/">crDroid downloads page</Link>.
                </li>
                <li>
                  <strong>Google Apps (optional):</strong> If not included in the ROM, download the appropriate GApps
                  package.
                </li>
              </ul>
            </div>
          )}
        </section>

        {/* Bootloader Unlocking Section */}
        <section className={styles.guideSection}>
          <div className={styles.sectionHeader} onClick={() => toggleSection("bootloader")}>
            <h2>
              <Shield size={24} />
              Unlocking the Bootloader
            </h2>
            <span className={expandedSections.bootloader ? styles.arrowDown : styles.arrowRight}>▼</span>
          </div>
          {expandedSections.bootloader && (
            <div className={styles.sectionContent}>
              <div className={styles.warning}>
                <AlertTriangle size={20} />
                <p>
                  <strong>Warning:</strong> Unlocking the bootloader will erase all data on your device and may void
                  your warranty.
                </p>
              </div>

              <h3>Preparation</h3>
              <ol>
                <li>Enable OEM unlocking in Developer options (if not already done).</li>
                <li>Back up all important data from your device.</li>
                <li>Charge your device to at least 80%.</li>
              </ol>

              <h3>Unlocking Process</h3>
              <ol>
                <li>Connect your device to your computer via USB.</li>
                <li>Open a terminal or command prompt on your computer.</li>
                <li>
                  Reboot your device into bootloader mode:
                  <div className={styles.command}>adb reboot bootloader</div>
                </li>
                <li>
                  Verify your device is detected:
                  <div className={styles.command}>fastboot devices</div>
                  <p>You should see your device listed with a serial number.</p>
                </li>
                <li>
                  Unlock the bootloader:
                  <div className={styles.command}>fastboot flashing unlock</div>
                </li>
                <li>
                  On your device, use the volume keys to navigate to "Unlock the bootloader" and press the power button
                  to confirm.
                </li>
                <li>Your device will reset and erase all data.</li>
                <li>After the device boots, you'll need to go through the initial setup process.</li>
                <li>Re-enable Developer options and USB debugging as described in the Prerequisites section.</li>
              </ol>
            </div>
          )}
        </section>

        {/* Recovery Installation Section */}
        <section className={styles.guideSection}>
          <div className={styles.sectionHeader} onClick={() => toggleSection("recovery")}>
            <h2>
              <Terminal size={24} />
              Installing Custom Recovery
            </h2>
            <span className={expandedSections.recovery ? styles.arrowDown : styles.arrowRight}>▼</span>
          </div>
          {expandedSections.recovery && (
            <div className={styles.sectionContent}>
              <p>
                This step is required to install the crDroid ROM on your device. You need to install a custom recovery
                Best option is the one provided on Builds page.
              </p>

              <h3>Download Recovery Image</h3>
              <p>
                Download the appropriate recovery image as well as kernel images for your device from the {" "}
                <Link href="/">crDroid downloads page</Link>.
              </p>

              <h3>Boot into Recovery</h3>
              <ol>
                <li>Connect your device to your computer via USB.</li>
                <li>Open a terminal or command prompt on your computer.</li>
                <li>
                  Reboot your device into bootloader mode:
                  <div className={styles.command}>adb reboot bootloader</div>
                </li>
                <li>
                  Verify your device is detected:
                  <div className={styles.command}>fastboot devices</div>
                </li>
                <li>
                  Flash recovery images and kernel (replace [vendor_boot.img], [dtbo.img], [boot.img] with the actual filename):
                  <div className={styles.command}>fastboot flash [vendor_boot.img]</div>
                  <div className={styles.command}>fastboot flash boot [boot.img]</div>
                  <div className={styles.command}>fastboot flash dtbo [dtbo.img]</div>
                </li>
                <li>
                  On your device, use the volume keys to navigate to "Recovery" and press the power button
                  to confirm.
                </li>
              </ol>
            </div>
          )}
        </section>

        {/* ROM Installation Section */}
        <section className={styles.guideSection}>
          <div className={styles.sectionHeader} onClick={() => toggleSection("installation")}>
            <h2>
              <Smartphone size={24} />
              Installing crDroid
            </h2>
            <span className={expandedSections.installation ? styles.arrowDown : styles.arrowRight}>▼</span>
          </div>
          {expandedSections.installation && (
            <div className={styles.sectionContent}>
              <h3>Installation Steps</h3>
              <ol>
                <li>
                  Sideloading the ROM ZIP file to your device (replace [crDroid.zip] with the actual filename or path of the ROM):
                    <div className={styles.command}>adb sideload [crDroid.zip]</div>
                </li>
                <li>
                  If using separate GApps, transfer those as well:
                  <div className={styles.command}>adb sideload NikGapps-*.zip</div>
                </li>
              </ol>

              <h3>Installation Steps</h3>
              <p>Once in recovery mode (crDroid Recovery):</p>
              <ol>
                <li>
                  <strong>Wipe the device</strong> (if coming from another ROM or stock):
                  <ul>
                    <li>Select "Factory Reset"</li>
                    <li>Select "Format data/factory reset"</li>
                    <li>Select "Format data" to confirm the action</li>
                  </ul>
                </li>
                <li>
                  <strong>Install crDroid ROM:</strong>
                  <ul>
                    <li>Select "Apply update"</li>
                    <li>Select "Apply from ADB"</li>
                    <li>On desktop run:</li>
                    <div className={styles.command}>adb sideload [crDroid.zip]</div>
                    <li>You will be prompted to reboot to recovery to install any addon, this depends on your use case. For Google Apps / Magisk install say "Yes".</li>
                  </ul>
                </li>
                <li>
                  <strong>Install GApps</strong> (Optional):
                  <ul>
                    <li>After you are back on crDroid recovery select "Apply update"</li>
                    <li>Select "Apply from ADB"</li>
                    <div className={styles.command}>adb sideload [NikGapps-*.zip]</div>
                  </ul>
                </li>
                <li>
                  <strong>Install Magisk [ROOT]</strong> (Optional):
                  <ul>
                    <li>Select "Apply update"</li>
                    <li>Select "Apply from ADB"</li>
                    <div className={styles.command}>adb sideload [Magisk.apk]</div>
                  </ul>
                </li>
                <li>
                  <strong>Reboot System:</strong>
                  <ul>
                    <li>Select "Reboot" {">"} "System"</li>
                  </ul>
                </li>
              </ol>
              <div className={styles.note}>
                <p>
                  <strong>Note:</strong> The first boot may take up to 10 minutes. This is normal as the system sets up
                  for the first time.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Post-Installation Section */}
        <section className={styles.guideSection}>
          <div className={styles.sectionHeader} onClick={() => toggleSection("postinstall")}>
            <h2>
              <Download size={24} />
              Post-Installation
            </h2>
            <span className={expandedSections.postinstall ? styles.arrowDown : styles.arrowRight}>▼</span>
          </div>
          {expandedSections.postinstall && (
            <div className={styles.sectionContent}>
              <h3>Initial Setup</h3>
              <ol>
                <li>Complete the initial setup process on your device.</li>
                <li>Connect to Wi-Fi and sign in to your Google account (if you installed GApps).</li>
                <li>
                  Re-enable Developer options:
                  <ul>
                    <li>Go to Settings {">"} About phone</li>
                    <li>Tap "Build number" seven times</li>
                    <li>
                      Go to Settings {">"} System {">"} Developer options
                    </li>
                    <li>Enable USB debugging if needed</li>
                  </ul>
                </li>
              </ol>

              <h3>Recommended Settings</h3>
              <ul>
                <li>
                  <strong>Battery Optimization:</strong> Review app battery usage and optimize as needed.
                </li>
                <li>
                  <strong>crDroid Settings:</strong> Explore the custom settings available in the crDroid Settings menu.
                </li>
                <li>
                  <strong>System Updates:</strong> Configure OTA update settings to receive future crDroid updates.
                </li>
              </ul>

              <h3>Troubleshooting</h3>
              <div className={styles.troubleshooting}>
                <h4>If your device doesn't boot:</h4>
                <ol>
                  <li>Boot back into recovery using the fastboot boot method described earlier.</li>
                  <li>Try wiping cache and dalvik cache, then reboot.</li>
                  <li>If still not working, perform a clean installation by wiping data and reinstalling.</li>
                </ol>

                <h4>If you encounter app crashes:</h4>
                <ol>
                  <li>Clear the app's data and cache from Settings {">"} Apps.</li>
                  <li>Ensure you installed the correct GApps package if needed.</li>
                  <li>Check for app compatibility issues with your Android version.</li>
                </ol>
              </div>

              <h3>Getting Help</h3>
              <p>
                If you encounter issues, visit the{" "}
                <a href="https://t.me/glikchedaosp" target="_blank" rel="noopener noreferrer">
                  Developer Telegram group
                </a>{" "}
                for support.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 RetroZenith Builds</p>
      </footer>
    </div>
  )
}

