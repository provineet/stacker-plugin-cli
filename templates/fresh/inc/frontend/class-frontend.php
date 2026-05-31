<?php
/**
 * Frontend class
 *
 * @package {{packageName}}
 * @since 1.0
 */

declare(strict_types=1);

namespace {{namespace}}\Frontend;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Entry point for all public-facing (frontend) functionality.
 */
final class Frontend {

	/**
	 * Constructor.
	 */
	public function __construct() {

		// Registers frontend actions.
		$this->register_actions();
	}

	/**
	 * Register frontend-side hooks.
	 *
	 * @return void
	 */
	public function register_actions(): void {
		// Example: enqueue the plugin's compiled frontend assets.
		// add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) ).
	}
}
