#!/bin/bash
# Copy content-types schema.json files to dist after build

echo "📦 Copying content-types schema files to dist..."

for api_dir in src/api/*/content-types; do
  if [ -d "$api_dir" ]; then
    api_name=$(echo $api_dir | cut -d'/' -f3)
    target_dir="dist/$api_dir"
    mkdir -p "$target_dir"
    cp -r "$api_dir/"* "$target_dir/"
    echo "  ✓ Copied $api_name content-types"
  fi
done

echo "✅ All schema files copied successfully!"
