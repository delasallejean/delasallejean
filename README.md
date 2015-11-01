# POCs

Simple poc using React ~ Flux

run `gulp build` to generate the javascript (it will be located in `build/bundle.js`)

run `gulp watch` to recompile on `*.jsx` file change

The blocks are fetched from an ec2 micro instance that only respond to `/blocks` on `:8081` and allows CORS.

Using gulp to:
- Browserify
- Babelify
- Uglify
- Livereload once the build is done
