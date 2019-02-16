#!/usr/bin/env bash
ng build --prod --output-path docs --base-href /ProfesScore/ &&
cp "docs/index.html" "docs/404.html"
echo "Created 404.html for GitHub Pages."
