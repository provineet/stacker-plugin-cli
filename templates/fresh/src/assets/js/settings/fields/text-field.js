/**
 * Text field.
 *
 * Wraps @wordpress/components TextControl. The `type` prop forwards any native
 * input type (text, email, url, password, tel, …) so this one component covers
 * every single-line text input.
 *
 * @param {Object}   props
 * @param {string}   [props.label]  Field label.
 * @param {string}   [props.value]  Current value.
 * @param {Function} props.onChange Called with the new string value.
 * @param {string}   [props.type]   Native input type. Defaults to `text`.
 * @param {string}   [props.help]   Help text shown beneath the field.
 * @return {Element} The control.
 */
import { TextControl } from '@wordpress/components';

export default function TextField( {
	label,
	value,
	onChange,
	type = 'text',
	help,
	...rest
} ) {
	return (
		<TextControl
			type={ type }
			label={ label }
			value={ value ?? '' }
			onChange={ onChange }
			help={ help }
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			{ ...rest }
		/>
	);
}
