<?php
/**
 * Google Drive API Authentication Tests
 * 
 * @group api-auth
 */
class TestAPIAuth extends WP_Test_REST_TestCase {

	/**
	 * Test that auth URL endpoint is registered
	 */
	public function test_get_auth_url() {
		$request  = new WP_REST_Request( 'GET', '/wpmudev/v1/drive/auth' );
		$response = rest_get_server()->dispatch( $request );
		$error    = $response->as_error();

		// Should return error without proper params
		$this->assertWPError( $error );

		// But endpoint should be registered (not "not found")
		$this->assertNotSame( 'rest_no_route', $error->get_error_code() );
	}

	/**
	 * Test credentials save endpoint
	 */
	public function test_save_credentials() {
		$request = new WP_REST_Request( 'POST', '/wpmudev/v1/drive/save-credentials' );
		$request->set_param( 'client_id', 'test-client-id' );
		$request->set_param( 'client_secret', 'test-client-secret' );
		$request->set_param( '_wpnonce', wp_create_nonce( 'wp_rest' ) );

		$response = rest_get_server()->dispatch( $request );
		$data = $response->get_data();

		$this->assertArrayHasKey( 'success', $data );
		$this->assertTrue( $data['success'] );
	}

	/**
	 * Test credentials save without nonce (should fail)
	 */
	public function test_save_credentials_without_nonce() {
		$request = new WP_REST_Request( 'POST', '/wpmudev/v1/drive/save-credentials' );
		$request->set_param( 'client_id', 'test-client-id' );
		$request->set_param( 'client_secret', 'test-client-secret' );

		$response = rest_get_server()->dispatch( $request );
		$error = $response->as_error();

		$this->assertWPError( $error );
		$this->assertSame( 'invalid_nonce', $error->get_error_code() );
	}

	/**
	 * Test files list endpoint
	 */
	public function test_get_files() {
		$request = new WP_REST_Request( 'GET', '/wpmudev/v1/drive/files' );
		$response = rest_get_server()->dispatch( $request );
		$error = $response->as_error();

		// Should return error without authentication
		$this->assertWPError( $error );
		$this->assertNotSame( 'rest_no_route', $error->get_error_code() );
	}

	/**
	 * Test disconnect endpoint
	 */
	public function test_disconnect() {
		$request = new WP_REST_Request( 'POST', '/wpmudev/v1/drive/disconnect' );
		$request->set_param( '_wpnonce', wp_create_nonce( 'wp_rest' ) );

		$response = rest_get_server()->dispatch( $request );
		$data = $response->get_data();

		$this->assertArrayHasKey( 'success', $data );
		$this->assertTrue( $data['success'] );
	}

	/**
	 * Test download URL endpoint
	 */
	public function test_get_download_url() {
		$request = new WP_REST_Request( 'GET', '/wpmudev/v1/drive/download-url' );
		$request->set_param( 'file_id', 'test-file-id' );
		
		$response = rest_get_server()->dispatch( $request );
		$error = $response->as_error();

		// Should return error without authentication
		$this->assertWPError( $error );
		$this->assertNotSame( 'rest_no_route', $error->get_error_code() );
	}
}
