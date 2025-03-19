#!/bin/bash

# Date and version formatting
DATE=$(date +"%Y%m%d-%H%M")
DEVICE=$1
VERSION="$DEVICE-v11.2-$DATE"
REPO="retrozenith-development/Builds"
OUT_DIR="../out/target/product/$DEVICE"

URL="https://github.com/retrozenith-development/Builds/releases/tag/$VERSION"

# Find all crDroidAndroid*.zip files in the directory
files=$(ls ${OUT_DIR}/crDroidAndroid*.zip)

# Initialize variables to track the latest file
latest_file=""
latest_timestamp=0

# Get the current timestamp
current_timestamp=$(date +%s)

# Loop through each file
for file in $files; do
    # Extract the timestamp part from the filename (assuming format crDroidAndroid-<version>-<date>-<device>-v<version>.zip)
    timestamp_str=$(echo "$file" | sed -n 's/.*-\([0-9]\{8\}\)-.*/\1/p')

    # If the timestamp was extracted successfully
    if [[ -n "$timestamp_str" ]]; then
        # Convert timestamp to seconds since Unix epoch (YYYYMMDD to timestamp)
        file_timestamp=$(date -d "$timestamp_str" +%s)

        # Compare the file timestamp with the current timestamp
        # Find the file with the closest timestamp to the current date
        if [[ $latest_timestamp -eq 0 || $file_timestamp -gt $latest_timestamp ]]; then
            latest_file="$file"
            latest_timestamp=$file_timestamp
        fi
    fi
done

# Output only the filename of the latest or closest crDroidAndroid file
if [[ -n "$latest_file" ]]; then
    # Output just the filename (not the full path)
    echo "$(basename "$latest_file")"
else
    echo "No crDroidAndroid*.zip files found."
fi

DOWNLOAD_URL="https://github.com/retrozenith-development/Builds/releases/download/$VERSION/$(basename "$latest_file")"

# Create the release
gh release create "$VERSION" \
  "$latest_file" \
  "$OUT_DIR/boot.img" \
  "$OUT_DIR/vendor_boot.img" \
  "$OUT_DIR/dtbo.img" \
  --repo "$REPO" --title "crDroidAndroid $VERSION for $1" --notes "New build for $1" --target main

echo "Release created successfully."
echo "Download URL: $DOWNLOAD_URL"
echo "Release URL: $URL"
