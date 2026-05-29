/**
 * Field library.
 *
 * Reusable settings controls built on @wordpress/components, all sharing one
 * prop contract:
 *
 *   { label, value, onChange, help, ...typeSpecific }
 *
 * Two ways to use them:
 *
 *   1. The <Field type="…"> dispatcher — render fields from a config array:
 *        <Field type="select" label="Mode" options={…} value={v} onChange={set} />
 *
 *   2. Import a component directly when you want explicit JSX:
 *        import { SelectField } from './fields';
 *        <SelectField label="Mode" options={…} value={v} onChange={set} />
 *
 * See ./README.md for the full type reference.
 */
import TextField from './text-field';
import NumberField from './number-field';
import TextareaField from './textarea-field';
import SelectField from './select-field';
import RadioField from './radio-field';
import CheckboxField from './checkbox-field';
import ToggleField from './toggle-field';
import RangeField from './range-field';
import DateField from './date-field';
import DateRangeField from './date-range-field';
import ColorField from './color-field';
import MediaField from './media-field';

/**
 * Maps a `type` string to its field component.
 *
 * @type {Object<string, Function>}
 */
const FIELD_COMPONENTS = {
	text: TextField,
	email: TextField,
	url: TextField,
	password: TextField,
	tel: TextField,
	number: NumberField,
	textarea: TextareaField,
	select: SelectField,
	radio: RadioField,
	checkbox: CheckboxField,
	toggle: ToggleField,
	range: RangeField,
	date: DateField,
	daterange: DateRangeField,
	color: ColorField,
	media: MediaField,
};

/**
 * Native input types handled by TextField — for these the `type` is forwarded
 * to the underlying <input>.
 *
 * @type {string[]}
 */
const INPUT_TYPES = [ 'text', 'email', 'url', 'password', 'tel' ];

/**
 * Renders a field by type.
 *
 * @param {Object} props        Field props.
 * @param {string} [props.type] Field type (see FIELD_COMPONENTS keys).
 * @return {Element|null} The matching control, or null for unknown types.
 */
export default function Field( { type = 'text', ...props } ) {
	const Component = FIELD_COMPONENTS[ type ];

	if ( ! Component ) {
		// eslint-disable-next-line no-console
		console.warn( `Field: unknown type "${ type }".` );
		return null;
	}

	const typeProp = INPUT_TYPES.includes( type ) ? { type } : {};

	return <Component { ...typeProp } { ...props } />;
}

export {
	TextField,
	NumberField,
	TextareaField,
	SelectField,
	RadioField,
	CheckboxField,
	ToggleField,
	RangeField,
	DateField,
	DateRangeField,
	ColorField,
	MediaField,
};
