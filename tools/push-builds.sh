#!/bin/bash

# Date and version formatting
DATE=$(date +"%d-%m-%Y")
DEVICE=$1
VERSION="$DEVICE-v11.2-$DATE"
REPO="retrozenith-development/Builds"
OUT_DIR="../out/target/product/$DEVICE"

URL="https://github.com/retrozenith-development/Builds/releases/tag/$VERSION"

# Determine paths for SourceForge upload
SF_ZIP_PATH="crDroidAndroid/11.2/$DEVICE/$DATE/"
SF_IMG_PATH="crDroidAndroid/11.2/$DEVICE/$DATE/recovery/"

# Find all crDroidAndroid*.zip files in the directory
files=$(ls ${OUT_DIR}/crDroidAndroid*.zip)

# Initialize variables to track the latest file
latest_file=""
latest_timestamp=0

# Get the current timestamp
current_timestamp=$(date +%s)

# Loop through each file
for file in $files; do
    timestamp_str=$(echo "$file" | sed -n 's/.*-\([0-9]\{8\}\)-.*/\1/p')

    if [[ -n "$timestamp_str" ]]; then
        file_timestamp=$(date -d "$timestamp_str" +%s)

        if [[ $latest_timestamp -eq 0 || $file_timestamp -gt $latest_timestamp ]]; then
            latest_file="$file"
            latest_timestamp=$file_timestamp
        fi
    fi
done

# Output the filename of the latest or closest crDroidAndroid file
if [[ -n "$latest_file" ]]; then
    echo "$(basename "$latest_file")"
else
    echo "No crDroidAndroid*.zip files found."
fi

DOWNLOAD_URL="https://github.com/retrozenith-development/Builds/releases/download/$VERSION/$(basename "$latest_file")"

# Function to upload to GitHub
upload_to_github() {
    gh release create "$VERSION" \
      "$latest_file" \
      "$OUT_DIR/boot.img" \
      "$OUT_DIR/vendor_boot.img" \
      "$OUT_DIR/dtbo.img" \
      --repo "$REPO" --title "crDroidAndroid $VERSION for $1" --notes "New build for $1" --target main
    echo "Release created successfully."
    echo "Download URL: $DOWNLOAD_URL"
    echo "Release URL: $URL"
}

# Function to upload to SourceForge
upload_to_sourceforge() {
    SSH_KEY_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/id_rsa"
    SF_USER="victor4cris"
    SF_PROJECT="retrozenith-builds"
    SF_HOST="frs.sourceforge.net"

    # Upload ZIP files
    rsync -avP -e "ssh -i $SSH_KEY_PATH" "$latest_file" "$SF_USER@$SF_HOST:/home/frs/project/$SF_PROJECT/$SF_ZIP_PATH"

    # Upload IMG files
    for img in "$OUT_DIR/boot.img" "$OUT_DIR/vendor_boot.img" "$OUT_DIR/dtbo.img"; do
        rsync -avP -e "ssh -i $SSH_KEY_PATH" "$img" "$SF_USER@$SF_HOST:/home/frs/project/$SF_PROJECT/$SF_IMG_PATH"
    done
    echo "Files uploaded to SourceForge successfully."
}

# Execute uploads
upload_to_github
upload_to_sourceforge

exit 0