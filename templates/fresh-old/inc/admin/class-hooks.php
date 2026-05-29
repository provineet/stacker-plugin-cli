<?php
/**
 * Admin Hooks class
 *
 * @package {{packageName}}
 * @since {{version}}
 */

namespace {{namespace}}\ADMIN;

/**
 * Undocumented class
 */
class Hooks {

	/**
	 * Undocumented function
	 */
	public function __construct() {

		// registers admin actions.
		$this->register_actions();
	}

	/**
	 * Undocumented function
	 *
	 * @return void
	 */
	public function register_actions() {
		/**
		 * Register and enqueue common blocks styles in editor and frontend both.
		 * Common blocks styles are the common styles that are shared by all the blocks.
		 */
		add_action( 'enqueue_block_assets', array( $this, '{{prefix}}_enqueue_blocks_styles' ) );
	}

	/**
	 * Undocumented function
	 *
	 * @return void
	 */
	public function {{prefix}}_enqueue_blocks_styles() {
		if ( is_admin() ) {
			wp_enqueue_style( '{{prefix}}-blocks-editor', {{constantPrefix}}_ASSETS . 'css/editor_blocks.css', array(), filemtime( {{constantPrefix}}_PATH . 'assets/css/editor_blocks.css' ) );
		}
		wp_enqueue_style( '{{prefix}}-blocks-styles', {{constantPrefix}}_ASSETS . 'css/frontend_blocks.css', array(), filemtime( {{constantPrefix}}_PATH . 'assets/css/frontend_blocks.css' ) );
	}
}
