#!/bin/bash

SOURCE=appBuilds/releases/Codebox/chrome
OUTPUT=appBuilds/releases/codebox-chrome.zip

echo "Create chrome application"
mkdir -p $SOURCE
cp -R ./build $SOURCE
cp -R ./chrome/ $SOURCE

echo "Building Application ZIP: $OUTPUT"
zip -ru $OUTPUT ${SOURCE}/*