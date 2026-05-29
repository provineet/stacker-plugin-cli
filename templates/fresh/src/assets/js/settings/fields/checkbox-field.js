/**
 * Checkbox field.
 *
 * Wraps @wordpress/components CheckboxControl — a single on/off boolean.
 *
 * @param {Object}   props
 * @param {string}   [props.label]  Field label.
 * @param {boolean}  props.value    Whether the box is checked.
 * @param {Function} props.onChange Called with the new boolean value.
 * @param {string}   [props.help]   Help text.
 * @return {Element} The control.
 */
import { CheckboxControl } from '@wordpress/components';

export default function CheckboxField( {
	label,
	value,
	onChange,
	help,
	...rest
} ) {
	return (
		<CheckboxControl
			label={ label }
			checked={ !! value }
			onChange={ onChange }
			help={ help }
			__nextHasNoMarginBottom
			{ ...rest }
		/>
	);
}
