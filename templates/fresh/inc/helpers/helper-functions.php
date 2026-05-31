<?php
/**
 * Plugin's helpers functions
 *
 * @package {{packageName}}
 * @since 1.0
 */

declare(strict_types=1);

use {{constantPrefix}}\SETTINGS\Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! function_exists( '{{prefix}}_get_setting' ) ) {
	/**
	 * Reads a single value from the plugin's settings option.
	 *
	 * All settings live in one option ({@see Settings::OPTION_KEY}); the stored
	 * array is merged over {@see Settings::defaults()} so a known key is never
	 * missing — even before the settings page has been saved for the first time.
	 *
	 * @param string $key      Setting key to read.
	 * @param mixed  $fallback Value to return when the key is unknown (i.e. not a
	 *                         registered setting). Defaults to null.
	 * @return mixed The setting value, or $fallback for an unrecognised key.
	 */
	function {{prefix}}_get_setting( string $key, mixed $fallback = null ): mixed {
		$settings = wp_parse_args(
			(array) get_option( Settings::OPTION_KEY, array() ),
			Settings::defaults()
		);

		return array_key_exists( $key, $settings ) ? $settings[ $key ] : $fallback;
	}
}

if ( ! function_exists( '{{prefix}}_dd' ) ) {
	/**
	 * Dumps the passed variable.
	 *
	 * No-op unless the plugin is in development mode, so it is safe to leave in
	 * place — it will never leak output on production.
	 *
	 * @param mixed $variable  The variable to dump.
	 * @param bool  $terminate Whether to die() after dumping.
	 * @return void
	 */
	function {{prefix}}_dd( mixed $variable, bool $terminate = false ): void {
		if ( ! {{constantPrefix}}_DEVELOPMENT_MODE ) {
			return;
		}

		echo '<pre>';
		// phpcs:ignore
		var_dump( $variable );
		echo '</pre>';

		if ( true === $terminate ) {
			die();
		}
	}
}
