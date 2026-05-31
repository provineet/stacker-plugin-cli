/**
 * Media field.
 *
 * Opens the WordPress media library (`wp.media`) to pick an attachment and
 * stores its attachment ID (0 = none). Requires `wp_enqueue_media()` to have
 * run on the page — the Settings_Page enqueues it for this screen.
 *
 * When the selected attachment is an image, a thumbnail preview is shown. The
 * preview is resolved from the attachment ID via the REST API, so it also
 * appears for values loaded from saved settings (not just freshly picked ones).
 *
 * @param {Object}   props
 * @param {string}   [props.label]       Field label.
 * @param {number}   props.value         Selected attachment ID (0 = none).
 * @param {Function} props.onChange      Called with the new attachment ID.
 * @param {string}   [props.help]        Help text.
 * @param {string}   [props.buttonLabel] Label for the select button.
 * @return {Element} The control.
 */
import { BaseControl, Button, Flex, FlexItem } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __, sprintf } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';

export default function MediaField({
	label,
	value,
	onChange,
	help,
	buttonLabel,
}) {
	const instanceId = useInstanceId(MediaField);
	const id = `stacker-media-${instanceId}`;
	const [preview, setPreview] = useState('');

	// Resolve a thumbnail URL for the current attachment ID, so the preview
	// shows for both freshly picked and previously saved values.
	useEffect(() => {
		if (!value) {
			setPreview('');
			return undefined;
		}

		let cancelled = false;

		apiFetch({ path: `/wp/v2/media/${value}` })
			.then((media) => {
				if (cancelled) {
					return;
				}
				const url =
					media?.media_details?.sizes?.thumbnail?.source_url ||
					media?.source_url ||
					'';
				setPreview('image' === media?.media_type ? url : '');
			})
			.catch(() => {
				if (!cancelled) {
					setPreview('');
				}
			});

		return () => {
			cancelled = true;
		};
	}, [value]);

	const openLibrary = () => {
		if (!window.wp || !window.wp.media) {
			return;
		}

		const frame = window.wp.media({
			title: __('Select media', '{{textDomain}}'),
			multiple: false,
		});

		frame.on('select', () => {
			const attachment = frame
				.state()
				.get('selection')
				.first()
				.toJSON();
			onChange(attachment.id);
		});

		frame.open();
	};

	return (
		<BaseControl
			id={id}
			label={label}
			help={help}
			__nextHasNoMarginBottom
		>
			<Flex justify="flex-start" align="center" gap={3}>
				{!!preview && (
					<FlexItem>
						<img
							src={preview}
							alt=""
							className="stacker-media-field__preview"
						/>
					</FlexItem>
				)}
				<FlexItem>
					<Button
						id={id}
						variant="secondary"
						onClick={openLibrary}
						__next40pxDefaultSize
					>
						{buttonLabel ||
							__('Select media', '{{textDomain}}')}
					</Button>
				</FlexItem>
				{!!value && (
					<>
						<FlexItem>
							{sprintf(
								/* translators: %d: attachment ID. */
								__('Attachment #%d', '{{textDomain}}'),
								value
							)}
						</FlexItem>
						<FlexItem>
							<Button
								variant="link"
								isDestructive
								onClick={() => onChange(0)}
							>
								{__('Remove', '{{textDomain}}')}
							</Button>
						</FlexItem>
					</>
				)}
			</Flex>
		</BaseControl>
	);
}
