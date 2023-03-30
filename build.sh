#!/bin/sh

# Clean the dist folder if it exists
if [ -d "dist" ]; then
  rm -rf dist
fi

# Build the project
tsc

# Copy misc files
cp package.json package-lock.json dist
cp -r src/views dist
cp -r src/public dist