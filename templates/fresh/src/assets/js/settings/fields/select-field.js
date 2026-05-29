/**
 * Select field.
 *
 * Wraps @wordpress/components SelectControl. Pass `multiple` for a multi-select
 * (its value is then an array of strings).
 *
 * @param {Object}                             props
 * @param {string}                             [props.label]    Field label.
 * @param {string|string[]}                    props.value      Current value(s).
 * @param {Function}                           props.onChange   Called with the new value(s).
 * @param {Array<{label:string,value:string}>} [props.options]  Selectable options.
 * @param {boolean}                            [props.multiple] Allow multiple selection.
 * @param {string}                             [props.help]     Help text.
 * @return {Element} The control.
 */
import { SelectControl } from '@wordpress/components';

export default function SelectField( {
	label,
	value,
	onChange,
	options = [],
	multiple = false,
	help,
	...rest
} ) {
	return (
		<SelectControl
			label={ label }
			value={ value }
			onChange={ onChange }
			options={ options }
			multiple={ multiple }
			help={ help }
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			{ ...rest }
		/>
	);
}
