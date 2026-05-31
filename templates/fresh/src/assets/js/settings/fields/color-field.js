/**
 * Color field.
 *
 * A Button with a color swatch that opens a `ColorPicker` in a Dropdown popover.
 * The value is stored as a hex string (e.g. `#3858e9`).
 *
 * @param {Object}   props
 * @param {string}   [props.label]  Field label.
 * @param {string}   [props.value]  Current hex color.
 * @param {Function} props.onChange Called with the new hex string.
 * @param {string}   [props.help]   Help text.
 * @return {Element} The control.
 */
import {
	BaseControl,
	Button,
	ColorIndicator,
	ColorPicker,
	Dropdown,
	Flex,
	FlexItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';

export default function ColorField({ label, value, onChange, help }) {
	const instanceId = useInstanceId(ColorField);
	const id = `stacker-color-${instanceId}`;

	return (
		<BaseControl
			id={id}
			label={label}
			help={help}
			__nextHasNoMarginBottom
		>
			<div>
				<Dropdown
					popoverProps={{ placement: 'bottom-start' }}
					renderToggle={({ isOpen, onToggle }) => (
						<Button
							id={id}
							variant="secondary"
							onClick={onToggle}
							aria-expanded={isOpen}
							__next40pxDefaultSize
						>
							<Flex gap={2} align="center">
								<FlexItem>
									<ColorIndicator colorValue={value} />
								</FlexItem>
								<FlexItem>
									{value ||
										__(
											'Select a color',
											'{{textDomain}}'
										)}
								</FlexItem>
							</Flex>
						</Button>
					)}
					renderContent={() => (
						<ColorPicker
							color={value}
							enableAlpha={false}
							onChange={(color) =>
								onChange(
									'string' === typeof color
										? color
										: color?.hex
								)
							}
						/>
					)}
				/>
			</div>
		</BaseControl>
	);
}
