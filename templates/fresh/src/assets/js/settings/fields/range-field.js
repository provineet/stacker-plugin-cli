/**
 * Range (slider) field.
 *
 * Wraps @wordpress/components RangeControl. onChange receives a number.
 *
 * @param {Object}   props
 * @param {string}   [props.label]  Field label.
 * @param {number}   props.value    Current value.
 * @param {Function} props.onChange Called with the new numeric value.
 * @param {number}   [props.min]    Minimum value. Defaults to 0.
 * @param {number}   [props.max]    Maximum value. Defaults to 100.
 * @param {number}   [props.step]   Step increment. Defaults to 1.
 * @param {string}   [props.help]   Help text.
 * @return {Element} The control.
 */
import { RangeControl } from '@wordpress/components';

export default function RangeField( {
	label,
	value,
	onChange,
	min = 0,
	max = 100,
	step = 1,
	help,
	...rest
} ) {
	return (
		<RangeControl
			label={ label }
			value={ value }
			onChange={ onChange }
			min={ min }
			max={ max }
			step={ step }
			help={ help }
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			{ ...rest }
		/>
	);
}
