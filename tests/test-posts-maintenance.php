<?php
/**
 * @group posts-maintenance
 */

class Tests_Posts_Maintenance extends WP_UnitTestCase {
	public function test_scan_updates_meta() {
		$post_id = self::factory()->post->create( array( 'post_status' => 'publish' ) );
		\WPMUDEV\PluginTest\App\Services\Posts_Maintenance::instance()->start_scan( array( 'post' ) );
		// Directly trigger one batch to simulate cron.
		\WPMUDEV\PluginTest\App\Services\Posts_Maintenance::instance()->process_batch( array( 'post' ), 0 );
		$meta = get_post_meta( $post_id, 'wpmudev_test_last_scan', true );
		$this->assertNotEmpty( $meta );
		$this->assertIsNumeric( $meta );
	}
}
