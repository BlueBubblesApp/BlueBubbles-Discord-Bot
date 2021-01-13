#!/usr/bin/env bash

echo -e "\n\n====================================================="
echo -e "\t Running apt update"
echo -e "=====================================================\n\n"

apt update

echo -e "\n\n====================================================="
echo -e "\t Installing Node.js"
echo -e "=====================================================\n\n"

curl -sL https://deb.nodesource.com/setup_14.x | bash -
apt -y install nodejs
apt -y install build-essential

echo -e "\n\n====================================================="
echo -e "\t Installing yarn and pm2"
echo -e "=====================================================\n\n"

npm i -g yarn
npm i -g pm2

echo -e "\n\n====================================================="
echo -e "\t Installing NPM Packages"
echo -e "=====================================================\n\n"

cd /vagrant
yarn

echo -e "\n\n====================================================="
echo -e "\t Adding project to PM2"
echo -e "=====================================================\n\n"

pm2 start yarn --name "BlueBubbles-Bot" -- start
pm2 save
pm2 startup
pm2 stop 0

echo -e "\n\n====================================================="
echo -e "\t Installing MariaDB"
echo -e "=====================================================\n\n"

apt -y install mariadb-server

echo -e "\n\n====================================================="
echo -e "\t Configuring MariaDB_secure_installation"
echo -e "=====================================================\n\n"

DEV_PWD="p@ssw0rd"
echo "dev password is $DEV_PWD"

systemctl start mariadb
systemctl enable mariadb

mysql_secure_installation << EOF

Y
$DEV_PWD
$DEV_PWD
Y
Y
Y
Y
EOF

systemctl restart mariadb

mysql -e 'CREATE DATABASE IF NOT EXISTS bubblesbot;'
mysql -e "GRANT ALL ON *.* TO 'vagrant'@'localhost' IDENTIFIED BY '$DEV_PWD' WITH GRANT OPTION; FLUSH PRIVILEGES;"