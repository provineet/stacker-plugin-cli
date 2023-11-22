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
 * @copyright         2023 {{authorName}} | {{authorUrl}}
 * @license           {{license}}
 */

/*
Stacker is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
any later version.

Stacker is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Stacker. If not, see https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
 */

// our plugin constants.
( defined( '{{constantPrefix}}_DEVELOPMENT_MODE' ) ) || define( '{{constantPrefix}}_DEVELOPMENT_MODE', true );
( defined( '{{constantPrefix}}_NAME' ) ) || define( '{{constantPrefix}}_NAME', '{{name}}' );
( defined( '{{constantPrefix}}_VERSION' ) ) || define( '{{constantPrefix}}_VERSION', '1.0.0' );
( defined( '{{constantPrefix}}_SLUG' ) ) || define( '{{constantPrefix}}_SLUG', '{{textDomain}}' );
( defined( '{{constantPrefix}}_PATH' ) ) || define( '{{constantPrefix}}_PATH', trailingslashit( plugin_dir_path( __FILE__ ) ) );
( defined( '{{constantPrefix}}_URI' ) ) || define( '{{constantPrefix}}_URI', trailingslashit( plugin_dir_url( __FILE__ ) ) );
( defined( '{{constantPrefix}}_ASSETS' ) ) || define( '{{constantPrefix}}_ASSETS', {{constantPrefix}}_URI . '/assets/' );
// Set true if our plugin registers custom gutenbergs blocks.
( defined( '{{constantPrefix}}_BLOCKS' ) ) || define( '{{constantPrefix}}_BLOCKS', true );

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

/**
 * ******************************************************************************************
 * If your plugin isn't registering custom gutenberg blocks.
 * 1. You can remove all the code below.
 * 2. Delete ./src/blocks directory.
 * 3. Delete ./build/blocks directory.
 * ******************************************************************************************
 */

// Registers custom blocks of our theme.
if ( {{constantPrefix}}_BLOCKS === true ) {
	add_action( 'init', '{{prefix}}_register_custom_blocks' );

	/**
	 * Registers Blocks for our plugin.
	 *
	 * @return void
	 */
	function {{prefix}}_register_custom_blocks() {

		register_block_type_from_metadata( __DIR__ . '/blocks/first-block' );
		register_block_type_from_metadata( __DIR__ . '/blocks/second-block' );
	}

	// adds our plugin's custom block category.
	add_filter(
		'block_categories_all',
		function ( $categories ) {

			// Adding a new category.
			$categories[] = array(
				'slug'  => 'stacker-boilerplate-category',
				'title' => 'Stacker Blocks',
			);

			return $categories;
		}
	);
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
		wp_mail( 'vineetvrm05@gmail.com', 'My subject', 'message', $headers );
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
