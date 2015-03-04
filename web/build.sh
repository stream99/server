mkdir -p static
cd static && ln -s ../videos videos && cd ..
npm run build-css && npm run build-js
