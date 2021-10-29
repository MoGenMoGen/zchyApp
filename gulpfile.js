"use strict";

var gulp = require('gulp');
var scp2 = require('gulp-scp2');
var sequence = require('run-sequence');
//访问路径https://mob.sinovatocean.com/views/person/shipList.html
gulp.task('dev', function(){
    return gulp.src('' +
        '/**')
        .pipe(scp2({
            host: '47.101.167.43',
            username: 'root',
                password: 'sinovat_ocean@2020',
			dest: '/usr/local/tomcat/sinovat/web/mob'
        }))
        .on('error', function(err) {
            throw err;
        });
});

gulp.task('default', function(done){
    sequence(
        'dev',
        done
    )
});
