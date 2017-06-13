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
import uglify from 'gulp-uglify';

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
    .pipe(autoprefixer('last 2 versions', 'ie 10', 'ie 11'))
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
    .pipe(uglify())
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
    businesses: [
      {
        id: 'industry',
        name: {
          en: 'Industry',
          ko: '산업',
        }
      }, {
        id: 'restaurant',
        name: {
          en: 'Restaurant',
          ko: '요식업',
        }
      }, {
        id: 'design',
        name: {
          en: 'Design',
          ko: '디자인',
        }
      }, {
        id: 'finance',
        name: {
          en: 'Finance',
          ko: '금융업',
        }
      }, {
        id: 'education',
        name: {
          en: 'Education',
          ko: '교육업',
        }
      }, {
        id: 'service',
        name: {
          en: 'Service',
          ko: '서비스업',
        }
      }, {
        id: 'etc',
        name: {
          en: 'Etc.',
          ko: '기타',
        }
      }
    ],
    colors: [
      ['#FFFFFF', '#000000'],
      ['#75C8F0', '#EA91DC'],
      ['#939297', '#A93C30'],
      ['#F8E81C', '#D0011B'],
      ['#03428C', '#FFFFFF'],
      ['', ''],
    ],
    styles: [
      {
        id: 'stylish',
        name: {
          en: 'I just want to have a stylish site',
          ko: '나는 단지 세련된 사이트를 갖고 싶다.',
        }
      }, {
        id: 'functional',
        name: {
          en: 'No, more',
          ko: '아니요, 더',
        }
      }, {
        id: 'idk',
        name: {
          en: 'I don\'t know',
          ko: '나는 모른다.',
        }
      },
    ]
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
          if (typeof loaded[key] === 'string') {
            const str = loaded[key].replace(/\n/g, '<br/>');
            loaded[key] = {
              en: str,
              ko: str,
            };
          } else {
            for (const lang in loaded[key]) {
              loaded[key][lang] = loaded[key][lang].replace(/\n/g, '<br/>');
            }
          }
        }
      }
    } else {
      const image = path.join('/assets', file);
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