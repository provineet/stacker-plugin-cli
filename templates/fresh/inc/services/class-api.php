<?php
/**
 * API service
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
 * Service for registering this plugin's REST API routes.
 */
final class API {

	/**
	 * REST namespace for this plugin's routes.
	 *
	 * @var string
	 */
	private const REST_NAMESPACE = 'stacker/v1';

	/**
	 * Hooks the route registration onto the REST API init action.
	 *
	 * @return void
	 */
	public function register_routes(): void {
		// Example: hook a `register()` method that calls register_rest_route()
		// onto the rest_api_init action, using self::REST_NAMESPACE.
	}
}
