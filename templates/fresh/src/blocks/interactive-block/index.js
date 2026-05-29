import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import metadata from './block.json';
import './style.scss';

/**
 * The front-end behaviour lives in view.js (loaded as a script module via
 * `viewScriptModule`) and the markup is produced by render.php, so there is no
 * `save` function — we register only the editor `edit` component.
 */
registerBlockType( metadata.name, {
	edit: Edit,
} );
