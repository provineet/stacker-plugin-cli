/**
 * Date field.
 *
 * A single date picker. @wordpress/components has no inline "date input", so we
 * pair a Button (showing the chosen date) with the calendar `DatePicker` inside
 * a Dropdown popover. The value is stored as a `YYYY-MM-DD` string.
 *
 * @param {Object}   props
 * @param {string}   [props.label]       Field label.
 * @param {string}   [props.value]       Current date as `YYYY-MM-DD`.
 * @param {Function} props.onChange      Called with the new `YYYY-MM-DD` string.
 * @param {string}   [props.help]        Help text.
 * @param {string}   [props.placeholder] Button text when no date is set.
 * @return {Element} The control.
 */
import {
	BaseControl,
	Button,
	Dropdown,
	DatePicker,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';

export default function DateField( {
	label,
	value,
	onChange,
	help,
	placeholder,
} ) {
	const instanceId = useInstanceId( DateField );
	const id = `stacker-date-${ instanceId }`;

	return (
		<BaseControl
			id={ id }
			label={ label }
			help={ help }
			__nextHasNoMarginBottom
		>
			<div>
				<Dropdown
					popoverProps={ { placement: 'bottom-start' } }
					renderToggle={ ( { isOpen, onToggle } ) => (
						<Button
							id={ id }
							variant="secondary"
							onClick={ onToggle }
							aria-expanded={ isOpen }
							__next40pxDefaultSize
						>
							{ value ||
								placeholder ||
								__( 'Select a date', '{{textDomain}}' ) }
						</Button>
					) }
					renderContent={ ( { onClose } ) => (
						<DatePicker
							currentDate={ value || undefined }
							onChange={ ( newDate ) => {
								onChange(
									newDate ? newDate.slice( 0, 10 ) : ''
								);
								onClose();
							} }
						/>
					) }
				/>
			</div>
		</BaseControl>
	);
}
