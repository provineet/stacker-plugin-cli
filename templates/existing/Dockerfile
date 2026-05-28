FROM wordpress:6.4.1-php8.2-apache

# Install packages under Debian
RUN apt-get update && \
    apt-get -y install git && \
    apt-get -y install iputils-ping

# Install XDebug from source as described here:
# https://xdebug.org/docs/install
# Available branches of XDebug could be seen here:
# https://github.com/xdebug/xdebug/branches
RUN cd /tmp && \
    git clone https://github.com/xdebug/xdebug.git && \
    cd xdebug && \
    git checkout xdebug_3_2 && \
    phpize && \
    ./configure --enable-xdebug && \
    make && \
    make install && \
    rm -rf /tmp/xdebug

# Copy xdebug.ini to /usr/local/etc/php/conf.d/
COPY docker-configs/xdebug.ini /usr/local/etc/php/conf.d/

# Copy php-file-size.ini to /usr/local/etc/php/conf.d/
COPY docker-configs/php-file-size.ini /usr/local/etc/php/conf.d/

# Since this Dockerfile extends the official Docker image `wordpress`,
# and since `wordpress`, in turn, extends the official Docker image `php`,
# the helper script docker-php-ext-enable (defined for image `php`)
# works here, and we can use it to enable xdebug:
RUN docker-php-ext-enable xdebug