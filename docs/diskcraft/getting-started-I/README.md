# Getting Started

:::note

This is v1.5 of DiskCraft, v2 is not publically released yet. Join our discord to watch for updates

:::

![Image](https://cdn.crewcraft.gq/diskcraft/img/Screenshot-2022-10-12-161338.png)

## Terms

:::warning

There are some terms you need to understand before beginning:

**billing.yourdomain.com** - The link you plan on using for your billing panel

**panel.yourdomain.com** - The link to your pterodactyl instance

**id.yourdomain.com** - The link to your DiskCraft ID system

:::

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
| Git            | Latest                   |

## Installing NodeJS

**1.** `sudo apt update`

**2.** `curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -`

**3.** `sudo apt -y install nodejs`


NodeJS 14 is now installed

### Installing the rest of the dependencies

**1.** `sudo apt install redis-server -y`

**2.** `sudo apt install nginx -y`

**3.** `sudo apt install -y python3-certbot-nginx`

**4.** `sudo apt install git -y`

**5.** `npm i pm2 -g`

## Downloading DiskCraft

Download the source code for diskcraft
[Here](https://downloads.diskcraft.xyz).

Download the API, WEB, NL, and Configs!

## Web Configuration

In order for Diskcraft to work you'll need to configure some things

Open your code editor, and navigate to `src/App.vue`.

On lines 6-9 you'll find the navbar image as well as the company name next to it, change those accordingly.

Next On line 425 you'll find `baseURL: https://billing.yourdomain.com/api,`. Make sure you set this to your domain (example: billing.yourdomain.com/api).

Open `main.js` outside of the src file and change `connection: "https://billing.yourdomain.com/",` as well (do not add /api at the end)

run this command for later: `mkdir /var/www/diskcraft`

## Setting up your Certificate

In order to proceed with the rest of the steps, you need to install your domain certificate

Run this command: `sudo certbot certonly --standalone -d yourdomain.com`

## Settings up NGINX

In the configs folder grab `diskcraft.conf` 

Find `server_name` under both server for port 80 and 443 and change `billing.yourdomain.com` to your domain

On the ssl_certificate lines change the `billing.yourdomain.com` to your subdomain

Now upload this file to /etc/nginx/sites-available

open your NGINX config and make sure the bottom of your file looks like this. This is so it'll recognize .conf files

Now restart NGINX with `systemctl restart nginx`

![Image](https://cdn.crewcraft.gq/diskcraft/img/nginx.png)

## Settings up MongoDB

:::note

If you want a fast and easy MongoDB instance with backups and fast performance/connections you can purchase a cheap MongoDB instance here: [Galactiq](https://console.galactiq.net).

Our cheapest MongoDB instance starts at $0.50/month

We'd appreciate it if you used this method so we can keep this project going :)

:::

Follow the installation process for MongoDB here: [Docs](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/).

Once your in your MongoDB server create a database called **panel**

Create the following collections:

- invoiceItems

- invoices

- paypalCompletedTransactions

- paypalPendingTransactions

- pterodactylPackages

- pterodactylServers

- qemuActivity

- qemuAllocations

- qemuPackages

- qemuServers

- users

![Image](https://cdn.crewcraft.gq/diskcraft/img/mongodb.png)

## Setting up PayPal

Head over to [PayPal Developer](https://developer.paypal.com/developer/applications).

Sign into PayPal, then click **My apps & credentials**

Click Live and Create an App

Name the App and click Create

Now Grab your Client ID and Client Secret and keep them noted, you'll need these for the API

## Setting up the API

In **/root** run `git clone https://github.com/Diskcraft/api.git`

Open **.env** and fill out all the values

On line 263 you will find 2 example locations, these need to match your pterodactyl locations that you'll be using for deployment.

`code` The short code for the location that is shown in Pterodactyl

`name` The display name for the location

`flag_url` The link/directory to the locations country flag

`id` The ID that is shown in Pterodactyl next to the location

Set these values for the locations your nodes are in

Next you need to find `billing.yourdomain.com`, `id.yourdomain.com` and `panel.yourdomain.com` and change them accordingly. Click here if you didn't read what to replace them with: [Terms](/diskcraft/getting-started-I#terms)

## Starting the API

**1.** `pm2 start ./index.js --name panel-server`

**2.** `pm2 startup` and `pm2 save`

Now do `pm2 log API` to see if its throwing any errors

If it's not throwing errors your all good to go!

## Creating Products and Categories

:::note

Creating Packages in v1.5 is different than in v1. Instead of only making categories in the database, you need to make them in MongoDB and on front end.

:::

## --Front End--

## Package Categories

Go to line 780 in `src/order.vue`

You'll see an example for pterodactyl package categories.

`code` Will determine what package will go under what category, you'll see this option when making a package.

`title` The name of the Category.

`subtitle` The Category Description.

`image_url` The image that will be displayed for that category.

![Image](https://cdn.crewcraft.gq/diskcraft/img/category.png)

## Packages (Front)

Go to line 788 in `order.vue`

You'll find 1 demo package that you can look at to help you understand how they function.

`code` The code not only displays on front end, but is used for locating the corresponding package in the database.

`name` The displayed name of the package.

`regions` This is what allows certain packages to be viewed/deployed to specific locations.

`specs` This one is self explanitory, front end should be a standard number and the database entries should be as they would be in Pterodactyl.

`categories` This allows you to assign a package to a category.

`price` That thing that lets you make money.

## Building and uploading the Panel

`cd /var/www/diskcraft`

**1.** `npm i`

**2.** `npm run build`

Once building is done DiskCraft will automatically update (Unless your using cloudflare)

## Packages (Back)

go to the `plans` folder and open MCBUD1.json

This JSON file contains everything you'll put into your database in order for billing to deploy the server.

lines 2-16 must match the front end equivalents (ignore hetznerPackage & isDedicatedCpu).

`runtime` This is the game versions you saw at the top of the file earlier.

`allocationPort` This is the default port that Pterodactyl should attempt to allocate when creating the server

`egg` Make sure your egg is set properly for this version

Line 21-25 needs to be just as it is in your egg (unless your using a custom startup script)

`feature_limits` This allows you to set the other portions of your server up (Backups, Databases). If you have any Pterodactyl addons that add feature limits you can add them here.

Once you have created a package, you can copy the contents of the json file and go to your MongoDB instance.

Open the **pterodactylPackages** Collection and click **Add Data** then choose **Insert Document** then paste everything in there and your good to go!