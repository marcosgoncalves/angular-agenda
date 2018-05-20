module.exports = function (grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.loadNpmTasks('grunt-serve');
	grunt.loadNpmTasks('grunt-dev-update');

	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.initConfig({
		serve: {
			options: {
				port: 9000,
				serve: {
					path: 'source'
				}
			}
		},

		devUpdate: {
			main: {
				options: {
					updateType: 'force', //just report outdated packages
					reportUpdated: true, //don't report up-to-date packages
					semver: false, //stay within semver when updating
					packages: {
						devDependencies: true, //only check for devDependencies
						dependencies: true
					},
					packageJson: null, //use matchdep default findup to locate package.json
					reportOnlyPkgs: [] //use updateType action on all packages
				}
			}
		},

		pkg: grunt.file.readJSON('package.json'),

		meta: {
			jsFilesForTesting: [
				'bower_components/jquery/jquery.js',
				'bower_components/angular/angular.js',
				'bower_components/angular-route/angular-route.js',
				'bower_components/angular-sanitize/angular-sanitize.js',
				'bower_components/angular-mocks/angular-mocks.js',
				'bower_components/restangular/dist/restangular.js',
				'bower_components/underscore/underscore.js',
				'bower_components/underscore/underscore.js',
				'test/**/*Spec.js'
			]
		},

		'karma': {
			'development': {
				'configFile': 'karma.conf.js',
				'options': {
					'files': [
						'<%= meta.jsFilesForTesting %>',
						'source/**/*.js'
					],
				}
			},
			'dist': {
				'options': {
					'configFile': 'karma.conf.js',
					'files': [
						'<%= meta.jsFilesForTesting %>',
						'dist/<%= pkg.namelower %>-<%= pkg.version %>.js'
					],
				}
			},
			'minified': {
				'options': {
					'configFile': 'karma.conf.js',
					'files': [
						'<%= meta.jsFilesForTesting %>',
						'dist/<%= pkg.namelower %>-<%= pkg.version %>.min.js'
					],
				}
			}
		},

		'jshint': {
			'beforeconcat': ['source/**/*.js'],
		},

		'concat': {
			'dist': {
				'src': ['source/**/*.js'],
				'dest': 'dist/<%= pkg.namelower %>-<%= pkg.version %>.js'
			}
		},

		'uglify': {
			'options': {
				'mangle': false
			},
			'dist': {
				'files': {
					'dist/<%= pkg.namelower %>-<%= pkg.version %>.min.js': ['dist/<%= pkg.namelower %>-<%= pkg.version %>.js']
				}
			}
		},

		'jsdoc': {
			'src': ['source/**/*.js'],
			'options': {
				'destination': 'doc'
			}
		}

	});

	//grunt.registerTask('serve', ['serve']);

	grunt.registerTask('update', ['devUpdate:main']);

	grunt.registerTask('test', ['karma:development']);

	grunt.registerTask('build', [
		'jshint',
		'karma:development',
		'concat',
		'karma:dist',
		'uglify',
		'karma:minified',
		'jsdoc'
	]);

};