#!/bin/bash

SOURCE=appBuilds/releases/Codebox/chrome
OUTPUT=appBuilds/releases/codebox-chrome.zip

echo "Clean old build"
rm -rf $SOURCE

echo "Create chrome application"
mkdir -p $SOURCE
cp -R ./build/ $SOURCE
cp -R ./chrome/ $SOURCE
cp ./node_modules/codebox-io/codebox-io.js $SOURCE

echo "Building Application ZIP: $OUTPUT"
zip -ru $OUTPUT ${SOURCE}/*