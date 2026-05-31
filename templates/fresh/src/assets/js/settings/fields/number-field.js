/**
 * Number field.
 *
 * A TextField locked to `type="number"` that coerces its value to an integer
 * (or 0 when cleared) before calling onChange, so stored settings stay numeric.
 *
 * @param {Object}   props
 * @param {Function} props.onChange Called with the new numeric value.
 * @return {Element} The control.
 */
import TextField from './text-field';

export default function NumberField( { onChange, ...rest } ) {
	return (
		<TextField
			type="number"
			onChange={ ( value ) =>
				onChange( '' === value ? 0 : parseInt( value, 10 ) || 0 )
			}
			{ ...rest }
		/>
	);
}
