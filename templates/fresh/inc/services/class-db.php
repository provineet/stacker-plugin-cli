<?php
/**
 * Database service
 *
 * @package {{packageName}}
 * @since 1.0
 */

declare(strict_types=1);

namespace {{namespace}}\SERVICES;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Thin wrapper around $wpdb for the plugin's database access.
 *
 * Centralising $wpdb here keeps prepared statements and table naming in one
 * place — never concatenate untrusted input into SQL; always use
 * `$this->wpdb->prepare()`.
 */
final class DB {

	/**
	 * WordPress database abstraction object.
	 *
	 * @var \wpdb
	 */
	private readonly \wpdb $wpdb;

	/**
	 * Constructor.
	 */
	public function __construct() {
		global $wpdb;

		$this->wpdb = $wpdb;
	}
}
