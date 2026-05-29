# Stacker WordPress Plugin Boilerplate

A modern WordPress plugin development boilerplate (PHP {{reqPHP}}+, WordPress 7.0) with
[`@wordpress/scripts`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)
for asset building and PHPUnit for testing.

## Requirements

- PHP **{{reqPHP}}+** (CLI) with the `mysqli` extension
- Composer
- Node.js + npm (for asset builds)
- Docker + Docker Compose **v2** (optional — provides the full dev stack and the
  test database)

## Install

```bash
composer install
npm install
```

## Development environment (Docker)

The bundled `docker-compose.yaml` spins up a complete, throwaway WordPress
environment with this plugin already mounted. It is built from `Dockerfile`
(latest WordPress on PHP 8.3) with Xdebug and a mail catcher pre-wired.

```bash
docker compose up -d --build      # build + start the whole stack
docker compose up -d db           # or just the DB (enough to run tests)
docker compose logs -f wordpress  # tail logs
docker compose down               # stop (keeps data)
docker compose down -v            # stop AND wipe the WP install + DB volumes
```

### Services & ports

| Service     | URL / host                | Purpose                                            |
| ----------- | ------------------------- | -------------------------------------------------- |
| `wordpress` | http://localhost:8080     | WordPress; this plugin is bind-mounted (live edits)|
| `db`        | `127.0.0.1:3308`          | MariaDB — app DB **and** the PHPUnit `wptests` DB  |
| `adminer`   | http://localhost:8082     | Database GUI                                        |
| `mailpit`   | http://localhost:8025     | Catches all outgoing mail (SMTP on `1025`)         |

On first run, open http://localhost:8080 and complete the WordPress install,
then activate the plugin from **Plugins** in wp-admin. Your code edits are live
(bind-mounted); `WP_DEBUG` + `WP_DEBUG_LOG` are on, logging to
`wp-content/debug.log` inside the container.

> **Picking up a newer base image:** the WordPress install lives in a named
> volume, so a plain `up` keeps the old version. Run `docker compose down -v`
> then `docker compose up -d --build` to recreate it. This wipes the dev DB and
> install — your bind-mounted plugin code is untouched.

### Xdebug (step debugging)

Xdebug 3 is enabled in `debug,develop` mode on port **9003**, IDE key `VSCODE`
(see `docker-configs/xdebug.ini`). The compose file maps
`host.docker.internal:host-gateway` so the container can reach your IDE on
**every OS** — required on Linux/WSL2, and a harmless no-op on Docker Desktop
for Mac/Windows. Point your editor's debug listener at port 9003 and set a
path mapping from the project root to
`/var/www/html/wp-content/plugins/stacker-boilerplate`.

### Develop in a Dev Container (VS Code)

`.devcontainer/` lets you open the project **inside** the running container
(VS Code [Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)
extension + Docker). It **reuses the same `docker-compose.yaml`** — no second
stack to maintain — and attaches the editor to the `wordpress` service, with the
workspace rooted at `/var/www/html/wp-content/plugins/stacker-boilerplate`.

1. Run the build tooling on the **host** first so `vendor/` and `node_modules/`
   exist (they're shared into the container via the bind mount):

   ```bash
   composer install
   npm install
   ```

2. In VS Code: **Reopen in Container** (Command Palette → _Dev Containers:
   Reopen in Container_). The first open starts the stack and installs the
   recommended PHP/JS extensions; later opens just attach and are fast.

Notes:

- **Build tooling stays on the host.** The container doesn't install Node or
  Composer, so keep running `npm run start` / `composer …` on your machine —
  this is what keeps reopening quick (no re-installing the ~1 GB `node_modules`
  over the mount).
- **Xdebug just works.** A small overlay (`.devcontainer/docker-compose.devcontainer.yaml`
  → `xdebug.devcontainer.ini`) repoints `xdebug.client_host` to `localhost`
  because the IDE runs _inside_ the container here. Pick the bundled **Listen
  for XDebug** launch config and set a breakpoint. CLI tooling (phpcs/phpcbf,
  the terminal) runs with `XDEBUG_MODE=off` so linters aren't tripped up by
  Xdebug connection notices; to step-debug a CLI script, run it with an explicit
  `XDEBUG_MODE=debug`.
- **Don't run both at once.** A plain `docker compose up` and the Dev Container
  share the same Compose project and host ports — use one or the other.

### Cross-platform notes

The stack is designed to run unmodified on **macOS (Intel & Apple Silicon),
Windows, Linux, and WSL2**:

- All images are multi-arch, so they run natively on Apple Silicon (no
  emulation). Mailpit replaces the older amd64-only mailcatcher for this reason.
- `.gitattributes` forces **LF** line endings on files that run inside the Linux
  container (`*.php`, `*.ini`, `*.sh`, `*.sql`, `Dockerfile`), so Windows
  checkouts don't ship CRLF that would break PHP ini parsing or shell scripts.
- Need to pin a specific WordPress version for reproducible builds? Edit the
  `FROM` line in `Dockerfile` (e.g. `wordpress:6.8-php8.3-apache`).

## Running tests

Tests use [PHPUnit](https://phpunit.de/) with the official
[WordPress test framework](https://make.wordpress.org/core/handbook/testing/automated-testing/)
(`wp-phpunit` + `yoast/phpunit-polyfills`). They run against a **real MySQL
database** — the suite drops and recreates tables on every run, so never point it
at a database you care about.

### 1. Make sure PHP has the MySQL extension

The WordPress bootstrap fails with *"missing the MySQL extension"* if `mysqli`
isn't loaded. Verify:

```bash
php -m | grep -i mysqli
```

If nothing prints, install it (Debian/Ubuntu/WSL example — adjust the version to
your PHP):

```bash
sudo apt-get install -y php8.3-mysql
sudo phpenmod mysqli   # if still not enabled
```

### 2. Start the test database

The bundled `docker-compose.yaml` provides MariaDB on `127.0.0.1:3308` and
auto-creates the `wptests` database (see `docker-configs/init/wptests.sql`),
which matches the credentials in `tests/wp-config.php`:

```bash
docker compose up -d db
```

> Using **Local by Flywheel** or a system MySQL instead? Create a `wptests`
> database and update the `DB_*` constants in `tests/wp-config.php` to match
> (host/port, user, password). See the notes at the top of that file.

### 3. Run the suite

```bash
composer test
# or directly:
vendor/bin/phpunit
```

Tests live in `tests/` and are discovered by the `test-*.php` filename prefix
(see `phpunit.xml.dist`). `tests/test-sample.php` is a working example using
`WP_UnitTestCase`.

### Writing tests

Each test is a class that extends `WP_UnitTestCase` (from the WordPress test
framework), giving you a fully booted WordPress on a real database — core
functions, hooks, the options API, factories, etc. are all available. The
plugin itself is loaded in `tests/bootstrap.php`, so its classes and functions
are ready to test directly.

A few rules the loader relies on:

- **File name** must start with `test-` (e.g. `tests/test-settings.php`). Files
  without that prefix are ignored.
- **Test methods** must start with `test_` (or carry a `@test` annotation).
- **Assert something.** The suite runs with `beStrictAboutTestsThatDoNotTestAnything`,
  so a test with no assertions is reported as risky and **fails** the run.

A minimal test for one of the plugin's own functions:

```php
<?php
/**
 * @package {{packageName}}_Boilerplate
 */
class SettingsTest extends WP_UnitTestCase {

	public function test_get_setting_returns_default_before_first_save() {
		// {{prefix}}_get_setting() is the plugin helper; it should fall
		// back to the registered default when nothing is stored yet.
		$this->assertSame( '', {{prefix}}_get_setting( 'website_url' ) );
	}

	public function test_get_setting_returns_fallback_for_unknown_key() {
		$this->assertSame(
			'fallback',
			{{prefix}}_get_setting( 'not_a_real_key', 'fallback' )
		);
	}
}
```

#### Set-up and tear-down

The WordPress test case **resets state between tests** for you: every test runs
in a database transaction that is rolled back afterwards, and the hook globals
are restored. You generally do **not** need to clean up options, posts, or users
you create. Use `set_up()` / `tear_down()` (note the snake_case names from the
Yoast polyfills) for per-test fixtures, and always call the parent:

```php
public function set_up() {
	parent::set_up();
	// runs before every test_* method
}

public function tear_down() {
	// undo anything that escapes the transaction (e.g. filters you added
	// outside the rollback, temp files, $_GET/$_POST you mutated)
	parent::tear_down();
}
```

#### Useful helpers from `WP_UnitTestCase`

- **Factories** create real fixture data: `self::factory()->post->create()`,
  `->user->create( array( 'role' => 'administrator' ) )`, `->term->create()`,
  etc. Use `*_and_get()` variants to get the object back.
- **Acting as a user:** `wp_set_current_user( $admin_id )` to test
  capability/permission paths.
- **Hooks:** assert your plugin registered something with
  `$this->assertSame( 10, has_action( 'init', 'my_callback' ) )`.
- **Expecting failures:** `$this->expectException()`, and the WP-specific
  `$this->setExpectedDeprecated()` / `setExpectedIncorrectUsage()` for code that
  calls `_deprecated_function()` / `_doing_it_wrong()`.

#### Running a single test while iterating

```bash
vendor/bin/phpunit --filter test_get_setting_returns_fallback_for_unknown_key
vendor/bin/phpunit tests/test-settings.php   # one file
```

See the [WordPress automated-testing handbook](https://make.wordpress.org/core/handbook/testing/automated-testing/writing-phpunit-tests/)
for the full factory and assertion reference.

## Settings page

The boilerplate ships a reference settings screen under the **Stacker → Settings**
admin menu. It is a small React app (built on WordPress' bundled React and
[`@wordpress/components`](https://developer.wordpress.org/block-editor/reference-guides/components/))
that reads and writes a **single option**, `stacker_settings`, through core's
`/wp/v2/settings` REST endpoint — so there are no custom REST routes to maintain.

### How it fits together

| Layer        | File                                            | Role                                                                 |
| ------------ | ----------------------------------------------- | -------------------------------------------------------------------- |
| Option/REST  | `inc/settings/class-settings.php`               | Registers the option, its defaults, REST schema, and sanitization.   |
| Admin menu   | `inc/admin/class-settings-page.php`             | Adds the menu, enqueues the app, renders the mount point.            |
| React app    | `src/assets/js/settings.js`                     | Data-driven form (`SECTIONS`) that loads/saves over the REST API.    |
| Field library| `src/assets/js/settings/fields/`                | Reusable controls (`text`, `select`, `toggle`, `media`, …).         |

Both `Settings` and the admin `Settings_Page` are instantiated during bootstrap
in `inc/class-loader.php`. `Settings` is created **unconditionally** (not just in
the admin) because the REST save request that persists the form is *not*
`is_admin()` — without it, `register_setting()` wouldn't run and saving would
fail schema validation.

### Field types

The form is described as data. Each field is `{ key, type, ...props }` where
`type` selects a control from the field library. Available types: `text` (plus
`email`/`url`/`password`/`tel`), `number`, `textarea`, `select`, `radio`,
`checkbox`, `toggle`, `range`, `date`, `daterange`, `color`, and `media`. See
[`src/assets/js/settings/fields/README.md`](src/assets/js/settings/fields/README.md)
for each control's value type and props.

### Adding a new setting

A setting lives in two places that must agree: the PHP option (defaults + schema
+ sanitization) and the React form. Add it to both, then rebuild assets.

**1. Describe it in PHP** — `inc/settings/class-settings.php`:

```php
// defaults(): the value used when nothing is stored yet.
'website_url' => '',

// schema(): the REST shape. additionalProperties is false, so a key missing
// here is rejected by /wp/v2/settings.
'website_url' => array( 'type' => 'string' ),

// sanitize(): clean/coerce the incoming value, falling back to the default.
'website_url' => isset( $value['website_url'] )
    ? esc_url_raw( (string) $value['website_url'] )
    : $defaults['website_url'],
```

**2. Add it to the React form** — `src/assets/js/settings.js`:

```js
// DEFAULTS: mirror the PHP default so the UI renders before the first save.
const DEFAULTS = {
    // …existing keys…
    website_url: '',
};

// SECTIONS: drop the field into a tab. `key` must match the DEFAULTS/schema key.
{
    key: 'website_url',
    type: 'url',
    label: __( 'Website URL', 'stacker-boilerplate' ),
    help: __( 'The public-facing URL of your site.', 'stacker-boilerplate' ),
},
```

**3. Rebuild the assets:**

```bash
npm run build:assets   # or `npm run start:assets` to watch during development
```

To add a whole new tab, push another `{ name, title, fields }` entry onto
`SECTIONS`. To add a new *kind* of control, follow "Adding a field type" in the
[fields README](src/assets/js/settings/fields/README.md).

### Reading a setting from PHP

Use the `{{prefix}}_get_setting()` helper (in
`inc/helpers/helper-functions.php`). It reads from the single option and merges
over the defaults, so a registered key is never missing — even before the page
has been saved once:

```php
$url  = {{prefix}}_get_setting( 'website_url' );
$mode = {{prefix}}_get_setting( 'mode' );

// The optional second argument is returned only for an unrecognised key:
$x = {{prefix}}_get_setting( 'not_a_real_key', 'fallback' );
```

## Coding standards

```bash
composer phpcs    # check against WordPress Coding Standards
composer phpcbf   # auto-fix what it can
```
