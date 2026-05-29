<?php
/**
 * Server-side render for the "Interactive Example Block".
 *
 * Outputs the initial markup plus the Interactivity API directives. The actual
 * behaviour lives in view.js, which WordPress loads as a script module on demand.
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

${{prefix}}_start = isset( $attributes['start'] ) ? (int) $attributes['start'] : 0;
?>
<div
	<?php echo get_block_wrapper_attributes(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Output is escaped by get_block_wrapper_attributes(). ?>
	data-wp-interactive="stacker/interactive-block"
	<?php echo wp_interactivity_data_wp_context( array( 'count' => ${{prefix}}_start ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Output is escaped by wp_interactivity_data_wp_context(). ?>
>
	<p class="wp-block-stacker-interactive-block__count" data-wp-text="context.count"></p>

	<div class="wp-block-stacker-interactive-block__controls">
		<button type="button" data-wp-on--click="actions.decrement">
			<?php esc_html_e( 'Decrement', '{{textDomain}}' ); ?>
		</button>
		<button type="button" data-wp-on--click="actions.increment">
			<?php esc_html_e( 'Increment', '{{textDomain}}' ); ?>
		</button>
		<button type="button" data-wp-on--click="actions.reset">
			<?php esc_html_e( 'Reset', '{{textDomain}}' ); ?>
		</button>
	</div>

	<p data-wp-bind--hidden="!state.isPositive">
		<?php esc_html_e( 'The count is positive 🎉', '{{textDomain}}' ); ?>
	</p>
</div>
