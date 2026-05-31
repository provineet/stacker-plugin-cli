/**
 * Radio field.
 *
 * Wraps @wordpress/components RadioControl — a single choice from a small set.
 *
 * @param {Object}                             props
 * @param {string}                             [props.label]   Field label.
 * @param {string}                             props.value     Selected value.
 * @param {Function}                           props.onChange  Called with the new value.
 * @param {Array<{label:string,value:string}>} [props.options] Selectable options.
 * @param {string}                             [props.help]    Help text.
 * @return {Element} The control.
 */
import { RadioControl } from '@wordpress/components';

export default function RadioField( {
	label,
	value,
	onChange,
	options = [],
	help,
	...rest
} ) {
	return (
		<RadioControl
			label={ label }
			selected={ value }
			onChange={ onChange }
			options={ options }
			help={ help }
			{ ...rest }
		/>
	);
}
