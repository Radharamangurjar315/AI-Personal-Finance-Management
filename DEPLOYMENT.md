# Deployment Guide

This guide covers deploying the AI Personal Finance Management application to various platforms.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Deployment](#local-deployment)
- [Heroku Deployment](#heroku-deployment)
- [Railway Deployment](#railway-deployment)
- [Render Deployment](#render-deployment)
- [DigitalOcean Deployment](#digitalocean-deployment)
- [MongoDB Atlas Setup](#mongodb-atlas-setup)
- [SSL/HTTPS Configuration](#sslhttps-configuration)
- [Post-Deployment](#post-deployment)

## Prerequisites

Before deploying, ensure you have:
- ✅ A GitHub repository with your code
- ✅ MongoDB database (local or Atlas)
- ✅ Environment variables configured
- ✅ All dependencies installed
- ✅ Application tested locally

## Environment Variables

Create a `.env` file with these variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-app

# Security
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Optional
CORS_ORIGIN=https://your-domain.com
```

### Generating a Secure JWT Secret

```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Local Deployment

### Using npm

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your values

# Start MongoDB
mongod

# Start the application
npm start
```

The app will be available at `http://localhost:5000`

### Using Docker

Create `Dockerfile`:

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/finance-app
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

Run with Docker:

```bash
docker-compose up -d
```

## Heroku Deployment

### Method 1: Heroku CLI

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login to Heroku
heroku login

# Create a new app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key
heroku config:set MONGODB_URI=your-mongodb-uri

# Deploy
git push heroku main

# Open the app
heroku open
```

### Method 2: GitHub Integration

1. Go to [Heroku Dashboard](https://dashboard.heroku.com)
2. Click "New" → "Create new app"
3. Choose app name and region
4. Connect to GitHub repository
5. Configure automatic deploys from main branch
6. Set environment variables in Settings → Config Vars
7. Click "Deploy Branch"

### Heroku Procfile

Create `Procfile` in root:

```
web: node server/index.js
```

### MongoDB on Heroku

Use MongoDB Atlas (free tier):

```bash
# Add MongoDB Atlas connection string
heroku config:set MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/finance-app"
```

## Railway Deployment

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables:
   - NODE_ENV=production
   - JWT_SECRET=your-secret-key
   - MONGODB_URI=your-mongodb-uri
5. Railway will auto-detect Node.js and deploy
6. Access your app at the provided URL

### Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-secret-key
railway variables set MONGODB_URI=your-mongodb-uri

# Deploy
railway up
```

## Render Deployment

1. Go to [Render](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: your-app-name
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables:
   - NODE_ENV=production
   - JWT_SECRET=your-secret-key
   - MONGODB_URI=your-mongodb-uri
6. Click "Create Web Service"

### Render Blueprint

Create `render.yaml`:

```yaml
services:
  - type: web
    name: finance-app
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: JWT_SECRET
        generateValue: true
      - key: MONGODB_URI
        sync: false
```

## DigitalOcean Deployment

### Using App Platform

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect to GitHub
4. Select repository and branch
5. Configure:
   - **Type**: Web Service
   - **HTTP Port**: 5000
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`
6. Add environment variables
7. Choose plan and deploy

### Using Droplet (Manual)

```bash
# SSH into droplet
ssh root@your-droplet-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Clone repository
git clone https://github.com/your-username/AI-Personal-Finance-Management.git
cd AI-Personal-Finance-Management

# Install dependencies
npm install

# Set up environment
nano .env
# Add your environment variables

# Install PM2
sudo npm install -g pm2

# Start application
pm2 start server/index.js --name finance-app
pm2 startup
pm2 save

# Set up Nginx
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/finance-app

# Add Nginx configuration:
# server {
#     listen 80;
#     server_name your-domain.com;
#     location / {
#         proxy_pass http://localhost:5000;
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade $http_upgrade;
#         proxy_set_header Connection 'upgrade';
#         proxy_set_header Host $host;
#         proxy_cache_bypass $http_upgrade;
#     }
# }

sudo ln -s /etc/nginx/sites-available/finance-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Wait for cluster creation (3-5 minutes)
5. Click "Connect"
6. Add your IP address (or 0.0.0.0/0 for all IPs)
7. Create a database user
8. Choose connection method: "Connect your application"
9. Copy the connection string
10. Replace `<password>` with your database password
11. Replace `myFirstDatabase` with your database name

Example connection string:
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/finance-app?retryWrites=true&w=majority
```

## SSL/HTTPS Configuration

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Using Cloudflare (Free)

1. Sign up at [Cloudflare](https://www.cloudflare.com)
2. Add your domain
3. Update nameservers at your domain registrar
4. Enable "Always Use HTTPS" in SSL/TLS settings
5. Set SSL/TLS encryption mode to "Flexible" or "Full"

## Post-Deployment

### Verify Deployment

1. **Health Check**
   ```bash
   curl https://your-domain.com/api/health
   ```

2. **Test Authentication**
   ```bash
   curl -X POST https://your-domain.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"test","email":"test@example.com","password":"test123"}'
   ```

3. **Check Logs**
   - Heroku: `heroku logs --tail`
   - Railway: Check dashboard
   - Render: Check logs in dashboard
   - PM2: `pm2 logs finance-app`

### Monitoring Setup

1. **Application Monitoring**
   - [New Relic](https://newrelic.com)
   - [DataDog](https://www.datadoghq.com)
   - [Sentry](https://sentry.io)

2. **Uptime Monitoring**
   - [UptimeRobot](https://uptimerobot.com)
   - [Pingdom](https://www.pingdom.com)
   - [StatusCake](https://www.statuscake.com)

3. **Log Management**
   - [Loggly](https://www.loggly.com)
   - [Papertrail](https://www.papertrail.com)
   - [LogDNA](https://www.logdna.com)

### Performance Optimization

1. **Enable Compression**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Add Caching Headers**
   ```javascript
   app.use(express.static('public', {
     maxAge: '1d',
     etag: true
   }));
   ```

3. **Use CDN**
   - Cloudflare
   - AWS CloudFront
   - Fastly

### Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input sanitization active
- [ ] Security headers set
- [ ] Database access restricted
- [ ] Regular backups scheduled
- [ ] Error messages don't expose sensitive data
- [ ] Dependencies updated regularly

### Backup Strategy

1. **Database Backups**
   - MongoDB Atlas: Automatic backups enabled
   - Manual: Use `mongodump`
   ```bash
   mongodump --uri="mongodb+srv://..." --out=/backup/$(date +%Y%m%d)
   ```

2. **Application Backups**
   - Git repository (main backup)
   - Regular commits and pushes
   - Tagged releases

### Scaling Considerations

1. **Horizontal Scaling**
   - Add more instances
   - Use load balancer
   - Configure session store (Redis)

2. **Database Scaling**
   - MongoDB Atlas auto-scaling
   - Read replicas
   - Sharding for large datasets

3. **Caching**
   - Redis for frequently accessed data
   - CDN for static assets
   - API response caching

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if MongoDB is running
   - Verify connection string
   - Check firewall rules

2. **Authentication Errors**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure password is hashed

3. **Rate Limiting Issues**
   - Adjust limits in production
   - Use Redis for distributed rate limiting

4. **Performance Issues**
   - Add database indexes
   - Enable compression
   - Use caching
   - Optimize queries

### Support Resources

- GitHub Issues: [Project Issues](https://github.com/Radharamangurjar315/AI-Personal-Finance-Management/issues)
- Documentation: README.md, ARCHITECTURE.md
- Community: Stack Overflow, MongoDB Forums

## Maintenance

### Regular Tasks

- [ ] Update dependencies monthly
- [ ] Review security advisories
- [ ] Monitor error logs
- [ ] Check database performance
- [ ] Review and optimize slow queries
- [ ] Update documentation
- [ ] Test backup restoration
- [ ] Review user feedback

### Update Process

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Run migrations (if any)
npm run migrate

# Restart application
# Heroku: git push heroku main
# PM2: pm2 restart finance-app
# Docker: docker-compose up -d --build
```

## Cost Estimates

### Free Tier Options
- MongoDB Atlas: 512MB storage
- Heroku: 1 dyno (sleeps after 30min inactivity)
- Render: 750 hours/month
- Railway: $5 credit/month

### Paid Options (Approximate)
- Heroku Hobby: $7/month
- DigitalOcean Droplet: $5-10/month
- MongoDB Atlas M10: $57/month
- Render Starter: $7/month

Choose based on your traffic and storage needs.

---

**Note**: Always test in a staging environment before deploying to production!
