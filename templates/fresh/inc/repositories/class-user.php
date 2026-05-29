<?php
/**
 * User repository
 *
 * @package {{packageName}}
 * @since 1.0
 */

declare(strict_types=1);

namespace {{namespace}}\REPOSITORIES;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Repository for reading and writing user data.
 *
 * Keeps all user-related data access in one place so the rest of the plugin
 * never talks to WordPress user APIs directly.
 */
final class User {

	/**
	 * Finds a user by ID.
	 *
	 * @param int $user_id User ID.
	 * @return \WP_User|null The user, or null when not found.
	 */
	public function find( int $user_id ): ?\WP_User {
		$user = get_user_by( 'id', $user_id );

		return $user instanceof \WP_User ? $user : null;
	}
}
