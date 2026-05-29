/**
 * Toggle field.
 *
 * Wraps @wordpress/components ToggleControl — a boolean rendered as a switch.
 *
 * @param {Object}   props
 * @param {string}   [props.label]  Field label.
 * @param {boolean}  props.value    Whether the toggle is on.
 * @param {Function} props.onChange Called with the new boolean value.
 * @param {string}   [props.help]   Help text.
 * @return {Element} The control.
 */
import { ToggleControl } from '@wordpress/components';

export default function ToggleField( {
	label,
	value,
	onChange,
	help,
	...rest
} ) {
	return (
		<ToggleControl
			label={ label }
			checked={ !! value }
			onChange={ onChange }
			help={ help }
			__nextHasNoMarginBottom
			{ ...rest }
		/>
	);
}
