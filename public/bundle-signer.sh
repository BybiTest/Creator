#!/usr/bin/env bash
set -e

# ==============================================================================
# CreatorFlow Bundle Signer & Key Export Tool (.bin / .aab / .apk)
# Specifically designed for GitHub Actions CI/CD, Cafe Bazaar, and Google Play
# Developer: سیدحمیدموسوی زاده
# Package: com.creatorflow.app
# ==============================================================================

KEYSTORE_PATH=${KEYSTORE_PATH:-"signing/release.keystore"}
KEY_ALIAS=${KEY_ALIAS:-"creatorflow_key"}
KEY_PASSWORD=${KEY_PASSWORD:-"creatorflow123"}
KEYSTORE_PASSWORD=${KEYSTORE_PASSWORD:-"creatorflow123"}
OUTPUT_BIN=${OUTPUT_BIN:-"signing/bundle_signer_key.bin"}

echo "🚀 [Bundle Signer] Starting Android signing & key export process..."

# 1. Create signing directory if not exists
mkdir -p signing

# 2. Check if keystore exists, if not generate standard PKCS12 release keystore
if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "🔑 Keystore not found at $KEYSTORE_PATH. Generating a new release keystore..."
    openssl genrsa -out signing/release_private_key.pem 2048
    openssl req -new -x509 -key signing/release_private_key.pem -out signing/release_cert.pem -days 10000 \
        -subj "/CN=CreatorFlow/OU=Studio/O=HamidMousavizadeh/C=IR"
    openssl pkcs12 -export -in signing/release_cert.pem -inkey signing/release_private_key.pem \
        -out "$KEYSTORE_PATH" -name "$KEY_ALIAS" -passout "pass:$KEYSTORE_PASSWORD"
    echo "✅ Keystore created at $KEYSTORE_PATH (Alias: $KEY_ALIAS)"
fi

# 3. Export Bundle Signer .bin format (PKCS#8 DER Binary format for App Bundle store signing)
echo "📦 Exporting Bundle Signer key format (.bin) for Cafe Bazaar / Google Play App Signing..."
openssl pkcs12 -in "$KEYSTORE_PATH" -nocerts -nodes -passin "pass:$KEYSTORE_PASSWORD" | \
    openssl pkcs8 -topk8 -inform PEM -outform DER -out "$OUTPUT_BIN" -nocrypt

echo "✅ Bundle Signer .bin file generated successfully at: $OUTPUT_BIN"
ls -lh "$OUTPUT_BIN"

# 4. Optional signing helper for AAB if present
AAB_PATH="app/build/outputs/bundle/release/app-release.aab"
SIGNED_AAB_PATH="app/build/outputs/bundle/release/app-release-signed.aab"

if [ -f "$AAB_PATH" ]; then
    echo "✍️ Signing App Bundle ($AAB_PATH)..."
    cp "$AAB_PATH" "$SIGNED_AAB_PATH"
    jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
        -keystore "$KEYSTORE_PATH" \
        -storepass "$KEYSTORE_PASSWORD" \
        -keypass "$KEY_PASSWORD" \
        "$SIGNED_AAB_PATH" "$KEY_ALIAS"
    echo "✅ Signed AAB generated: $SIGNED_AAB_PATH"
fi

# 5. Optional signing helper for APK if present
APK_PATH="app/build/outputs/apk/release/app-release-unsigned.apk"
SIGNED_APK_PATH="app/build/outputs/apk/release/app-release-signed.apk"

if [ -f "$APK_PATH" ]; then
    echo "✍️ Signing Release APK ($APK_PATH)..."
    cp "$APK_PATH" "$SIGNED_APK_PATH"
    jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
        -keystore "$KEYSTORE_PATH" \
        -storepass "$KEYSTORE_PASSWORD" \
        -keypass "$KEY_PASSWORD" \
        "$SIGNED_APK_PATH" "$KEY_ALIAS"
    echo "✅ Signed APK generated: $SIGNED_APK_PATH"
fi

echo "🎉 [Bundle Signer] All operations completed successfully!"
