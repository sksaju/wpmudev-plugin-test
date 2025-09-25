<?php
namespace WPMUDEV\PluginTest\App\Admin_Pages;

use WPMUDEV\PluginTest\Base;
use WPMUDEV\PluginTest\App\Services\Posts_Maintenance;

defined( 'WPINC' ) || die;

class Posts_Maintenance_Page extends Base {
	private $page_slug = 'wpmudev_plugintest_posts_maintenance';

	public function init() {
		add_action( 'admin_menu', array( $this, 'register_page' ) );
	}

	public function register_page() {
		add_menu_page(
			__( 'Posts Maintenance', 'wpmudev-plugin-test' ),
			__( 'Posts Maintenance', 'wpmudev-plugin-test' ),
			'manage_options',
			$this->page_slug,
			array( $this, 'render' ),
			'dashicons-update',
			8
		);
	}

	public function render() {
		if ( isset( $_POST['wpmudev_scan_posts'] ) && check_admin_referer( 'wpmudev_scan_posts' ) && current_user_can( 'manage_options' ) ) {
			$post_types = isset( $_POST['post_types'] ) ? (array) $_POST['post_types'] : array();
			Posts_Maintenance::instance()->start_scan( $post_types );
			echo '<div class="updated"><p>' . esc_html__( 'Scan started in background.', 'wpmudev-plugin-test' ) . '</p></div>';
		}

		$public_types = get_post_types( array( 'public' => true ), 'objects' );
		?>
		<div class="wrap">
			<h1><?php echo esc_html__( 'Posts Maintenance', 'wpmudev-plugin-test' ); ?></h1>
			<form method="post">
				<?php wp_nonce_field( 'wpmudev_scan_posts' ); ?>
				<p><?php echo esc_html__( 'Select post types to scan:', 'wpmudev-plugin-test' ); ?></p>
				<?php foreach ( $public_types as $type ) : ?>
					<label><input type="checkbox" name="post_types[]" value="<?php echo esc_attr( $type->name ); ?>" /> <?php echo esc_html( $type->labels->name ); ?></label><br/>
				<?php endforeach; ?>
				<p><button class="button button-primary" type="submit" name="wpmudev_scan_posts" value="1"><?php echo esc_html__( 'Scan Posts', 'wpmudev-plugin-test' ); ?></button></p>
			</form>
			<hr/>
			<h2><?php echo esc_html__( 'Progress', 'wpmudev-plugin-test' ); ?></h2>
			<?php $state = Posts_Maintenance::instance()->get_progress(); ?>
			<pre><?php echo esc_html( wp_json_encode( $state ) ); ?></pre>
		</div>
		<?php
	}
}

