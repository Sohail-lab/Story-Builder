const fs = require('fs');
const path = require('path');
require('dotenv').config();

const robotsPath = path.join(__dirname, '../public/robots.txt');
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

let robots = fs.readFileSync(robotsPath, 'utf8');
robots = robots.replace(/__SITE_URL__/g, siteUrl);
fs.writeFileSync(robotsPath, robots, 'utf8');

console.log(`robots.txt updated with site URL: ${siteUrl}`); 