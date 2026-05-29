<?php
/**
 * Settings page (admin UI) class
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
 * Registers the admin menu and renders the React-powered settings screen.
 *
 * Only the UI lives here — the option itself is registered separately by
 * {@see \{{constantPrefix}}\SETTINGS\Settings} so it is available in REST requests
 * too. The page is a single mount node; the compiled React app
 * (`assets/js/settings.js`) reads and writes the option through core's
 * `/wp/v2/settings` endpoint.
 */
final class Settings_Page {

	/**
	 * Top-level menu / first submenu slug.
	 *
	 * @var string
	 */
	private const MENU_SLUG = 'stacker';

	/**
	 * Script/style handle for the settings app assets.
	 *
	 * @var string
	 */
	private const ASSET_HANDLE = 'stacker-settings';

	/**
	 * Hook suffix returned by add_menu_page(), used to scope asset loading to
	 * this screen only.
	 *
	 * @var string
	 */
	private string $hook_suffix = '';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->register_actions();
	}

	/**
	 * Register admin-side hooks for the settings page.
	 *
	 * @return void
	 */
	public function register_actions(): void {
		add_action( 'admin_menu', array( $this, 'register_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Registers the top-level "Stacker" menu and its first "Settings" submenu.
	 *
	 * The top-level menu intentionally leaves room for additional pages; the
	 * matching submenu slug relabels the auto-created first item to "Settings".
	 *
	 * @return void
	 */
	public function register_menu(): void {
		$this->hook_suffix = (string) add_menu_page(
			__( 'Stacker', '{{textDomain}}' ),
			__( 'Stacker', '{{textDomain}}' ),
			'manage_options',
			self::MENU_SLUG,
			array( $this, 'render_page' ),
			'dashicons-admin-generic'
		);

		add_submenu_page(
			self::MENU_SLUG,
			__( 'Settings', '{{textDomain}}' ),
			__( 'Settings', '{{textDomain}}' ),
			'manage_options',
			self::MENU_SLUG,
			array( $this, 'render_page' )
		);
	}

	/**
	 * Renders the page container the React app mounts into.
	 *
	 * @return void
	 */
	public function render_page(): void {
		echo '<div class="wrap"><div id="stacker-settings-root"></div></div>';
	}

	/**
	 * Enqueues the compiled settings app on its own screen only.
	 *
	 * Reads the wp-scripts-generated `.asset.php` manifest so core's bundled
	 * React, components, api-fetch, etc. are loaded as dependencies rather than
	 * shipped in the bundle.
	 *
	 * @param string $hook_suffix Current admin page hook suffix.
	 * @return void
	 */
	public function enqueue_assets( string $hook_suffix ): void {
		if ( $hook_suffix !== $this->hook_suffix ) {
			return;
		}

		$asset_file = {{constantPrefix}}_PATH . 'assets/js/settings.asset.php';
		$asset      = is_readable( $asset_file )
			? require $asset_file
			: array(
				'dependencies' => array(),
				'version'      => {{constantPrefix}}_VERSION,
			);

		// Media library scripts, used by the settings page's media field.
		wp_enqueue_media();

		wp_enqueue_script(
			self::ASSET_HANDLE,
			{{constantPrefix}}_ASSETS . 'js/settings.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		// Core's component styles so the controls look native.
		wp_enqueue_style( 'wp-components' );

		$style_file = {{constantPrefix}}_PATH . 'assets/css/settings.css';
		if ( is_readable( $style_file ) ) {
			wp_enqueue_style(
				self::ASSET_HANDLE,
				{{constantPrefix}}_ASSETS . 'css/settings.css',
				array( 'wp-components' ),
				$asset['version']
			);
		}
	}
}
