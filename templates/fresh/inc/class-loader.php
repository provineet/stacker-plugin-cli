<?php
/**
 * Loader Class
 *
 * @package {{packageName}}
 * @since 1.0
 */

declare(strict_types=1);

namespace {{namespace}};

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Bootstraps the plugin: registers the autoloader, loads helper functions and
 * wires up the admin/frontend classes.
 */
final class Loader {

	/**
	 * Static Instance Holder
	 *
	 * @var Loader|null
	 */
	public static ?Loader $instance = null;

	/**
	 * Constructor
	 */
	private function __construct() {

		// Registers an autoloader for classes.
		$this->register_classes_autoloader();

		// Loads all the files within 0 depth of inc folder.
		$this->include_functions_files();

		// Bootstrapping our plugin.
		$this->bootstrap_plugin();
	}

	/**
	 * Instance.
	 *
	 * Singleton instance of our class
	 *
	 * @since {{version}}
	 * @access public
	 * @static
	 *
	 * @return Loader An instance of our class.
	 */
	public static function instance(): Loader {
		return self::$instance ??= new self();
	}

	/**
	 * Register autoloader.
	 *
	 * Loads all the classes.
	 *
	 * @since {{version}}
	 * @access private
	 */
	private function register_classes_autoloader(): void {
		require_once {{constantPrefix}}_PATH . 'inc/class-autoloader.php';
		Autoloader::run();
	}

	/**
	 * Include Functions Files
	 *
	 * Includes all the files that matches {*-functions.php} glob within inc/helpers folder
	 *
	 * @since {{version}}
	 * @access private
	 */
	private function include_functions_files(): void {

		$files = glob( {{constantPrefix}}_PATH . 'inc/helpers/*-functions.php' );
		if ( false === $files ) {
			return;
		}

		foreach ( $files as $file ) {
			require_once $file;
		}
	}

	/**
	 * Bootstraps our plugin.
	 *
	 * Creates instances of the classes required to set up the plugin. Admin-only
	 * code stays behind is_admin() so it never runs on the frontend.
	 *
	 * @return void
	 */
	private function bootstrap_plugin(): void {
		// Register the settings option/REST schema everywhere — REST save
		// requests are not is_admin(), so this must run unconditionally.
		new SETTINGS\Settings();

		if ( is_admin() ) {
			new ADMIN\Admin();
		} else {
			new Frontend\Frontend();
		}
	}

	/**
	 * Clone.
	 *
	 * Disable class cloning and throw an error on object clone.
	 *
	 * @access public
	 * @since {{version}}
	 */
	public function __clone() {
		// Cloning instances of the class is forbidden.
		_doing_it_wrong( __FUNCTION__, esc_html__( 'Something went wrong.', '{{textDomain}}' ), '{{version}}' );
	}

	/**
	 * Wakeup.
	 *
	 * Disable unserializing of the class.
	 *
	 * @access public
	 * @since {{version}}
	 */
	public function __wakeup() {
		// Unserializing instances of the class is forbidden.
		_doing_it_wrong( __FUNCTION__, esc_html__( 'Something went wrong.', '{{textDomain}}' ), '{{version}}' );
	}
}
