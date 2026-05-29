<?php
/**
 * Plugin Name: Dev Mail From Override (must-use)
 * Description: Forces a valid wp_mail() From address in the local Docker dev
 *   stack. The site runs at http://localhost:10008, so WordPress derives its
 *   default sender as "wordpress@localhost". PHPMailer validates that against
 *   FILTER_VALIDATE_EMAIL, which rejects a bare hostname with no TLD, so every
 *   wp_mail() call (password reset, new-user notifications, etc.) fails with
 *   "The email could not be sent." before it ever reaches msmtp/Mailpit.
 *
 *   We override the sender with a valid address whose domain matches the msmtp
 *   envelope --from in docker-configs/sendmail.ini. Dev only — this file is
 *   bind-mounted into wp-content/mu-plugins by docker-compose.yaml and is never
 *   part of a real deployment.
 *
 * @package stacker-boilerplate
 */

defined( 'ABSPATH' ) || exit;

add_filter(
	'wp_mail_from',
	static function ( $from ) {
		// Only rescue the broken default; respect any explicitly valid address.
		if ( ! is_email( $from ) ) {
			return 'wordpress@stacker.test';
		}
		return $from;
	}
);

add_filter(
	'wp_mail_from_name',
	static function ( $name ) {
		return ( '' === $name || 'WordPress' === $name ) ? 'Stacker Dev' : $name;
	}
);
