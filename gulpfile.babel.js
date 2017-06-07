'use strict';

import extend from 'extend';
import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import babel from 'gulp-babel';
import autoprefixer from 'gulp-autoprefixer';
import header from 'gulp-header';
import gutil from 'gulp-util';
import connect from 'gulp-connect';
import pug from 'gulp-pug';
import sass from 'gulp-sass';
import pkg from './package.json';

const outputPaths = {
  css: './',
  js: './',
  pug: './',
};

const banner = [
  '/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @author <%= pkg.author %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''
].join('\n');

// Build Directories
const cssDir = path.join(__dirname, 'css', '**', '*.scss');
const jsDir = path.join(__dirname, 'js', '**', '*.js');
const pugDir = path.join(__dirname, 'pug', '**', '*.pug');

function onError(err) {
  console.log(err);
  this.emit('end');
}

// CSS
gulp.task('build-css', () => {
  gutil.log('\n\nBuild CSS Paths: \n', cssDir, '\n\n');

  return gulp.src(cssDir)
    .pipe(autoprefixer('last 2 version', 'ie 8', 'ie 9'))
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(header(banner, { pkg }))
    .pipe(gulp.dest(outputPaths.css))
    .pipe(connect.reload());
});

// JS
gulp.task('build-js', () => {
  gutil.log('\n\nBuild JS Paths: \n', jsDir, '\n\n');

  return gulp.src(jsDir)
    .on('error', onError)
    .pipe(babel())
    .pipe(header(banner, { pkg }))
    .pipe(gulp.dest(outputPaths.js))
    .pipe(connect.reload());
});

// PUG
gulp.task('build-pug', () => {
  gutil.log('\n\nBuild pug Paths: \n', pugDir, '\n\n');

  const locals = {
    title: pkg.name,
    description: pkg.description,
    author: pkg.author,
    contents: [],
  };

  const filename = (v) => {
    const s = v.split('.');
    const ext = s.pop();
    const name = s.join('.');
    return { name, ext };
  };
  const assetsDir = path.join(__dirname, 'assets');
  const contents = [];
  fs.readdirSync(assetsDir).forEach((file) => {
    const { name, ext } = filename(file);
    const content = contents.find(content => content.name === name);
    let loaded;
    if (ext === 'js') {
      loaded = require(path.join(assetsDir, name));
      loaded.name = name;
      for (const key in loaded) {
        if (/^(title|body|content)/.test(key)) {
          loaded[key] = loaded[key].replace(/\n/g, '<br/>');
        }
      }
    } else {
      const image = path.join('assets', file);
      loaded = { image };
    }
    if (content) {
      extend(content, loaded);
    } else {
      contents.push(loaded);
    }
  });
  contents.sort((a, b) => a.date ? -a.date.localeCompare(b.date) : 1);
  extend(locals, { contents });

  return gulp.src(pugDir)
    .on('error', onError)
    .pipe(pug({ locals }))
    .pipe(gulp.dest(outputPaths.pug))
    .pipe(connect.reload());
});

// Build
gulp.task('build', ['build-css', 'build-js', 'build-pug']);

// Server
gulp.task('connect', function () {
  connect.server({
    port: process.env.PORT || 8080,
    livereload: true
  });
});

// Watch
gulp.task('watch', function () {
  gulp.watch(cssDir, ['build-css']);
  gulp.watch(jsDir, ['build-js']);
  gulp.watch(pugDir, ['build-pug']);
});

// Default
gulp.task('default', ['connect', 'watch']);