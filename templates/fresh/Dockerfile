# Tracks the latest WordPress release on PHP 8.3 (matches the plugin's
# "Requires PHP: {{reqPHP}}" / "Requires at least: 7.0" targets). Pin a specific WP
# tag (e.g. wordpress:6.8-php8.3-apache) if you need reproducible builds.
#
# Cross-platform: the official `wordpress` image and every package used below
# (Xdebug/msmtp via apt+PECL) are multi-arch, so this builds natively on Intel
# (amd64) and Apple Silicon (arm64) — Mac, Windows, Linux and WSL2 — without
# emulation. No per-OS edits needed here.
FROM wordpress:php8.3-apache

# Install packages under Debian. msmtp acts as the sendmail binary so PHP
# mail() can be routed to the mailcatcher service (see docker-configs/sendmail.ini).
RUN apt-get update && \
    apt-get -y install --no-install-recommends git iputils-ping msmtp && \
    rm -rf /var/lib/apt/lists/*

# Install Xdebug via PECL (fast, no source build) and register it. The actual
# settings live in docker-configs/xdebug.ini, copied below.
RUN pecl install xdebug && \
    docker-php-ext-enable xdebug

# Copy xdebug.ini to /usr/local/etc/php/conf.d/
COPY docker-configs/xdebug.ini /usr/local/etc/php/conf.d/

# Copy php-file-size.ini to /usr/local/etc/php/conf.d/
COPY docker-configs/php-file-size.ini /usr/local/etc/php/conf.d/

# Route PHP mail() to the mailcatcher service
COPY docker-configs/sendmail.ini /usr/local/etc/php/conf.d/
