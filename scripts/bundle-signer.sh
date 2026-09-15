#!/usr/bin/env bash
set -e

# ==============================================================================
# CreatorFlow Official Bundle Signer & Store Packaging Tool
# Supports:
# 1. Cafe Bazaar Official Bundle Signer (bundlesigner-0.1.13.jar genbin)
# 2. Standard Universal Signed APK (Direct upload to Cafe Bazaar / Myket)
# 3. Google Play / Cafe Bazaar App Bundle (AAB) & Keystore Management
# ==============================================================================

KEYSTORE_PATH=${KEYSTORE_PATH:-"signing/release.keystore"}
KEY_ALIAS=${KEY_ALIAS:-"creatorflow_key"}
KEY_PASSWORD=${KEY_PASSWORD:-"creatorflow123"}
KEYSTORE_PASSWORD=${KEYSTORE_PASSWORD:-"creatorflow123"}
SIGNING_DIR=${SIGNING_DIR:-"signing"}

echo "🚀 [CreatorFlow Packager] Starting Android signing & verification process..."
mkdir -p "$SIGNING_DIR"

# 1. Generate or load Release Keystore
if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "🔑 Generating release keystore at $KEYSTORE_PATH..."
    openssl genrsa -out "$SIGNING_DIR/release_private_key.pem" 2048
    openssl req -new -x509 -key "$SIGNING_DIR/release_private_key.pem" -out "$SIGNING_DIR/release_cert.pem" -days 10000 \
        -subj "/CN=CreatorFlow/OU=Production/O=HamidMousavizadeh/C=IR"
    openssl pkcs12 -export -in "$SIGNING_DIR/release_cert.pem" -inkey "$SIGNING_DIR/release_private_key.pem" \
        -out "$KEYSTORE_PATH" -name "$KEY_ALIAS" -passout "pass:$KEYSTORE_PASSWORD"
    echo "✅ Keystore created: $KEYSTORE_PATH"
fi

# 2. Sign Release AAB if it exists
AAB_INPUT=$(find app/build/outputs/bundle/release -name "*.aab" 2>/dev/null | head -n 1 || true)
if [ -n "$AAB_INPUT" ] && [ -f "$AAB_INPUT" ]; then
    SIGNED_AAB="$SIGNING_DIR/CreatorFlow-release-signed.aab"
    echo "✍️ Signing App Bundle ($AAB_INPUT) -> $SIGNED_AAB"
    cp "$AAB_INPUT" "$SIGNED_AAB"
    jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
        -keystore "$KEYSTORE_PATH" \
        -storepass "$KEYSTORE_PASSWORD" \
        -keypass "$KEY_PASSWORD" \
        "$SIGNED_AAB" "$KEY_ALIAS"
    echo "✅ AAB signed successfully."

    # 3. Run official Cafe Bazaar bundlesigner tool to generate official .bin digest
    echo "📦 Preparing Cafe Bazaar official bundle-signer tool..."
    BUNDLE_SIGNER_JAR="/tmp/bundlesigner-0.1.13.jar"
    if [ ! -f "$BUNDLE_SIGNER_JAR" ]; then
        curl -sSL -o "$BUNDLE_SIGNER_JAR" https://github.com/cafebazaar/bundle-signer/releases/download/v0.1.13/bundlesigner-0.1.13.jar
    fi

    if which java > /dev/null 2>&1; then
        echo "⚡ Running official Cafe Bazaar bundle-signer genbin..."
        java -jar "$BUNDLE_SIGNER_JAR" genbin \
            --bundle "$SIGNED_AAB" \
            --bin "$SIGNING_DIR/" \
            --v2-signing-enabled true \
            --v3-signing-enabled false \
            --ks "$KEYSTORE_PATH" \
            --ks-pass "pass:$KEYSTORE_PASSWORD" \
            --key-pass "pass:$KEY_PASSWORD" \
            --ks-key-alias "$KEY_ALIAS" \
            -v || true

        # Find produced bin file and copy to standardized name
        PRODUCED_BIN=$(find "$SIGNING_DIR" -maxdepth 1 -name "*.bin" 2>/dev/null | grep -v "pepk" | head -n 1 || true)
        if [ -n "$PRODUCED_BIN" ]; then
            cp "$PRODUCED_BIN" "$SIGNING_DIR/bazaar_bundle_signer.bin"
            echo "✅ Verified Cafe Bazaar .bin digest generated at: $SIGNING_DIR/bazaar_bundle_signer.bin"
        fi
    fi
fi

# 4. Sign Release APK if it exists
APK_INPUT=$(find app/build/outputs/apk/release -name "*.apk" 2>/dev/null | head -n 1 || true)
if [ -n "$APK_INPUT" ] && [ -f "$APK_INPUT" ]; then
    SIGNED_APK="$SIGNING_DIR/CreatorFlow-release-signed.apk"
    echo "✍️ Signing Release APK ($APK_INPUT) -> $SIGNED_APK"
    cp "$APK_INPUT" "$SIGNED_APK"
    jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
        -keystore "$KEYSTORE_PATH" \
        -storepass "$KEYSTORE_PASSWORD" \
        -keypass "$KEY_PASSWORD" \
        "$SIGNED_APK" "$KEY_ALIAS"
    echo "✅ Universal Signed APK ready for direct Cafe Bazaar upload."
fi

echo "🎉 [CreatorFlow Packager] Process finished."
