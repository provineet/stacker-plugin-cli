import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {
	return (
		<p { ...useBlockProps() }>
			{ __(
				"Stacker Boilerplate - Hello Sparky!!! I'm your first block getting edited right in the Gutenberg editor!",
				'stacker-boilerplate'
			) }
		</p>
	);
}
