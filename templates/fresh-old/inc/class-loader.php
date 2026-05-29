<?php
/**
 * Loader Class
 *
 * @package {{packageName}}
 * @since {{version}}
 */

namespace {{namespace}};

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Loader Class
 */
class Loader {

	/**
	 * Static Instance Holder
	 *
	 * @var Loader
	 */
	public static $instance = null;

	/**
	 * Constructor
	 */
	private function __construct() {

		// registers an autoloader for classes.
		$this->register_classes_autoloader();

		// loads all the files within 0 depth of inc folder.
		$this->include_functions_files();

		// bootstraping our theme.
		$this->bootstrap_plugin();
	}

	/**
	 * Instance.
	 *
	 * Singleton instance of our class
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @return Loader An instance of our class.
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Register autoloader.
	 *
	 * Loads all the classes.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function register_classes_autoloader() {
		require_once {{constantPrefix}}_PATH . '/inc/class-autoloader.php';
		Autoloader::run();
	}

	/**
	 * Include Functions Files
	 *
	 * Includes all the files that matches {*-functions.php} glob within inc/helpers folder
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function include_functions_files() {

		$files = glob( {{constantPrefix}}_PATH . '/inc/helpers/*-functions.php' );
		foreach ( $files as $file ) {
			require_once $file;
		}
	}

	/**
	 * Bootraps our theme
	 *
	 * Creating instances of classes and run functions required to setup our theme
	 *
	 * @return void
	 */
	private function bootstrap_plugin() {
		// bootstrapping admin class.
		$admin = new \{{namespace}}\ADMIN\Admin();
	}

	/**
	 * Clone.
	 *
	 * Disable class cloning and throw an error on object clone.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	public function __clone() {
		// Cloning instances of the class is forbidden.
		_doing_it_wrong( __FUNCTION__, esc_html__( 'Something went wrong.', '{{textDomain}}' ), '1.0.0' );
	}

	/**
	 * Wakeup.
	 *
	 * Disable unserializing of the class.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	public function __wakeup() {
		// Unserializing instances of the class is forbidden.
		_doing_it_wrong( __FUNCTION__, esc_html__( 'Something went wrong.', '{{textDomain}}' ), '1.0.0' );
	}
}
