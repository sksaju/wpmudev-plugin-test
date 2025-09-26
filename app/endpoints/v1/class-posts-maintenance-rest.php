<?php
/**
 * Posts Maintenance API endpoints.
 *
 * @link          https://wpmudev.com/
 * @since         1.0.0
 *
 * @author        WPMUDEV (https://wpmudev.com)
 * @package       WPMUDEV\PluginTest
 *
 * @copyright (c) 2025, Incsub (http://incsub.com)
 */

 namespace WPMUDEV\PluginTest\Endpoints\V1;

 // Abort if called directly.
 defined( 'WPINC' ) || die;

use WPMUDEV\PluginTest\Base;
use WPMUDEV\PluginTest\App\Services\Posts_Maintenance;
use WP_REST_Request;
use WP_REST_Response;

class Posts_Maintenance_API extends Base {
	public function init() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	public function register_routes() {
		register_rest_route( 'wpmudev/v1', '/posts-maintenance/start', array(
			'methods'  => 'POST',
			'callback' => array( $this, 'start' ),
			'permission_callback' => function () { return current_user_can( 'manage_options' ); },
		) );

		register_rest_route( 'wpmudev/v1', '/posts-maintenance/progress', array(
			'methods'  => 'GET',
			'callback' => array( $this, 'progress' ),
			'permission_callback' => function () { return current_user_can( 'manage_options' ); },
		) );
	}

	public function start( WP_REST_Request $request ) {
		$post_types = (array) $request->get_param( 'post_types' );
		Posts_Maintenance::instance()->start_scan( $post_types );
		return new WP_REST_Response( array( 'started' => true ) );
	}

	public function progress() {
		return new WP_REST_Response( Posts_Maintenance::instance()->get_progress() );
	}
}
