<?php

/* Path to the WordPress codebase you'd like to test. Add a forward slash in the end. */
define( 'ABSPATH', dirname( __DIR__ ) . '/wordpress/' );

/*
 * Path to the theme to test with.
 *
 * The 'default' theme is symlinked from test/phpunit/data/themedir1/default into
 * the themes directory of the WordPress installation defined above.
 */
define( 'WP_DEFAULT_THEME', 'default' );

// Test with multisite enabled.
// Alternatively, use the tests/phpunit/multisite.xml configuration file.
// define( 'WP_TESTS_MULTISITE', true );

// Force known bugs to be run.
// Tests with an associated Trac ticket that is still open are normally skipped.
// define( 'WP_TESTS_FORCE_KNOWN_BUGS', true );

// Test with WordPress debug mode (default).
define( 'WP_DEBUG', true );

// ** MySQL settings ** //

// This configuration file will be used by the copy of WordPress being tested.
// wordpress/wp-config.php will be ignored.

// WARNING WARNING WARNING!
// These tests will DROP ALL TABLES in the database with the prefix named below.
// DO NOT use a production database or one that is shared with something else.
// 
// ***************** FOR WSL ****************************
// - Install WP CLI: https://wp-cli.org/#installing
// - You must have PHP & mysql installed in your Ubuntu distro
// - PHP is installed by default: you might have to install a f ew PHP extensions that composer install command throws error for and you're good to go.
// - Install mysql https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-database
// - Create a Database in your mysql wp_testing
// 
// **************** Using WP Local **********************
// - Access your wp local database adminer and create a database wp_testing
// - To run tests in wp local env: run your wp installation terminal by click on "Open Site Shell" button in your wp local dashboard.
// 
// **************** Using INCLUDED DOCKER COMPOSE **********************
// - Access your docker database adminer using localhost:8082
// - Create a database name 'wptests'


define( 'DB_NAME', 'wptests' );
define( 'DB_USER', 'root' );
define( 'DB_PASSWORD', 'root' );
define( 'DB_HOST', '127.0.0.1:3308' );
define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 */
define( 'AUTH_KEY', 'nJKcyeLV5l3fl+KIEFM6pYDWUVXCZBRfcUr8QGO1LhqvCXse/71bu0X6Z1W/GtAuTM9Iy60PyyVrLZK3BxWm+A==' );
define( 'SECURE_AUTH_KEY', 'k4LzDnhKonumoMaJNFIy7cFZGO33UcHvsBtOs9BJhOwR2xjMx7QCh7NRiqavO6No+Dc17//PlNwHdmh+DRGZ1A==' );
define( 'LOGGED_IN_KEY', 'VrnSgI6ok7V59WwAahMf/iYdlEMmk0d4zELJMvfLD3CWMUUY6ktCJzGSMo4vsRkuBKopsGjx2XffbQcUvZfP/g==' );
define( 'NONCE_KEY', 'SmOKcGVPJJ7CLh1mFa7qqznnP0dW5A0uWnS6o5lgIppL468xB93yBkZFmOsQsiXXl7emC4IOylnzxWh/vuKtmw==' );
define( 'AUTH_SALT', 'expyeLJU1vqrLmw9em5Jhy8zjesyCIiqQVD9cG9rw/TtrYzPxyZPVZTXCo8aDrqGF6S0tGg+ScLOdnl6ZS6paQ==' );
define( 'SECURE_AUTH_SALT', 'hduU7iQOF/AhyXAdv2hqvQxzXgtm1j9Yxuy2wJRBXHDciZxbRuD0FQcEozO+YMzzy0y0Ydf7QWfiMaefoRXamg==' );
define( 'LOGGED_IN_SALT', '+TPKGIQZTIyZvc73f01f705H4SIhWAyJBKkpevVqmjoAZ0iIWdF2Zl24Lm+Y9aQ4paiMUSr818AtmfR/oeT+Ew==' );
define( 'NONCE_SALT', 'NMqc8sd9ikHuoFzeXeD04K8d8XsGtRdRwA4FSIk/EQLT1HsgVzuEVFh+m55Cydx83xxoy3NTlizhw2jPHNznxg==' );

$table_prefix = 'wpphpunittests_';   // Only numbers, letters, and underscores please!

define( 'WP_TESTS_DOMAIN', 'localhost' );
define( 'WP_TESTS_EMAIL', 'admin@example.org' );
define( 'WP_TESTS_TITLE', 'Test Blog' );

define( 'WP_PHP_BINARY', 'php' );

define( 'WPLANG', '' );
