#!/bin/bash

SOURCE=appBuilds/releases/Codebox/linux64/
OUTPUT=appBuilds/releases/codebox-linux64.tar.gz

echo "Building Linux Tar: $OUTPUT"
tar -zcvf $OUTPUT -C ${SOURCE} Codebox
