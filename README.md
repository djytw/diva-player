# diva-player

A rewrite of [MikuMikuLibrary](https://github.com/blueskythlikesclouds/MikuMikuLibrary) in JavaScript.

# Usage

```bash
npm install -g browserify
npm i aes-js three pngjs pako
browserify -r ./index.js:DIVA -i pako -i three -o build/bundle.js
```
