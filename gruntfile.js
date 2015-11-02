module.exports = function() {

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      }, // options
      dist: {
        // the files to concatenate
        src: ['public/grunt/js/*.js'],
        // the location of the resulting JS file
        dest: 'public/javascripts/<%= pkg.name %>.js'
      } // dist
    } //concat

    jshint: {
      files: [
        'Gruntfile.js', 
        'routes/*.js',
        'public/javascripts/*.js',
        'app.js',
        'dbsetup.js'
      ],
      options: {
        globals: {
          jQuery: true
        } //globals
      } //options
    }, //jshint

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      }, //options
      dist: {
        files: {
          'public/javascripts/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      } //dist
    }, //uglify

    compass: {
      dev: {
        options: {
          config: 'config.rb'
        } //options
      } //dev
    }, //compass

    watch: {
      options: { livereload: true },
      sass: {
        files: ['public/grunt/sass/*.scss'],
        tasks: ['compass:dev', 'jshint', 'concat', 'uglify']
      }, //sass
    } //watch
  }); //initConfig

  grunt.registerTask('default', 'watch');

} //exports