<?php
/**
 * {{name}}
 *
 * @wordpress-plugin
 * Plugin Name:       {{name}}
 * Plugin URI:        {{pluginUrl}}
 * Description:       {{description}}
 * Version:           {{version}}
 * Requires at least: {{reqWP}}
 * Requires PHP:      {{reqPHP}}
 * Author:            {{authorName}}
 * Author URI:        {{authorUrl}}
 * Text Domain:       {{textDomain}}
 * License:           {{license}}
 * License URI:       http://www.gnu.org/licenses/gpl-3.0.txt
 *
 * @package           {{packageName}}
 *
 * @author            {{authorName}}
 * @copyright         {{year}} {{authorName}} | {{authorUrl}}
 * @license           {{license}}
 */

/*
{{name}} is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
any later version.

{{name}} is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with {{name}}. If not, see https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
 */

// our plugin constants.
( defined( '{{constantPrefix}}_DEVELOPMENT_MODE' ) ) || define( '{{constantPrefix}}_DEVELOPMENT_MODE', true );
( defined( '{{constantPrefix}}_NAME' ) ) || define( '{{constantPrefix}}_NAME', '{{name}}' );
( defined( '{{constantPrefix}}_VERSION' ) ) || define( '{{constantPrefix}}_VERSION', '1.0.0' );
( defined( '{{constantPrefix}}_SLUG' ) ) || define( '{{constantPrefix}}_SLUG', '{{textDomain}}' );
( defined( '{{constantPrefix}}_PATH' ) ) || define( '{{constantPrefix}}_PATH', trailingslashit( plugin_dir_path( __FILE__ ) ) );
( defined( '{{constantPrefix}}_URI' ) ) || define( '{{constantPrefix}}_URI', trailingslashit( plugin_dir_url( __FILE__ ) ) );
( defined( '{{constantPrefix}}_ASSETS' ) ) || define( '{{constantPrefix}}_ASSETS', {{constantPrefix}}_URI . '/assets/' );

/**
 * Plugin activation callback
 *
 * @return void
 */
function {{prefix}}_activate() {
	// runs on plugin activation actions.
}

register_activation_hook( __FILE__, '{{prefix}}_activate' );

/**
 * Plugin deactivation callback
 *
 * @return void
 */
function {{prefix}}_deactivate() {
	// runs on plugin activation actions.
}

register_deactivation_hook( __FILE__, '{{prefix}}_deactivate' );


// Require Composer Vendor directory autoloader if present.
if ( is_readable( {{constantPrefix}}_PATH . '/vendor/autoload.php' ) ) {
	require_once {{constantPrefix}}_PATH . '/vendor/autoload.php';
}

// Registering our plugin autoloaders.
if ( is_readable( {{constantPrefix}}_PATH . '/inc/class-loader.php' ) ) {
	require_once {{constantPrefix}}_PATH . '/inc/class-loader.php';
	\{{namespace}}\Loader::instance();
}

// Below code adds mailcatcher for docker compose.
// IMPORTANT: Below code should be removed if you're not running 'docker compose up'.
// Below code is an to for mailcatcher container.
if ( true === {{constantPrefix}}_DEVELOPMENT_MODE ) {
	add_action( 'plugins_loaded', '{{prefix}}_send_mail', 1000 );
	/**
	 * Sends a testing mail to mailcatcher
	 *
	 * @return void
	 */
	function {{prefix}}_send_mail() {
		$headers[] = 'From: WordPress<wordpress@mysite.com>';
		wp_mail( '{{authorEmail}}', 'My subject', 'message', $headers );
	}

	add_action( 'phpmailer_init', '{{prefix}}_mailer_config', 10, 1 );
	/**
	 * Sets PHPMailer for Mailcatcher Settings
	 *
	 * @param PHPMAILER $mailer php mailer class object.
	 * @return void
	 */
	function {{prefix}}_mailer_config( $mailer ) {
		$mailer->IsSMTP();
		// phpcs:disable
		$mailer->Host      = 'mailcatcher'; // your SMTP server
		$mailer->Port      = 1025;
		$mailer->SMTPDebug = 0; // write 0 if you don't want to see client/server communication in page
		$mailer->CharSet   = 'utf-8';
		// phpcs:enable
	}
}
