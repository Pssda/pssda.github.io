'use strict';

import path from 'path';
import fs from 'fs';
import gulp from 'gulp';
import pug from 'gulp-pug';
import sass from 'gulp-sass';
import connect from 'gulp-connect';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import pkg from './package';

const srcPath = path.join(__dirname, 'src');
const dataPath = path.join(srcPath, 'data');
const jsPath = path.join(srcPath, 'js');
const pugPath = path.join(srcPath, 'pug');
const sassPath = path.join(srcPath, 'scss');
const staticPath = path.join(srcPath, 'static');
const builtPath = './built';
const port = 8080;

gulp.task('buildJs', () =>
  gulp
    .src(path.join(jsPath, 'script.js'))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(builtPath))
    .pipe(connect.reload()),
);

gulp.task('buildPug', () => {
  const locals = {
    title: pkg.name,
    description: pkg.description,
    author: pkg.author,
    contents: [],
    businesses: [{
      id: 'industry',
      name: {
        en: 'Industry',
        ko: '산업',
      },
    }, {
      id: 'restaurant',
      name: {
        en: 'Restaurant',
        ko: '요식업',
      },
    }, {
      id: 'design',
      name: {
        en: 'Design',
        ko: '디자인',
      },
    }, {
      id: 'finance',
      name: {
        en: 'Finance',
        ko: '금융업',
      },
    }, {
      id: 'education',
      name: {
        en: 'Education',
        ko: '교육업',
      },
    }, {
      id: 'service',
      name: {
        en: 'Service',
        ko: '서비스업',
      },
    }, {
      id: 'etc',
      name: {
        en: 'Etc.',
        ko: '기타',
      },
    }],
    colors: [
      ['#FFFFFF', '#000000'],
      ['#75C8F0', '#EA91DC'],
      ['#939297', '#A93C30'],
      ['#F8E81C', '#D0011B'],
      ['#03428C', '#FFFFFF'],
      ['', ''],
    ],
    styles: [{
      id: 'stylish',
      name: {
        en: 'I just want to have a stylish site',
        ko: '나는 단지 세련된 사이트를 갖고 싶다.',
      },
    }, {
      id: 'functional',
      name: {
        en: 'No, more',
        ko: '아니요, 더',
      },
    }, {
      id: 'idk',
      name: {
        en: 'I don\'t know',
        ko: '나는 모른다.',
      },
    }],
  };

  const contents = fs.readdirSync(dataPath).filter(file => file.endsWith('.js')).map(file => {
    const name = file.slice(0, -3);
    const filePath = path.join(dataPath, file);
    delete require.cache[require.resolve(filePath)];
    const loaded = require(filePath);
    loaded.name = name;
    loaded.image = path.join('/img/contents', `${name}.png`);
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
    return loaded;
  });
  contents.sort((a, b) => a.date ? -a.date.localeCompare(b.date) : 1);
  Object.assign(locals, { contents });

  return gulp
    .src(path.join(pugPath, '**', '*.pug'))
    .pipe(pug({ locals }))
    .pipe(gulp.dest(builtPath))
    .pipe(connect.reload());
});

gulp.task('buildSass', () =>
  gulp
    .src(path.join(sassPath, 'stylesheet.scss'))
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(gulp.dest(builtPath))
    .pipe(connect.reload()),
);

gulp.task('copyStatic', () =>
  gulp
    .src(path.join(staticPath, '**', '*'), { base: staticPath })
    .pipe(gulp.dest(builtPath)),
);

gulp.task('openServer', done => {
  connect.server({
    port,
    root: builtPath,
    livereload: true,
  });
  done();
});

gulp.task('closeServer', done => {
  connect.serverClose();
  done();
});

gulp.task('watch', done => {
  gulp.watch(jsPath, gulp.series('buildJs'));
  gulp.watch(dataPath, gulp.series('buildPug'));
  gulp.watch(pugPath, gulp.series('buildPug'));
  gulp.watch(sassPath, gulp.series('buildSass'));
  gulp.watch(staticPath, gulp.series('copyStatic'));
  done();
});

gulp.task('build', gulp.parallel('buildJs', 'buildPug', 'buildSass', 'copyStatic'));

gulp.task('default', gulp.parallel('openServer', 'build', 'watch'));
