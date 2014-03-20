#!/bin/bash

# Dir of current script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Fix issues with dynamic libraries
export LD_LIBRARY_PATH="${DIR}:${LD_LIBRARY_PATH}"

# Run codebox itself
${DIR}/Codebox

