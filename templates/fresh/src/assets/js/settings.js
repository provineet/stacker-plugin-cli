/**
 * Stacker settings page.
 *
 * A reference React settings screen built on WordPress' bundled React and
 * component library. It reads and writes a single option (`stacker_settings`)
 * through core's REST settings endpoint (`/wp/v2/settings`), so no custom REST
 * routes are required. All `@wordpress/*` imports are externalised by
 * `wp-scripts` and loaded from core at runtime — nothing here ships its own
 * copy of React.
 *
 * The form is described as data in SECTIONS and rendered with the reusable
 * <Field> components in ./settings/fields — copy that pattern to build your own
 * pages.
 */
import { createRoot, useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import domReady from '@wordpress/dom-ready';
import {
	TabPanel,
	PanelRow,
	Button,
	Notice,
	Spinner,
} from '@wordpress/components';

import Field from './settings/fields';
import '../scss/settings.scss';

const OPTION_KEY = 'stacker_settings';

const DEFAULTS = {
	api_key: '',
	enable_feature: false,
	mode: 'simple',
	accent_color: '#3858e9',
	cache_ttl: 3600,
	items_per_page: 10,
	active_window: { start: '', end: '' },
	logo_id: 0,
	custom_css: '',
};

/**
 * The settings form, described as data. Each tab lists its fields; every field
 * is `{ key, type, ...fieldProps }` where `key` maps to a DEFAULTS entry and
 * `type` selects a control from the field library.
 */
const SECTIONS = [
	{
		name: 'general',
		title: __('General', '{{textDomain}}'),
		fields: [
			{
				key: 'api_key',
				type: 'text',
				label: __('API Key', '{{textDomain}}'),
			},
			{
				key: 'enable_feature',
				type: 'toggle',
				label: __('Enable feature', '{{textDomain}}'),
			},
			{
				key: 'mode',
				type: 'select',
				label: __('Mode', '{{textDomain}}'),
				options: [
					{
						label: __('Simple', '{{textDomain}}'),
						value: 'simple',
					},
					{
						label: __('Advanced', '{{textDomain}}'),
						value: 'advanced',
					},
				],
			},
			{
				key: 'accent_color',
				type: 'color',
				label: __('Accent color', '{{textDomain}}'),
			},
		],
	},
	{
		name: 'advanced',
		title: __('Advanced', '{{textDomain}}'),
		fields: [
			{
				key: 'cache_ttl',
				type: 'number',
				label: __('Cache TTL (seconds)', '{{textDomain}}'),
			},
			{
				key: 'items_per_page',
				type: 'range',
				label: __('Items per page', '{{textDomain}}'),
				min: 1,
				max: 100,
			},
			{
				key: 'active_window',
				type: 'daterange',
				label: __('Active period', '{{textDomain}}'),
			},
			{
				key: 'logo_id',
				type: 'media',
				label: __('Logo', '{{textDomain}}'),
			},
			{
				key: 'custom_css',
				type: 'textarea',
				label: __('Custom CSS', '{{textDomain}}'),
				rows: 8,
			},
		],
	},
];

function SettingsApp() {
	const [settings, setSettings] = useState(DEFAULTS);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [notice, setNotice] = useState(null);

	// Load current values once on mount.
	useEffect(() => {
		apiFetch({ path: '/wp/v2/settings' })
			.then((response) => {
				setSettings({
					...DEFAULTS,
					...(response[OPTION_KEY] || {}),
				});
			})
			.catch(() => {
				setNotice({
					status: 'error',
					message: __(
						'Failed to load settings.',
						'{{textDomain}}'
					),
				});
			})
			.finally(() => setLoading(false));
	}, []);

	// Update a single field in local state.
	const update = (key) => (value) =>
		setSettings((current) => ({ ...current, [key]: value }));

	const save = () => {
		setSaving(true);
		setNotice(null);

		apiFetch({
			path: '/wp/v2/settings',
			method: 'POST',
			data: { [OPTION_KEY]: settings },
		})
			.then((response) => {
				setSettings({
					...DEFAULTS,
					...(response[OPTION_KEY] || {}),
				});
				setNotice({
					status: 'success',
					message: __('Settings saved.', '{{textDomain}}'),
				});
			})
			.catch((error) => {
				setNotice({
					status: 'error',
					message:
						error?.message ||
						__('Failed to save settings.', '{{textDomain}}'),
				});
			})
			.finally(() => setSaving(false));
	};

	if (loading) {
		return <Spinner />;
	}

	return (
		<div className="stacker-settings">
			<h1>{__('Stacker Settings', '{{textDomain}}')}</h1>

			{notice && (
				<Notice
					status={notice.status}
					onRemove={() => setNotice(null)}
				>
					{notice.message}
				</Notice>
			)}

			<TabPanel className="stacker-settings__tabs" tabs={SECTIONS}>
				{(tab) => {
					const section = SECTIONS.find(
						(item) => item.name === tab.name
					);

					return (
						<div className="stacker-settings__panel">
							{section.fields.map(
								({ key, ...fieldProps }) => (
									<PanelRow key={key}>
										<Field
											{...fieldProps}
											value={settings[key]}
											onChange={update(key)}
										/>
									</PanelRow>
								)
							)}
						</div>
					);
				}}
			</TabPanel>

			<Button
				variant="primary"
				onClick={save}
				isBusy={saving}
				disabled={saving}
			>
				{__('Save settings', '{{textDomain}}')}
			</Button>
		</div>
	);
}

domReady(() => {
	const node = document.getElementById('stacker-settings-root');
	if (node) {
		createRoot(node).render(<SettingsApp />);
	}
});
