<?php
/**
 * Fired when the plugin is uninstalled (deleted) from the WordPress admin.
 *
 * Use this file to remove any data the plugin created — options, custom tables,
 * scheduled events, post meta, etc. It runs only on deletion, never on
 * deactivation, so it is the only safe place to destroy user data.
 *
 * @package {{packageName}}
 * @since 1.0
 */

declare(strict_types=1);

// Exit if WordPress did not call this file as part of an uninstall.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

/*
 * Example clean-up — uncomment and adapt to match the data your plugin stores:
 *
 * delete_option( '{{prefix}}_settings' );
 * delete_site_option( '{{prefix}}_network_settings' );
 *
 * global $wpdb;
 * $wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}{{prefix}}_data" );
 */
