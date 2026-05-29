<?php
/**
 * Plugin's helpers functions
 *
 * @package {{packageName}}
 * @since {{version}}
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Dumps the passed variable
 *
 * @param [any]   $variable string.
 * @param boolean $terminate die().
 * @return void
 */
function {{prefix}}_dd( $variable, $terminate = false ) {
	if ( ! {{constantPrefix}}_DEVELOPMENT_MODE ) {
		return;
	}
	echo '<pre>';
    // phpcs:ignore
	var_dump( $variable );
	echo '</pre>';

	( true === $terminate ) && die();
}
