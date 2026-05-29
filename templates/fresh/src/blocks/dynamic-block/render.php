<?php
/**
 * Server-side render for the "Dynamic Example Block".
 *
 * This file runs on every front-end request, so its output always reflects live
 * data. WordPress exposes the following variables to the render template.
 *
 * @package {{packageName}}
 * @since 1.0
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block default content (inner blocks); unused here.
 * @var WP_Block $block      Block instance.
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

${{prefix}}_label = isset( $attributes['label'] ) ? (string) $attributes['label'] : '';
${{prefix}}_count = (int) wp_count_posts()->publish;
?>
<div <?php echo get_block_wrapper_attributes(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Output is escaped by get_block_wrapper_attributes(). ?>>
	<p>
		<?php
		echo esc_html(
			sprintf(
				/* translators: 1: author-supplied label, 2: number of published posts. */
				_n(
					'%1$s: %2$s post',
					'%1$s: %2$s posts',
					${{prefix}}_count,
					'{{textDomain}}'
				),
				${{prefix}}_label,
				number_format_i18n( ${{prefix}}_count )
			)
		);
		?>
	</p>
</div>
