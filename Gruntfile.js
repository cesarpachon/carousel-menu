module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


      copy: {
        lib: {
          files: [
            {expand: true,
             src: [
               'vendor/jquery/jquery.js',
               'vendor/jquery-mobile-bower/js/jquery.mobile-1.4.2.js'
               ],
             flatten: true,
             dest: 'www/lib',
             filter: 'isFile'}

            // includes files within path and its sub-directories
            //{expand: true, src: ['path/**'], dest: 'dest/'},

            // makes all src relative to cwd
            //{expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

            // flattens results to a single level
            //{expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
          ],
        },
        css:{
          files:[
            {expand: true,
             src: [
               'vendor/jquery-mobile-bower/css/jquery.mobile-1.4.2.css'
               ],
             flatten: true,
             dest: 'www/css',
             filter: 'isFile'}
          ],
        }
      },
  });

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('make', ['copy:lib', 'copy:css']);
};
