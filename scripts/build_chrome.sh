#!/bin/bash

SOURCE=appBuilds/releases/codebox/chrome/

OUTPUT=appBuilds/releases/codebox-chrome.zip

echo "Clean old build"
rm -rf $SOURCE $OUTPUT

echo "Create chrome application"
mkdir -p $SOURCE
cp -R ./build/ $SOURCE
cp ./node_modules/codebox-io/codebox-io.js $SOURCE

echo "Building Application ZIP: $OUTPUT"
zip -ru $OUTPUT ./chrome/*