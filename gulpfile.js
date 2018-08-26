// Installs the required missing modules
/* */
(function () {
	var r = require;
	require = function (n) {
		try {
			return r(n);
		} catch (err) {
			// var cmd = 'npm install ' + n + ' --only=dev';
			var cmd = 'npm install --save-dev ' + n;
			console.log('\n');
			console.log('** Required module "' + n + '" not found. Trying to install it **\n');
			console.log('running: ' + cmd + '\n');
			r('child_process').execSync(cmd, {
				stdio: [0, 1, 2]
			});
			console.log('\n');
			return r(n);
		}
	};
})();
/* */

var gulp = require('gulp'),
	connect = require('gulp-connect'),
	watch = require('gulp-watch');

gulp.task('serve', function () {
	connect.server({
		root: 'app',
		host: '0.0.0.0',
		port: 41125
	});
});

gulp.task('wcomps', function() {
	return watch('../comps/src/**', { ignoreInitial: false })
	.pipe(gulp.dest('bower_components/comps/src'));
});

gulp.task('default', gulp.series('serve'));