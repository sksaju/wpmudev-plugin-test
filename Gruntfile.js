module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt)

	const buildFiles = [
		'app/**',
		'core/**',
		'languages/**',
		'assets/**',
		'wpmudev-plugin-test.php',
		'uninstall.php',
		'vendor/autoload.php',
		'vendor/composer/**',
		'vendor/google/apiclient/**',
		'vendor/google/auth/**',
		'vendor/guzzlehttp/**',
		'vendor/monolog/**',
		'vendor/paragonie/**',
		'vendor/psr/**',
		'vendor/ralouphie/**',
		'vendor/symfony/**',
		// Exclude development files
		'!composer.json',
		'!composer.lock',
		'!vendor/google/apiclient-services/**',
		'!vendor/dealerdirect/**',
		'!vendor/firebase/**',
		'!vendor/phpcompatibility/**',
		'!vendor/phpcsstandards/**',
		'!vendor/phpseclib/**',
		'!vendor/squizlabs/**',
		'!vendor/wp-coding-standards/**',
		'!vendor/bin/**',
		'!node_modules/**',
		'!src/**',
		'!tests/**',
		'!*.md',
		'!Gruntfile.js',
		'!webpack.config.js',
		'!phpcs.ruleset.xml',
		'!phpunit.xml.dist',
		'!gulpfile.js',
		'!changelog.txt',
		'!.babelrc',
		'!**/*.map',
	]

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Clean build directory
		clean: {
			build: ['build/**'],
		},

		// Copy files for production build
		copy: {
			build: {
				src: buildFiles,
				dest: 'build/<%= pkg.name %>/',
			},
		},

		// Create zip package
		compress: {
			build: {
				options: {
					mode: 'zip',
					archive: './build/<%= pkg.name %>-<%= pkg.version %>.zip',
				},
				expand: true,
				cwd: 'build/<%= pkg.name %>/',
				src: ['**/*'],
				dest: '<%= pkg.name %>/',
			},
		},
	})

	// Main build task
	grunt.registerTask('build', [
		'clean:build',
		'copy:build',
		'compress:build',
	])
}
