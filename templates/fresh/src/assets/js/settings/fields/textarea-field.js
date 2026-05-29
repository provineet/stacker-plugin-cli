/**
 * Textarea field.
 *
 * Wraps @wordpress/components TextareaControl for multi-line text.
 *
 * @param {Object}   props
 * @param {string}   [props.label]  Field label.
 * @param {string}   [props.value]  Current value.
 * @param {Function} props.onChange Called with the new string value.
 * @param {string}   [props.help]   Help text shown beneath the field.
 * @param {number}   [props.rows]   Visible rows. Defaults to 4.
 * @return {Element} The control.
 */
import { TextareaControl } from '@wordpress/components';

export default function TextareaField( {
	label,
	value,
	onChange,
	help,
	rows = 4,
	...rest
} ) {
	return (
		<TextareaControl
			label={ label }
			value={ value ?? '' }
			onChange={ onChange }
			help={ help }
			rows={ rows }
			__nextHasNoMarginBottom
			{ ...rest }
		/>
	);
}
