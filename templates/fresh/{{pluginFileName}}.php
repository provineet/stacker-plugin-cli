<?php
/**
 * {{name}}
 *
 * @wordpress-plugin
 * Plugin Name:       {{name}}
 * Plugin URI:        {{authorUrl}}
 * Description:       {{description}}
 * Version:           {{version}}
 * Requires at least: {{reqWP}}
 * Requires PHP:      {{reqPHP}}
 * Author:            {{authorName}}
 * Author URI:        {{authorUrl}}
 * Text Domain:       {{textDomain}}
 * License:           {{license}}
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.html
 *
 * @package           {{packageName}}
 *
 * @author            {{authorName}}
 * @copyright         {{year}} {{authorName}} | {{authorUrl}}
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

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/*
 * Development mode toggle.
 *
 * Defaults to the site's environment type so production installs are never put
 * into development mode by accident. Override it by defining the constant in
 * wp-config.php before this plugin loads.
 */
defined( '{{constantPrefix}}_DEVELOPMENT_MODE' ) || define(
	'{{constantPrefix}}_DEVELOPMENT_MODE',
	in_array( wp_get_environment_type(), array( 'local', 'development' ), true )
);

// Our plugin constants.
defined( '{{constantPrefix}}_NAME' ) || define( '{{constantPrefix}}_NAME', '{{name}}' );
defined( '{{constantPrefix}}_VERSION' ) || define( '{{constantPrefix}}_VERSION', '{{version}}' );
defined( '{{constantPrefix}}_SLUG' ) || define( '{{constantPrefix}}_SLUG', '{{textDomain}}' );
defined( '{{constantPrefix}}_PATH' ) || define( '{{constantPrefix}}_PATH', trailingslashit( plugin_dir_path( __FILE__ ) ) );
defined( '{{constantPrefix}}_URI' ) || define( '{{constantPrefix}}_URI', trailingslashit( plugin_dir_url( __FILE__ ) ) );
defined( '{{constantPrefix}}_ASSETS' ) || define( '{{constantPrefix}}_ASSETS', {{constantPrefix}}_URI . 'assets/' );
// Set true if our plugin registers custom gutenberg blocks.
defined( '{{constantPrefix}}_BLOCKS' ) || define( '{{constantPrefix}}_BLOCKS', true );

/**
 * Plugin activation callback.
 *
 * @return void
 */
function {{prefix}}_activate(): void {
	// Runs on plugin activation. Flush rewrite rules here *after* registering
	// any custom post types or rewrite rules, e.g. flush_rewrite_rules().
}

register_activation_hook( __FILE__, '{{prefix}}_activate' );

/**
 * Plugin deactivation callback.
 *
 * @return void
 */
function {{prefix}}_deactivate(): void {
	// Runs on plugin deactivation. Clear scheduled events and flush rewrite
	// rules here. Do NOT delete user data on deactivation — use uninstall.php.
}

register_deactivation_hook( __FILE__, '{{prefix}}_deactivate' );


// Require Composer Vendor directory autoloader if present.
if ( is_readable( {{constantPrefix}}_PATH . 'vendor/autoload.php' ) ) {
	require_once {{constantPrefix}}_PATH . 'vendor/autoload.php';
}

// Registering our plugin autoloaders.
if ( is_readable( {{constantPrefix}}_PATH . 'inc/class-loader.php' ) ) {
	require_once {{constantPrefix}}_PATH . 'inc/class-loader.php';
	\{{constantPrefix}}\Loader::instance();
}

/**
 * ******************************************************************************************
 * If your plugin isn't registering custom gutenberg blocks.
 * 1. You can remove all the code below.
 * 2. Delete ./src/blocks directory.
 * 3. Delete ./build/blocks directory.
 * 4. Delete ./inc/enums/class-block.php.
 * ******************************************************************************************
 */

// Registers custom blocks of our theme.
if ( true === {{constantPrefix}}_BLOCKS ) {
	add_action( 'init', '{{prefix}}_register_custom_blocks' );

	/**
	 * Registers Blocks for our plugin.
	 *
	 * On WP 6.8+ the compiled `block.json` metadata is bulk-loaded from a single
	 * generated manifest (`blocks/blocks-manifest.php`) for performance, avoiding
	 * a filesystem read + JSON parse per block. We then register each block type.
	 *
	 * @return void
	 */
	function {{prefix}}_register_custom_blocks(): void {
		$blocks_dir = {{constantPrefix}}_PATH . 'blocks';

		// Bulk-register metadata from the manifest (WordPress 6.8+).
		if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
			$manifest = $blocks_dir . '/blocks-manifest.php';
			if ( is_readable( $manifest ) ) {
				wp_register_block_metadata_collection( $blocks_dir, $manifest );
			}
		}

		foreach ( \{{constantPrefix}}\Enums\Block::cases() as $block ) {
			register_block_type( $blocks_dir . '/' . $block->value );
		}
	}

	// Adds our plugin's custom block category.
	add_filter(
		'block_categories_all',
		static function ( array $categories ): array {
			$categories[] = array(
				'slug'  => '{{blockCategory}}',
				'title' => __( 'Stacker Blocks', '{{textDomain}}' ),
			);

			return $categories;
		}
	);
}

// Below code routes outgoing mail to the Mailcatcher container for local dev.
// IMPORTANT: Below code should be removed if you're not running 'docker compose up'.
if ( true === {{constantPrefix}}_DEVELOPMENT_MODE ) {
	add_action( 'phpmailer_init', '{{prefix}}_mailer_config', 10, 1 );
	/**
	 * Sets PHPMailer for Mailcatcher Settings
	 *
	 * @param \PHPMailer\PHPMailer\PHPMailer $mailer php mailer class object.
	 * @return void
	 */
	function {{prefix}}_mailer_config( $mailer ): void {
		$mailer->IsSMTP();
		// phpcs:disable
		$mailer->Host      = 'mailcatcher'; // your SMTP server
		$mailer->Port      = 1025;
		$mailer->SMTPDebug = 0; // write 0 if you don't want to see client/server communication in page
		$mailer->CharSet   = 'utf-8';
		// phpcs:enable
	}
}
