#!/bin/bash

# Remote SSH info
REMOTE_USER=ubuntu
REMOTE_HOST=ec2-54-253-85-48.ap-southeast-2.compute.amazonaws.com
REMOTE_HOME=/home/ubuntu

# Local zip paths
DEV_SSR_ZIP=bootstrap/dev-ssr.zip
DEV_BUILD_ZIP=public/dev-build.zip
PROD_SSR_ZIP=bootstrap/prod-ssr.zip
PROD_BUILD_ZIP=public/prod-build.zip

echo "📦 Uploading zip files to EC2..."
scp "$DEV_SSR_ZIP" "$DEV_BUILD_ZIP" "$PROD_SSR_ZIP" "$PROD_BUILD_ZIP" $REMOTE_USER@$REMOTE_HOST:$REMOTE_HOME

echo "🚀 Starting remote deployment..."
ssh $REMOTE_USER@$REMOTE_HOST <<'EOF'

  # Remote target directories
  DEV_SSR_DIR=/var/www/dev.tsdissues.telp.com.au/bootstrap/ssr/
  DEV_BUILD_DIR=/var/www/dev.tsdissues.telp.com.au/public/build/
  PROD_SSR_DIR=/var/www/tsdissues.telp.com.au/bootstrap/ssr/
  PROD_BUILD_DIR=/var/www/tsdissues.telp.com.au/public/build/

  echo "🧹 Removing old deployment directories..."
  sudo rm -rf $DEV_SSR_DIR $DEV_BUILD_DIR $PROD_SSR_DIR $PROD_BUILD_DIR

  echo "📂 Creating fresh directories..."
  sudo mkdir -p $DEV_SSR_DIR $DEV_BUILD_DIR $PROD_SSR_DIR $PROD_BUILD_DIR

  echo "📤 Unzipping new contents..."
  # DEV SSR
  unzip -o dev-ssr.zip -d temp_dev_ssr
  sudo mv temp_dev_ssr/ssr/* "$DEV_SSR_DIR"
  sudo rm -rf temp_dev_ssr

  # DEV BUILD
  unzip -o dev-build.zip -d temp_dev_build
  sudo mv temp_dev_build/build/* "$DEV_BUILD_DIR"
  sudo rm -rf temp_dev_build

  # PROD SSR
  unzip -o prod-ssr.zip -d temp_prod_ssr
  sudo mv temp_prod_ssr/ssr/* "$PROD_SSR_DIR"
  sudo rm -rf temp_prod_ssr

  # PROD BUILD
  unzip -o prod-build.zip -d temp_prod_build
  sudo mv temp_prod_build/build/* "$PROD_BUILD_DIR"
  sudo rm -rf temp_prod_build

  echo "🧼 Cleaning up uploaded zip files..."
  rm -f dev-ssr.zip dev-build.zip prod-ssr.zip prod-build.zip

  echo "✅ Done deploying!"
EOF
