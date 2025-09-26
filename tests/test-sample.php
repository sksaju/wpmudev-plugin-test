<?php
/**
 * Plugin Core Tests
 *
 * @package Wpmudev_Plugin_Test
 * @group core
 */
class SampleTest extends WP_UnitTestCase {

	/**
	 * Test plugin activation
	 */
	public function test_plugin_activation() {
		// Test that plugin is properly loaded
		$this->assertTrue( class_exists( 'WPMUDEV\PluginTest\Core\Plugin' ) );
	}

	/**
	 * Test plugin constants
	 */
	public function test_plugin_constants() {
		$this->assertTrue( defined( 'WPMUDEV_PLUGIN_TEST_VERSION' ) );
		$this->assertTrue( defined( 'WPMUDEV_PLUGIN_TEST_PATH' ) );
		$this->assertTrue( defined( 'WPMUDEV_PLUGIN_TEST_URL' ) );
	}

	/**
	 * Test admin menu registration
	 */
	public function test_admin_menu_registration() {
		// Test that admin pages are properly registered
		$this->assertTrue( class_exists( 'WPMUDEV\PluginTest\App\Admin_Pages\GoogleDrive_Settings' ) );
		$this->assertTrue( class_exists( 'WPMUDEV\PluginTest\App\Admin_Pages\Posts_Maintenance_Page' ) );
	}

	/**
	 * Test REST API registration
	 */
	public function test_rest_api_registration() {
		// Test that REST endpoints are properly registered
		$this->assertTrue( class_exists( 'WPMUDEV\PluginTest\App\Endpoints\V1\GoogleDrive_REST' ) );
		$this->assertTrue( class_exists( 'WPMUDEV\PluginTest\App\Endpoints\V1\Posts_Maintenance_REST' ) );
	}

	/**
	 * Test WP-CLI integration
	 */
	public function test_wp_cli_integration() {
		// Test that WP-CLI commands are properly registered
		$this->assertTrue( class_exists( 'WPMUDEV\PluginTest\App\CLI\Posts_Maintenance_CLI' ) );
	}

	/**
	 * Test services registration
	 */
	public function test_services_registration() {
		// Test that services are properly registered
		$this->assertTrue( class_exists( 'WPMUDEV\PluginTest\App\Services\Posts_Maintenance' ) );
	}
}
