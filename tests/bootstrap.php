<?php
// Path to WordPress test library
$_tests_dir = getenv('WP_TESTS_DIR');

if (!$_tests_dir) {
	$_tests_dir = rtrim(sys_get_temp_dir(), '/\\') . '/wordpress-tests-lib';
}

require_once $_tests_dir . '/includes/functions.php';

tests_add_filter('muplugins_loaded', function () {
	// Load your plugin
	require dirname(__DIR__) . '/wpmudev-plugin-test.php';
});

require $_tests_dir . '/includes/bootstrap.php';
