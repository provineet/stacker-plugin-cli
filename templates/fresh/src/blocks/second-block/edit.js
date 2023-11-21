import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {
	return (
		<p { ...useBlockProps() }>
			{ __(
				'Stacker Boilerplate – hello from the second block editor!',
				'stacker-boilerplate'
			) }
		</p>
	);
}
