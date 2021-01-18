#!/usr/bin/env

# abort on errors
set -e
# build dist
npm run build

# go to dist folder
cd dist

# push changes to gh-pages
git init
git add --all
git commit -m "update website"
git push -f https://github.com/qiubee/frontend-applications.git master:gh-pages

# return to original folder
cd - 
