<?php
/**
 * Special Class Autoloader
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
 * PSR-style autoloader that maps namespaced class names to WordPress-style
 * `class-{name}.php` files under the plugin's `inc` directory.
 */
final class Autoloader {

	/**
	 * Holds map of the classes.
	 *
	 * Keys are class names relative to the default namespace; values are paths
	 * relative to the default path.
	 *
	 * @var array<string, string>|null
	 */
	private static ?array $classes_map = null;

	/**
	 * Default path to the classes folder.
	 *
	 * @var string
	 */
	private static string $default_path = '';

	/**
	 * Default namespace for the classes.
	 *
	 * @var string
	 */
	private static string $default_namespace = '';

	/**
	 * Registers Special Autoloader.
	 *
	 * Register a function as `__autoload()` implementation.
	 *
	 * @param string $default_path      path of the classes folder.
	 * @param string $default_namespace default namespace.
	 */
	public static function run( string $default_path = '', string $default_namespace = '' ): void {
		self::$default_path      = '' === $default_path ? {{constantPrefix}}_PATH . 'inc/' : trailingslashit( $default_path );
		self::$default_namespace = '' === $default_namespace ? __NAMESPACE__ : $default_namespace;

		spl_autoload_register( array( __CLASS__, 'autoload' ) );
	}

	/**
	 * Returns the classes map.
	 *
	 * @return array<string, string> classes map.
	 */
	public static function get_classes_map(): array {
		return self::$classes_map ??= self::init_classes_map();
	}

	/**
	 * Initializes a classes map.
	 *
	 * @return array<string, string>
	 */
	private static function init_classes_map(): array {
		return array(
			// Your classmap entry goes here, e.g. 'ADMIN\Admin' => 'admin/class-admin.php'.
		);
	}

	/**
	 * Load class.
	 *
	 * For a given class name (relative to the default namespace), require the
	 * class file.
	 *
	 * @since  {{version}}
	 * @access private
	 * @static
	 *
	 * @param string $relative_class_name Class name relative to the default namespace.
	 */
	private static function load_class( string $relative_class_name ): void {

		$classes_map = self::get_classes_map();

		if ( isset( $classes_map[ $relative_class_name ] ) ) {
			$filename = self::$default_path . $classes_map[ $relative_class_name ];
		} else {
			$filename = strtolower(
				preg_replace(
					array( '/([a-z])([A-Z])/', '/_/', '/\\\/', '/^(.+)\/(.*)$/' ),
					array( '$1-$2', '-', DIRECTORY_SEPARATOR, '$1/class-$2' ),
					$relative_class_name
				)
			);

			$filename = self::$default_path . $filename . '.php';
		}

		if ( is_readable( $filename ) ) {
			include_once $filename;
		}
	}

	/**
	 * Autoloads the class.
	 *
	 * For a given class, check if it belongs to our namespace and load it.
	 *
	 * @since  {{version}}
	 * @access private
	 * @static
	 *
	 * @param string $class_name Class Name to be loaded.
	 */
	private static function autoload( string $class_name ): void {

		// Move to the next autoloader if class doesn't belong to the default_namespace.
		if ( ! str_starts_with( $class_name, self::$default_namespace . '\\' ) ) {
			return;
		}

		// Already loaded — nothing to do (pass false to avoid re-triggering autoload).
		if ( class_exists( $class_name, false ) || interface_exists( $class_name, false ) || enum_exists( $class_name, false ) ) {
			return;
		}

		// Strip the default namespace prefix to get the relative class name.
		$relative_class_name = substr( $class_name, strlen( self::$default_namespace ) + 1 );

		self::load_class( $relative_class_name );
	}
}
