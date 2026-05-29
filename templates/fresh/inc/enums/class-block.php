<?php
/**
 * Block enum
 *
 * @package {{packageName}}
 * @since 1.0
 */

declare(strict_types=1);

namespace {{namespace}}\Enums;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Enumerates the custom blocks shipped by this plugin.
 *
 * Each case value is the block's directory name under `/blocks`, which is also
 * where its compiled `block.json` lives. Add a case per block and the bootstrap
 * registers it automatically.
 */
enum Block: string {
	case First       = 'first-block';
	case Second      = 'second-block';
	case Dynamic     = 'dynamic-block';
	case Interactive = 'interactive-block';
}
