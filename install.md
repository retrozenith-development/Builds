### Pre-installation:

* Recovery [vendor_boot dtbo boot] (from download page, recovery button)
* Optional GAPPS (from download page, gapps button)

### First-Time Installation (Clean Flash)
* Note: Ensure you backup all important data to your PC or OTG flash drive before proceeding.

* Step 1: Flash Necessary Files
Boot your device into Bootloader Mode (usually by pressing Volume Down + Power).

Connect your device to your PC via a USB cable.

Open your terminal/command prompt and execute the following commands:
```
fastboot flash boot boot.img
fastboot flash dtbo dtbo.img
fastboot flash vendor_boot vendor_boot.img
```
* Step 2: Boot into Recovery Mode
Once flashing is complete, boot into Recovery Mode (using volume buttons to change action and power button to select).
* Step 3: Format Data
In Recovery Mode, navigate to the Format Data option and confirm the process.
(This step will wipe all existing data on your device.)
* Step 4.1: Sideload the ROM
Ensure your PC has ADB installed and functional.

Connect your device to your PC.

Use the following command to sideload the ROM:
```
adb sideload crDroid.zip
```
You will be prompted to reboot to recovery to flash a new file if you want to do so press yes if not press no and follow step 5.


* [Optional] Step 4.2: Flash GAPPS Package using following command:
```
adb sideload GAPPS.zip
```

* Step 5: Reboot to System
Once the ROM installation is complete, reboot your device to System and enjoy your new setup!

### Update installation:
#### Via recovery (recommended way):
* Boot to download mode and flash the new recovery

```
fastboot flash boot boot.img
fastboot flash dtbo dtbo.img
fastboot flash vendor_boot vendor_boot.img
```
* Boot to recovery by holding VOL UP + POWER
* Navigate to Apply update and choose from adb (if you have crDroid.zip on external sdcard, you may choose this option and navigate to where the zip is)
* Now install crDroid zip via sideload and reboot

```
adb sideload crDroid.zip
```

#### Via OTA:
* Go to Settings -> System -> Updater and download latest build
* Choose install and let it finish
* Reboot
