<?php
/**
 * Posts Maintenance Tests
 * 
 * @group posts-maintenance
 */
class Tests_Posts_Maintenance extends WP_UnitTestCase {

	/**
	 * Test that scan updates post meta correctly
	 */
	public function test_scan_updates_meta() {
		$post_id = self::factory()->post->create( array( 'post_status' => 'publish' ) );
		
		// Start scan and process one batch
		\WPMUDEV\PluginTest\App\Services\Posts_Maintenance::instance()->start_scan( array( 'post' ) );
		\WPMUDEV\PluginTest\App\Services\Posts_Maintenance::instance()->process_batch( array( 'post' ), 0 );
		
		// Verify meta was updated
		$meta = get_post_meta( $post_id, 'wpmudev_test_last_scan', true );
		$this->assertNotEmpty( $meta );
		$this->assertIsNumeric( $meta );
		$this->assertGreaterThan( 0, $meta );
	}

	/**
	 * Test scan with different post types
	 */
	public function test_scan_different_post_types() {
		$post_id = self::factory()->post->create( array( 'post_status' => 'publish' ) );
		$page_id = self::factory()->post->create( array( 'post_type' => 'page', 'post_status' => 'publish' ) );
		
		// Scan both post types
		\WPMUDEV\PluginTest\App\Services\Posts_Maintenance::instance()->start_scan( array( 'post', 'page' ) );
		\WPMUDEV\PluginTest\App\Services\Posts_Maintenance::instance()->process_batch( array( 'post', 'page' ), 0 );
		
		// Verify both have meta updated
		$post_meta = get_post_meta( $post_id, 'wpmudev_test_last_scan', true );
		$page_meta = get_post_meta( $page_id, 'wpmudev_test_last_scan', true );
		
		$this->assertNotEmpty( $post_meta );
		$this->assertNotEmpty( $page_meta );
		$this->assertIsNumeric( $post_meta );
		$this->assertIsNumeric( $page_meta );
	}

	/**
	 * Test that private posts are not processed
	 */
	public function test_private_posts_not_processed() {
		$public_post_id = self::factory()->post->create( array( 'post_status' => 'publish' ) );
		$private_post_id = self::factory()->post->create( array( 'post_status' => 'private' ) );
		
		// Start scan
		\WPMUDEV\PluginTest\App\Services\Posts_Maintenance::instance()->start_scan( array( 'post' ) );
		\WPMUDEV\PluginTest\App\Services\Posts_Maintenance::instance()->process_batch( array( 'post' ), 0 );
		
		// Verify only public post has meta
		$public_meta = get_post_meta( $public_post_id, 'wpmudev_test_last_scan', true );
		$private_meta = get_post_meta( $private_post_id, 'wpmudev_test_last_scan', true );
		
		$this->assertNotEmpty( $public_meta );
		$this->assertEmpty( $private_meta );
	}

	/**
	 * Test scan progress tracking
	 */
	public function test_scan_progress_tracking() {
		// Create multiple posts
		$post_ids = array();
		for ( $i = 0; $i < 5; $i++ ) {
			$post_ids[] = self::factory()->post->create( array( 'post_status' => 'publish' ) );
		}
		
		// Start scan
		\WPMUDEV\PluginTest\App\Services\Posts_Maintenance::instance()->start_scan( array( 'post' ) );
		
		// Process first batch
		\WPMUDEV\PluginTest\App\Services\Posts_Maintenance::instance()->process_batch( array( 'post' ), 0 );
		
		// Verify progress is tracked
		$progress = get_option( 'wpmudev_posts_maintenance_progress' );
		$this->assertIsArray( $progress );
		$this->assertArrayHasKey( 'processed', $progress );
		$this->assertArrayHasKey( 'total', $progress );
		$this->assertGreaterThan( 0, $progress['processed'] );
	}

	/**
	 * Test scan completion
	 */
	public function test_scan_completion() {
		$post_id = self::factory()->post->create( array( 'post_status' => 'publish' ) );
		
		// Start and complete scan
		\WPMUDEV\PluginTest\App\Services\Posts_Maintenance::instance()->start_scan( array( 'post' ) );
		\WPMUDEV\PluginTest\App\Services\Posts_Maintenance::instance()->process_batch( array( 'post' ), 0 );
		\WPMUDEV\PluginTest\App\Services\Posts_Maintenance::instance()->complete_scan();
		
		// Verify scan is marked as complete
		$is_complete = get_option( 'wpmudev_posts_maintenance_complete' );
		$this->assertTrue( $is_complete );
		
		// Verify progress is cleared
		$progress = get_option( 'wpmudev_posts_maintenance_progress' );
		$this->assertFalse( $progress );
	}

	/**
	 * Test error handling for invalid post types
	 */
	public function test_invalid_post_types() {
		// Try to scan with invalid post type
		$result = \WPMUDEV\PluginTest\App\Services\Posts_Maintenance::instance()->start_scan( array( 'invalid_type' ) );
		
		// Should handle gracefully
		$this->assertIsArray( $result );
	}

	/**
	 * Test meta update with current timestamp
	 */
	public function test_meta_timestamp() {
		$post_id = self::factory()->post->create( array( 'post_status' => 'publish' ) );
		$before_time = time();
		
		// Process scan
		\WPMUDEV\PluginTest\App\Services\Posts_Maintenance::instance()->start_scan( array( 'post' ) );
		\WPMUDEV\PluginTest\App\Services\Posts_Maintenance::instance()->process_batch( array( 'post' ), 0 );
		
		$after_time = time();
		$meta = get_post_meta( $post_id, 'wpmudev_test_last_scan', true );
		
		// Verify timestamp is within expected range
		$this->assertGreaterThanOrEqual( $before_time, $meta );
		$this->assertLessThanOrEqual( $after_time, $meta );
	}
}
