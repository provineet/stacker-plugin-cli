<?php
/**
 * Admin class
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
 * Entry point for all admin-side functionality.
 */
final class Admin {

	/**
	 * Constructor.
	 *
	 * @param Hooks         $hooks         Admin hooks handler.
	 * @param Settings_Page $settings_page Settings page (admin menu + assets).
	 */
	public function __construct(
		private readonly Hooks $hooks = new Hooks(),
		private readonly Settings_Page $settings_page = new Settings_Page()
	) {}
}
