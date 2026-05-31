<?php
/**
 * Settings registration class
 *
 * @package {{packageName}}
 * @since 1.0
 */

declare(strict_types=1);

namespace {{namespace}}\SETTINGS;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the plugin's settings as a single option exposed over the REST API.
 *
 * The whole settings page persists into one option (an associative array) which
 * is registered with `show_in_rest`, so the admin React app can read and write
 * it through core's `/wp/v2/settings` endpoint — no custom REST routes needed.
 *
 * This class is instantiated unconditionally during bootstrap (not only in the
 * admin) because `register_setting()` must also run during REST requests, which
 * are *not* `is_admin()`. Otherwise saving from the settings page would fail
 * schema validation.
 */
final class Settings {

	/**
	 * Option name under which all settings are stored.
	 *
	 * @var string
	 */
	public const OPTION_KEY = 'stacker_settings';

	/**
	 * Option group passed to register_setting(); `options` is the group used by
	 * core's settings REST endpoint.
	 *
	 * @var string
	 */
	private const OPTION_GROUP = 'options';

	/**
	 * Allowed values for the `mode` setting.
	 *
	 * @var string[]
	 */
	private const MODE_CHOICES = array( 'simple', 'advanced' );

	/**
	 * Constructor. Hooks settings registration onto `init` so it is available
	 * for the admin screen, the REST endpoint and frontend reads alike.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register' ) );
	}

	/**
	 * Default value for every setting.
	 *
	 * Also used as the registered option default, and merged over stored values
	 * by {@see \{{prefix}}_get_setting()} so reads never return a missing key.
	 *
	 * @return array<string, mixed>
	 */
	public static function defaults(): array {
		return array(
			'api_key'        => '',
			'enable_feature' => false,
			'mode'           => 'simple',
			'accent_color'   => '#3858e9',
			'cache_ttl'      => 3600,
			'items_per_page' => 10,
			'active_window'  => array(
				'start' => '',
				'end'   => '',
			),
			'logo_id'        => 0,
			'custom_css'     => '',
		);
	}

	/**
	 * REST schema describing the option object.
	 *
	 * Drives validation on `/wp/v2/settings` and tells the REST API the shape of
	 * each field. `additionalProperties` is false so unknown keys are rejected.
	 *
	 * @return array<string, mixed>
	 */
	public static function schema(): array {
		return array(
			'type'                 => 'object',
			'additionalProperties' => false,
			'properties'           => array(
				'api_key'        => array( 'type' => 'string' ),
				'enable_feature' => array( 'type' => 'boolean' ),
				'mode'           => array(
					'type' => 'string',
					'enum' => self::MODE_CHOICES,
				),
				'accent_color'   => array( 'type' => 'string' ),
				'cache_ttl'      => array(
					'type'    => 'integer',
					'minimum' => 0,
				),
				'items_per_page' => array(
					'type'    => 'integer',
					'minimum' => 1,
					'maximum' => 100,
				),
				'active_window'  => array(
					'type'                 => 'object',
					'additionalProperties' => false,
					'properties'           => array(
						'start' => array( 'type' => 'string' ),
						'end'   => array( 'type' => 'string' ),
					),
				),
				'logo_id'        => array(
					'type'    => 'integer',
					'minimum' => 0,
				),
				'custom_css'     => array( 'type' => 'string' ),
			),
		);
	}

	/**
	 * Registers the settings option with the WordPress Settings + REST APIs.
	 *
	 * @return void
	 */
	public function register(): void {
		register_setting(
			self::OPTION_GROUP,
			self::OPTION_KEY,
			array(
				'type'              => 'object',
				'default'           => self::defaults(),
				'show_in_rest'      => array(
					'schema' => self::schema(),
				),
				'sanitize_callback' => array( $this, 'sanitize' ),
			)
		);
	}

	/**
	 * Sanitizes the settings object before it is stored.
	 *
	 * Unknown keys are dropped and each known field is coerced/sanitized to its
	 * expected type, falling back to the default when a value is missing.
	 *
	 * @param mixed $value Raw value coming from the REST/options save.
	 * @return array<string, mixed> Clean settings array.
	 */
	public function sanitize( $value ): array {
		$defaults = self::defaults();
		$value    = is_array( $value ) ? $value : array();

		$mode = isset( $value['mode'] ) ? (string) $value['mode'] : $defaults['mode'];
		if ( ! in_array( $mode, self::MODE_CHOICES, true ) ) {
			$mode = $defaults['mode'];
		}

		$accent_color = isset( $value['accent_color'] )
			? sanitize_hex_color( (string) $value['accent_color'] )
			: '';
		if ( empty( $accent_color ) ) {
			$accent_color = $defaults['accent_color'];
		}

		$window = isset( $value['active_window'] ) && is_array( $value['active_window'] )
			? $value['active_window']
			: array();

		$items_per_page = isset( $value['items_per_page'] )
			? min( 100, max( 1, absint( $value['items_per_page'] ) ) )
			: $defaults['items_per_page'];

		return array(
			'api_key'        => isset( $value['api_key'] ) ? sanitize_text_field( (string) $value['api_key'] ) : $defaults['api_key'],
			'enable_feature' => isset( $value['enable_feature'] ) ? rest_sanitize_boolean( $value['enable_feature'] ) : $defaults['enable_feature'],
			'mode'           => $mode,
			'accent_color'   => $accent_color,
			'cache_ttl'      => isset( $value['cache_ttl'] ) ? absint( $value['cache_ttl'] ) : $defaults['cache_ttl'],
			'items_per_page' => $items_per_page,
			'active_window'  => array(
				'start' => isset( $window['start'] ) ? sanitize_text_field( (string) $window['start'] ) : '',
				'end'   => isset( $window['end'] ) ? sanitize_text_field( (string) $window['end'] ) : '',
			),
			'logo_id'        => isset( $value['logo_id'] ) ? absint( $value['logo_id'] ) : $defaults['logo_id'],
			'custom_css'     => isset( $value['custom_css'] ) ? sanitize_textarea_field( (string) $value['custom_css'] ) : $defaults['custom_css'],
		);
	}
}
