# Getting Started

:::note

This is v1 of Dino, v2 is not publicly released yet. It may be licensed, join our discord to watch for updates.

:::

![Image](https://downloads.diskcraft.xyz/static/img/example02.png)

## Requirements

:::tip

If you need help just join the discord and a developer or owner will be happy to help!

:::

| Dependencies   | Recommended Version      |
| -------------- | ------------------------ |
| OS             | Ubuntu Server 18+        |
| NodeJS         | 14.0+                    |
| Redis          | Latest                   |
| Nginx          | Latest                   |
| Certbot        | Latest                   |
| PM2            | Latest                   |

## Installing NodeJS

**1.** `sudo apt update`

**2.** `curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -`

**3.** `sudo apt -y install nodejs`


NodeJS 14 is now installed

### Installing the rest of the dependencies

**1.** `sudo apt install redis-server`

**2.** `sudo apt install nginx`

**3.** `sudo apt install -y python3-certbot-nginx`

**4.** `npm i pm2 -g`

## Downloading Dino

Download the source code for Dino
[Here](https://downloads.dinopanel.net/).

Download the API, WEB, NL, and Configs!

## Configuration

In order for Dino to work you'll need to configure some things

Open your code editor, and navigate to `src/App.vue`

scroll down to `api_default: "null"` and replace null with your subdomain with `/api` at the end (https://billing.yourdomain.com/api)

Open `src/views/admin/log.vue` and navigate to line 141 and change `https://panel.yourdomain.com` to whatever your Pterodactyl panel link is

That's all for Web! (Unless you plan on making some console modifications of your own)

## Settings up MYSQL

Unzip `configs.zip` and grab the file `diskcraft.sql`

Create your database

If your using PHPMyAdmin you can import the file via web after you've created your database

However if your using CLI run this command in the directory your sql file is: `sudo mysql -u <username> -p <database_name> < bil.sql`

once thats done you can open your database via a DB client or PHPMyAdmin and see all the tables, do not remove any of them under any circumstance as it may break your panel.

## Setting up your Certificate

In order to proceed with the rest of the steps, you need to install your domain certificate

Run this command: `sudo certbot certonly --standalone -d yourdomain.com`

## Settings up NGINX

In the configs folder grab `diskcraft` 

Find `server_name` under both server for port 80 and 443 and change billing.yourdomain.com to your subdomain

On the ssl_certificate lines change the billing.yourdomain.com pem to your subdomain

Find `proxy_pass` and change the IP to your systems IP address (needs to have http)

Now upload this file to /etc/nginx/sites-available

Run this command: `sudo ln -s /etc/nginx/sites-available/Dino /etc/nginx/sites-enabled/Dino`

Now restart NGINX with `systemctl restart nginx`

## Building and uploading the Panel

Open CMD in the web directory and run the following commands (only after you've added your domain in App.vue)

**1.** `npm i`

**2.** `npm run build`

**3.** `mkdir /var/www/Dino`

**3.** Upload the contents of **/dist** to **/var/www/Dino**

## Setting up PayPal

Head over to [PayPal Developer](https://developer.paypal.com/developer/applications).

Sign into PayPal, then click **My apps & credentials**

Click Live and Create an App

Name the App and click Create

Now Grab your Client ID and Client Secret and keep them noted, you'll need these for the API

## Setting up the API

First do `ufw allow 2250` and `ufw allow 2251`

In **/root** make a folder called **api** and cd into it

Run `sudo npm i secure-random-password jwks-rsa && sudo npm i @paypal/checkout-server-sdk`

Upload the contents of the API zip you downloaded earlier into it

Now open **config.js** and you'll see a blank config. Fill out all the information as it should be (do not touch     **api: {
        port: 2251,
        base_url: "/api")**

Most of these fields are self explanatory, however you should remember to take the PayPal app credentials you got earlier and put them under the `paypal: {` area.

Return URL and Cancel URL should just be the base link of the site

If your just using Pterodactyl make sure under **capabilities: {** that **pterodactylServer:** is set to `true`

:::warning

Discord Auth is not currently finished, so we recommend keeping it set to false.

:::

:::info

There are no VPS documentation, unless you can figure it out for yourself and submit a pull request for documentation it will not be here.

:::

Next go to your Pterodactyl panel and go to **Admin > Application API** and Generate an API key with full permissions.

Put that key in the **Key:** value under **pterodactyl: {** 

As for **Server:** that's just your panel link

## Starting the API

**1.** `pm2 start ./index.js --name panel-server`

**2.** `pm2 startup` and `pm2 save`

Now do `pm2 log panel-server` to see if its throwing any errors

If it's not throwing errors your all good to go!

## Setting up NL

Upload the NL file to the root folder of your Pterodactyl nodes (does not have to be on the panel)

Install PM2: `npm i pm2 -g`

Run `chmod a+x NL`

Then `ufw allow 12645`

Now `pm2 start ./NL --name Link`

Finally run `pm2 startup` and `pm2 save`

### The panel is officially running!!!!

## Creating Products and Categories

Other than pages and functions, nothing is hard coded. This means that creating products and categories are immediate and don't require you to rebuild your site.

First open **pterodactyl_package_category**

| code           | name                  | container_template                                                     | nodes   |
| -------------- | ----------------------| ---------------------------------------------------------------------- |-------- |
| minecraft_java | Minecraft Java        | [Click to Download](https://downloads.dinopanel.net/diskcraft/ct.conf) | FQDN    |

Categories are made like that, the container template has the egg information as well as startup script and environmental variables

The nodes field is meant for whitelisting, allowing only certain products on certain nodes. If you have two nodes and only one of them is in a minecraft field only one node can have minecraft deployed to it

Now open **pterodactyl_packages**

| code             | name                     | price | ram  | disk | cpu | databases | backups | category       |
| ---------------- | ------------------------ | ----- | ---- | ---- | --- | --------- | ------- | -------------- |
| minecraft_java_1 | 1GB Java                 | 1.25  | 1024 | 4096 | 200 | 1         | 1       | minecraft_java |

That is the layout for a game package

**pterodactyl_servers** shows all servers deployed via the billing system

**users** shows all users registered on the billing system. You can change their usernames, emails, account balances, ect. However you cannot and should never attempt to change their passwords. They should do that themselves via a reset email, you cannot view user passwords as they are encrypted.