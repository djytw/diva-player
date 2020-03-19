# diva-player

A rewrite of [MikuMikuLibrary](https://github.com/blueskythlikesclouds/MikuMikuLibrary) in JavaScript. (To load farc file in browsers)

# Usage

```bash
npm install -g browserify
npm i aes-js three pngjs pako
browserify -r ./index.js:DIVA -i pako -i three -o build/bundle.js
```

# showcase
![showcase](https://djytw.azurewebsites.net/static/56349d6d4dae08f2b19908b1a689db05.png)
