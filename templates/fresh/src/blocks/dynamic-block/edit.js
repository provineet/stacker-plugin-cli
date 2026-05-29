import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import './editor.scss';

/**
 * Editor preview for the dynamic block.
 *
 * The real output comes from render.php; here we just give the author a
 * representative preview plus a sidebar control to edit the `label` attribute,
 * which is then passed through to the server render.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @return {Element} Editor element.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { label } = attributes;
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', '{{textDomain}}' ) }>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __( 'Label', '{{textDomain}}' ) }
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<p { ...blockProps }>
				{ __(
					'Dynamic block — the published-post count is rendered on the server (render.php) each time the page loads.',
					'{{textDomain}}'
				) }
			</p>
		</>
	);
}
