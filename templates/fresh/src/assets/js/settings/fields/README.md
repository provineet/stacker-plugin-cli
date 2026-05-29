# Settings fields

Reusable React settings controls built on
[`@wordpress/components`](https://developer.wordpress.org/block-editor/reference-guides/components/),
so they look and behave like native wp-admin inputs.

## Prop contract

Every field accepts the same core props:

| Prop       | Type       | Description                                  |
| ---------- | ---------- | -------------------------------------------- |
| `label`    | `string`   | Field label.                                 |
| `value`    | `mixed`    | Current value (type depends on the field).   |
| `onChange` | `Function` | Called with the new value.                   |
| `help`     | `string`   | Optional help text shown beneath the field.  |

Type-specific props (e.g. `options`, `min`/`max`/`step`, `rows`, `multiple`)
are listed per field below and are also forwarded to the underlying control.

## Usage

**Config-driven** — render fields from data with the `<Field>` dispatcher:

```jsx
import Field from './fields';

<Field
	type="select"
	label="Mode"
	options={ [
		{ label: 'Simple', value: 'simple' },
		{ label: 'Advanced', value: 'advanced' },
	] }
	value={ mode }
	onChange={ setMode }
/>;
```

**Direct** — import a single component when you prefer explicit JSX:

```jsx
import { SelectField } from './fields';

<SelectField label="Mode" options={ … } value={ mode } onChange={ setMode } />;
```

## Available types

| `type`      | Component        | Value type                         | Notes                                   |
| ----------- | ---------------- | ---------------------------------- | --------------------------------------- |
| `text`      | `TextField`      | `string`                           | Also `email`/`url`/`password`/`tel`.    |
| `number`    | `NumberField`    | `number`                           | Coerces to an integer.                  |
| `textarea`  | `TextareaField`  | `string`                           | `rows` prop.                            |
| `select`    | `SelectField`    | `string` or `string[]`             | `options`, `multiple`.                  |
| `radio`     | `RadioField`     | `string`                           | `options`.                              |
| `checkbox`  | `CheckboxField`  | `boolean`                          | Single boolean.                         |
| `toggle`    | `ToggleField`    | `boolean`                          | Switch.                                 |
| `range`     | `RangeField`     | `number`                           | `min`, `max`, `step`.                   |
| `date`      | `DateField`      | `string` (`YYYY-MM-DD`)            | Calendar in a popover.                  |
| `daterange` | `DateRangeField` | `{ start: string, end: string }`   | Start/end date pair.                    |
| `color`     | `ColorField`     | `string` (hex)                     | Color picker in a popover.              |
| `media`     | `MediaField`     | `number` (attachment ID, 0 = none) | Needs `wp_enqueue_media()` on the page. |

## Adding a field type

1. Create `my-field.js` exporting a component that honours the prop contract.
2. Register it in `index.js` under `FIELD_COMPONENTS` (and re-export it).
3. If it stores a new shape, mirror it in the PHP option schema
   (`inc/settings/class-settings.php`: `defaults()`, `schema()`, `sanitize()`).
