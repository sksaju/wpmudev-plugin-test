<?php
/**
 * Posts Maintenance service: scan posts/pages and update meta.
 *
 * @package WPMUDEV\PluginTest
 */

namespace WPMUDEV\PluginTest\App\Services;

use WPMUDEV\PluginTest\Base;

defined( 'WPINC' ) || die;

class Posts_Maintenance extends Base {
    /**
     * Action hook for batch processing.
     *
     * @var string
     */
    private $action_hook = 'wpmudev_plugintest_posts_scan_batch';

    /**
     * Initialize hooks.
     */
    public function init() {
        add_action( 'admin_init', array( $this, 'maybe_schedule_daily' ) );
        add_action( $this->action_hook, array( $this, 'process_batch' ), 10, 2 );
    }

    /**
     * Ensure a daily cron is set.
     */
    public function maybe_schedule_daily() {
        if ( ! wp_next_scheduled( 'wpmudev_plugintest_daily_posts_scan' ) ) {
            wp_schedule_event( time() + HOUR_IN_SECONDS, 'daily', 'wpmudev_plugintest_daily_posts_scan' );
        }
        add_action( 'wpmudev_plugintest_daily_posts_scan', function () {
            $this->start_scan();
        } );
    }

    /**
     * Kick off background scan.
     *
     * @param array $post_types Optional list of post types.
     */
    public function start_scan( array $post_types = array() ) {
        $post_types = $this->normalize_post_types( $post_types );
        $state      = array(
            'post_types' => $post_types,
            'offset'     => 0,
            'processed'  => 0,
        );
        // Store progress transient for basic feedback.
        set_transient( 'wpmudev_plugintest_scan_state', $state, HOUR_IN_SECONDS );
        // Queue first batch.
        do_action( $this->action_hook, $post_types, 0 );
    }

    /**
     * Process a batch of posts.
     *
     * @param array $post_types Post types.
     * @param int   $offset     Query offset.
     */
    public function process_batch( $post_types, $offset ) {
        $post_types = $this->normalize_post_types( (array) $post_types );
        $batch_size = 50;
        $q          = new \WP_Query( array(
            'post_type'      => $post_types,
            'post_status'    => array( 'publish' ),
            'posts_per_page' => $batch_size,
            'offset'         => (int) $offset,
            'fields'         => 'ids',
            'no_found_rows'  => true,
        ) );

        if ( empty( $q->posts ) ) {
            // Mark done.
            delete_transient( 'wpmudev_plugintest_scan_state' );
            return;
        }

        foreach ( $q->posts as $post_id ) {
            update_post_meta( $post_id, 'wpmudev_test_last_scan', time() );
        }

        $state = get_transient( 'wpmudev_plugintest_scan_state' );
        if ( is_array( $state ) ) {
            $state['processed'] += count( $q->posts );
            $state['offset']     = (int) $offset + $batch_size;
            set_transient( 'wpmudev_plugintest_scan_state', $state, HOUR_IN_SECONDS );
        }

        // Queue next batch shortly to avoid blocking requests.
        wp_schedule_single_event( time() + 5, $this->action_hook, array( $post_types, (int) $offset + $batch_size ) );
    }

    /**
     * Get progress state.
     *
     * @return array
     */
    public function get_progress() {
        $state = get_transient( 'wpmudev_plugintest_scan_state' );
        return is_array( $state ) ? $state : array( 'done' => true );
    }

    /**
     * Normalize post types.
     *
     * @param array $post_types Input.
     * @return array
     */
    private function normalize_post_types( array $post_types ) {
        if ( empty( $post_types ) ) {
            $post_types = array( 'post', 'page' );
        }
        $post_types = array_values( array_filter( array_map( 'sanitize_key', $post_types ) ) );
        return $post_types;
    }
}
