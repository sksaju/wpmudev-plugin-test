<?php
namespace WPMUDEV\PluginTest\App\CLI;

use WPMUDEV\PluginTest\Base;
use WPMUDEV\PluginTest\App\Services\Posts_Maintenance;

defined( 'WPINC' ) || die;

class Posts_Maintenance_CLI extends Base {
	public function init() {
		\WP_CLI::add_command( 'wpmudev posts-scan', array( $this, 'command_scan' ) );
	}

	/**
	 * Scan posts and pages to update last scan meta.
	 *
	 * ## OPTIONS
	 *
	 * [--post_types=<types>]
	 * : Comma separated post types to scan. Defaults to post,page
	 *
	 * ## EXAMPLES
	 *   wp wpmudev posts-scan --post_types=post,page
	 *   wp wpmudev posts-scan
	 */
	public function command_scan( $args, $assoc_args ) {
		$post_types = array();
		if ( ! empty( $assoc_args['post_types'] ) ) {
			$post_types = array_map( 'sanitize_key', array_filter( array_map( 'trim', explode( ',', $assoc_args['post_types'] ) ) ) );
		}
		\WP_CLI::log( 'Starting background scan...' );
		Posts_Maintenance::instance()->start_scan( $post_types );
		\WP_CLI::success( 'Scan scheduled. Use the admin page or REST progress endpoint to monitor.' );
	}
}
