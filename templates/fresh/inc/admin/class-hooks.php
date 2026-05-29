<?php
/**
 * Admin Hooks class
 *
 * @package {{packageName}}
 * @since 1.0
 */

declare(strict_types=1);

namespace {{namespace}}\ADMIN;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers all admin-side WordPress hooks for the plugin.
 */
final class Hooks {

	/**
	 * Constructor.
	 */
	public function __construct() {

		// Registers admin actions.
		$this->register_actions();
	}

	/**
	 * Register admin-side hooks.
	 *
	 * Block styles are loaded per block (and only when a block is present on
	 * the page) by WordPress from each block's block.json `style`/`editorStyle`
	 * entries, so no global stylesheet is enqueued here. Add plugin-wide admin
	 * hooks below.
	 *
	 * @return void
	 */
	public function register_actions(): void {
		// Example: enqueue the plugin's compiled admin assets.
		// add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) ).
	}
}
