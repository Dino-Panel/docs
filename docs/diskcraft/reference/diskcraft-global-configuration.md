---
slug: /diskcraft/reference/diskcraft-global-configuration
---

![Image](https://downloads.diskcraft.xyz/static/img/example02.png)

# Dino Multi-Instance Config

Dino isn't just standalone, you can configure it to run in a multi instance mode. This means that you can have 1 web server, but several domains all using it and have their own unique views.

This Tutorial will seem very similar to standard installation, however all the things that are needed to run in multi-instance mode are included

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
[Here](https://downloads.diskcraft.xyz).

Download the API, WEB, NL, and Configs!

## Configuration

In order for Dino to work you'll need to configure some things

Open your code editor, and navigate to `src/App.vue`

scroll down to `api_default: "null"` and replace null with your subdomain with `/api` at the end (https://test.yourdomain.com/api)

Next go to **knownHosts: {** and add your secondary domain under localhost like this: ![Image](https://downloads.diskcraft.xyz/static/img/example01.png)

That's all for Web! (Unless you plan on making some console modifications of your own)

## Settings up MYSQL

Unzip `configs.zip` and grab the file `diskcraft.sql`

Create your database

If your using PHPMyAdmin you can import the file via web after you've created your database

However if your using CLI run this command in the directory your sql file is: `sudo mysql -u <username> -p <database_name> < diskcraft.sql`

once thats done you can open your database via a DB client or PHPMyAdmin and see all the tables, do not remove any of them under any circumstance as it may break your panel.

## Setting up your Certificate

In order to proceed with the rest of the steps, you need to install your domain certificate

Run this command: `sudo certbot certonly --standalone -d yourdomain.com`

## Settings up NGINX

In the configs folder grab `diskcraft` 

Find `server_name` under both server for port 80 and 443 and change billing.temp to your subdomain

On the ssl_certificate lines change the billing.temp pem to your subdomain

Find `proxy_pass` and change the IP to your systems IP address (needs to have http)

Now upload this file to /etc/nginx/sites-available

Run this command: `sudo ln -s /etc/nginx/sites-available/diskcraft /etc/nginx/sites-enabled/diskcraft`

Now restart NGINX with `systemctl restart nginx`

## Building and uploading the Panel

Open CMD in the web directory and run the following commands (only after you've added your domain in App.vue)

**1.** `npm i`

**2.** `npm run build`

**3.** Upload the contents of **/dist** to **/var/www/html**

## Setting up PayPal

Head over to [PayPal Developer](https://developer.paypal.com/developer/applications).

Sign into PayPal, then click **My apps & credentials**

Click Live and Create an App

Name the App and click Create

Now Grab your Client ID and Client Secret and keep them noted, you'll need these for the API

## Setting up the API

First do `ufw allow 2250` and `ufw allow 2251`

In **/var/www/html** make a folder called **api** and cd into it

Run `npm i secure-random-password jwks-rsa` and `npm i @paypal/checkout-server-sdk`

Upload the contents of the API zip you downloaded earlier into it

Now open **config.js** and you'll see a blank config. Fill out all the information as it should be (do not touch     **api: {
        port: 2251,
        base_url: "/api")**

Most of these fields are self explanatory, however you should remember to take the PayPal app credentials you got earlier and put them under the `paypal: {` area.

Return URL and Cancel URL should just be the base link of the site

If your just using Pterodactyl make sure under **capabilities: {** that **pterodactylServer:** is set to `true`

:::warning

Discord Auth is not currently finished, so we recommend keeping it set to false

:::

We will make another version of documentation for VPS capabilities at some point, however it does indeed work.

Next go to your Pterodactyl panel and go to **Admin > Application API** and Generate an API key with full permissions.

Put that key in the **Key:** value under **pterodactyl: {** 

As for **Server:** that's just your panel link

:::note

For the MultiInstance Diskcraft function, all you have to do is add the API to whatever system you want to host it on. As long as the domain your adding matches the one you put in **App.vue** it'll work

:::

## Starting the API

In order to make sure the API starts without issue you need to do this first:

**1.** Do `systemctl stop redis-server`

**2.** In the api directory do `nano redis.sh` and in that file just type `redis-server` and save it

**3.** Now run `pm2 start ./redis.sh --name Redis`

Redis is now running via PM2 instead of systemctl 

**4.** `pm2 start ./index.js --name API`

**5.** `pm2 startup` and `pm2 save`

Now do `pm2 log API` to see if its throwing any errors

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

| code           | name                     | container_template                                                 | nodes   |
| -------------- | ------------------------ | ------------------------------------------------------------------ |-------- |
| minecraft_java | Minecraft Java           | [Click to Download](https://downloads.diskcraft.xyz/diskcraft/ct.conf)  | FQDN    |

Categories are made like that, the container template has the egg information as well as startup script and enviromental variables

The nodes field is meant for whitelisting, allowing only certain products on certain nodes. If you have two nodes and only one of them is in a minecraft field only one node can have minecraft deployed to it

Now open **pterodactyl_packages**

| code             | name                     | price | ram  | disk | cpu | databases | backups | category       |
| ---------------- | ------------------------ | ----- | ---- | ---- | --- | --------- | ------- | -------------- |
| minecraft_java_1 | 1GB Java                 | 1.25  | 1024 | 4096 | 200 | 1         | 1       | minecraft_java |

That is the layout for a game package

**pterodactyl_servers** shows all servers deployed via the billing system

**users** shows all users registered on the billing system. You can change their usernames, emails, account balances, ect. However you cannot and should never attempt to change their passwords. They should do that themselves via a reset email, you cannot view user passwords as they are encrypted.
