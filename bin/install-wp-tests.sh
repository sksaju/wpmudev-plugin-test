#!/bin/bash

# WordPress Test Environment Installer
# This script sets up a minimal WordPress test environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
DB_NAME=${1:-wordpress_test}
DB_USER=${2:-root}
DB_PASS=${3:-root}
DB_HOST=${4:-localhost}
WP_VERSION=${5:-latest}

echo -e "${GREEN}Setting up WordPress test environment...${NC}"

# Create test directories
mkdir -p /tmp/wordpress-tests-lib
mkdir -p /tmp/wordpress

echo -e "${YELLOW}Downloading WordPress...${NC}"

# Download WordPress
if [ "$WP_VERSION" = "latest" ]; then
    curl -s https://wordpress.org/latest.tar.gz | tar -xz -C /tmp/wordpress --strip-components=1
else
    curl -s "https://wordpress.org/wordpress-${WP_VERSION}.tar.gz" | tar -xz -C /tmp/wordpress --strip-components=1
fi

echo -e "${YELLOW}Downloading WordPress test suite...${NC}"

# Download WordPress test suite
cd /tmp/wordpress-tests-lib
git clone --depth=1 https://github.com/WordPress/wordpress-develop.git temp-wp-develop
cp -r temp-wp-develop/tests/phpunit/includes/ ./
cp temp-wp-develop/wp-tests-config-sample.php wp-tests-config.php
rm -rf temp-wp-develop

echo -e "${YELLOW}Configuring test environment...${NC}"

# Configure wp-tests-config.php
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|dirname( __FILE__ ) . '/src/'|'/tmp/wordpress/'|" wp-tests-config.php
    sed -i '' "s/youremptytestdbnamehere/${DB_NAME}/" wp-tests-config.php
    sed -i '' "s/yourusernamehere/${DB_USER}/" wp-tests-config.php
    sed -i '' "s/yourpasswordhere/${DB_PASS}/" wp-tests-config.php
    sed -i '' "s|localhost|${DB_HOST}|" wp-tests-config.php
else
    # Linux
    sed -i "s|dirname( __FILE__ ) . '/src/'|'/tmp/wordpress/'|" wp-tests-config.php
    sed -i "s/youremptytestdbnamehere/${DB_NAME}/" wp-tests-config.php
    sed -i "s/yourusernamehere/${DB_USER}/" wp-tests-config.php
    sed -i "s/yourpasswordhere/${DB_PASS}/" wp-tests-config.php
    sed -i "s|localhost|${DB_HOST}|" wp-tests-config.php
fi

# Check if MySQL is available
if command -v mysqladmin &> /dev/null; then
    echo -e "${YELLOW}Creating test database...${NC}"
    mysqladmin create ${DB_NAME} --user=${DB_USER} --password=${DB_PASS} --host=${DB_HOST} 2>/dev/null || echo -e "${YELLOW}Database ${DB_NAME} may already exist or MySQL not running${NC}"
else
    echo -e "${YELLOW}MySQL not found. You may need to install MySQL or create the database manually.${NC}"
    echo -e "${YELLOW}Run: mysql -u ${DB_USER} -p -e \"CREATE DATABASE ${DB_NAME};\"${NC}"
fi

echo -e "${GREEN}WordPress test environment ready!${NC}"
echo -e "${YELLOW}Test environment location: /tmp/wordpress-tests-lib${NC}"
echo -e "${YELLOW}WordPress location: /tmp/wordpress${NC}"
echo -e "${YELLOW}Database: ${DB_NAME}@${DB_HOST}${NC}"
echo ""
echo -e "${GREEN}Setup complete! You can now run tests with:${NC}"
echo -e "${YELLOW}vendor/bin/phpunit${NC}"
echo ""
echo -e "${YELLOW}If you get database connection errors, try:${NC}"
echo -e "${YELLOW}1. Install MySQL: brew install mysql && brew services start mysql${NC}"
echo -e "${YELLOW}2. Create database: mysql -u root -p -e \"CREATE DATABASE ${DB_NAME};\"${NC}"
echo -e "${YELLOW}3. Or use your existing WordPress installation${NC}"
