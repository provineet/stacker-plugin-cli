import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

/**
 * Editor preview for the interactive block.
 *
 * The Interactivity API only runs on the front end, so in the editor we render a
 * static, non-interactive preview that mirrors the server output.
 *
 * @return {Element} Editor element.
 */
export default function Edit() {
	return (
		<div { ...useBlockProps() }>
			<p>
				{ __(
					'Interactive block — on the front end this becomes a live counter driven by the Interactivity API (view.js).',
					'{{textDomain}}'
				) }
			</p>
		</div>
	);
}
