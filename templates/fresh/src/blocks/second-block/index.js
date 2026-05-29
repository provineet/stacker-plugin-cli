import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
// import { __ } from '@wordpress/i18n';
import './style.scss';

registerBlockType( 'stacker/second-block', {
	edit: Edit,
	save,
} );
