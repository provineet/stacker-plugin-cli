/**
 * Date range field.
 *
 * A start/end pair built from two {@link DateField}s. The value is an object
 * `{ start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }`.
 *
 * @param {Object}                      props
 * @param {string}                      [props.label]  Field label.
 * @param {{start?:string,end?:string}} [props.value]  Current range.
 * @param {Function}                    props.onChange Called with the new `{ start, end }` object.
 * @param {string}                      [props.help]   Help text.
 * @return {Element} The control.
 */
import { BaseControl, Flex, FlexItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';
import DateField from './date-field';

export default function DateRangeField({
	label,
	value = {},
	onChange,
	help,
}) {
	const instanceId = useInstanceId(DateRangeField);
	const id = `stacker-daterange-${instanceId}`;
	const { start = '', end = '' } = value || {};

	return (
		<BaseControl
			id={id}
			label={label}
			help={help}
			__nextHasNoMarginBottom
		>
			<Flex justify="flex-start" align="flex-end" gap={4}>
				<FlexItem>
					<DateField
						label={__('Start', '{{textDomain}}')}
						value={start}
						onChange={(newStart) =>
							onChange({ start: newStart, end })
						}
					/>
				</FlexItem>
				<FlexItem>
					<DateField
						label={__('End', '{{textDomain}}')}
						value={end}
						onChange={(newEnd) =>
							onChange({ start, end: newEnd })
						}
					/>
				</FlexItem>
			</Flex>
		</BaseControl>
	);
}
