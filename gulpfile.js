const gulp = require('gulp')
const zip = require('gulp-zip')

gulp.task('default', () =>
  gulp.src(['./background.js', './content_scripts.js', './icons/*.png', './manifest.json'], { base: '.' })
    .pipe(zip('base64_extensions.zip'))
    .pipe(gulp.dest('dist'))
)
