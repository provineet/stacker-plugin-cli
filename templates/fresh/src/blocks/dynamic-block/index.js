import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import metadata from './block.json';
import './style.scss';

/**
 * Dynamic blocks have no `save` function — the markup is rendered on the server
 * by render.php at view time, so we register only the editor `edit` component.
 */
registerBlockType( metadata.name, {
	edit: Edit,
} );
