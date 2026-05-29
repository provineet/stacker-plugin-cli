/**
 * Front-end behaviour for the interactive block.
 *
 * Loaded by WordPress as a script module (declared via `viewScriptModule` in
 * block.json) only on pages where the block is present. The `store` namespace
 * must match the `data-wp-interactive` value set in render.php.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/
 */
import { store, getContext } from '@wordpress/interactivity';

store( 'stacker/interactive-block', {
	state: {
		// Derived state — recomputed automatically when `count` changes.
		get isPositive() {
			return getContext().count > 0;
		},
	},
	actions: {
		increment() {
			getContext().count += 1;
		},
		decrement() {
			getContext().count -= 1;
		},
		reset() {
			getContext().count = 0;
		},
	},
} );
