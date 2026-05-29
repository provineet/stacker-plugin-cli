import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
// import { __ } from '@wordpress/i18n';
import './style.scss';

registerBlockType( 'stacker/first-block', {
	edit: Edit,
	save,
} );
