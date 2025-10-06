# Deployment Guide

## Quick Deploy to Vercel (Recommended)

### 1. Prerequisites
- GitHub account
- Vercel account (free)
- MongoDB Atlas account (free tier available)

### 2. MongoDB Setup
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create free cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for development)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/passwordvault`

### 3. Deploy to Vercel
1. Push code to GitHub repository
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add environment variable:
   - `MONGODB_URI`: Your MongoDB connection string
5. Deploy!

### 4. Alternative: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
# Follow prompts, add MONGODB_URI when asked
```

## Other Deployment Options

### Netlify
1. Build the app: `npm run build && npm run export`
2. Deploy the `out` folder to Netlify
3. Note: API routes won't work (static export)

### Railway
1. Connect GitHub repository
2. Add `MONGODB_URI` environment variable
3. Deploy automatically

### Docker (Self-hosted)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables

### Required
- `MONGODB_URI`: MongoDB connection string

### Optional
- `NODE_ENV`: Set to "production" for production builds

## Security Checklist

- [ ] MongoDB connection uses authentication
- [ ] Database user has minimal required permissions
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Environment variables properly set
- [ ] No secrets in code repository
- [ ] CORS properly configured (handled by Next.js)

## Performance Optimization

- [ ] Enable gzip compression (automatic with Vercel)
- [ ] MongoDB indexes on user email field
- [ ] Client-side caching for vault items
- [ ] Minimize bundle size (already optimized)

## Monitoring

### Basic Health Checks
- Registration/login flow works
- Password generation works
- Vault CRUD operations work
- Search functionality works
- Clipboard copy/clear works

### Database Monitoring
- Check MongoDB Atlas metrics
- Monitor connection pool usage
- Watch for slow queries

## Troubleshooting

### Common Issues

1. **"Cannot connect to MongoDB"**
   - Check MONGODB_URI format
   - Verify network access in MongoDB Atlas
   - Check database user permissions

2. **"Session not working"**
   - Ensure cookies are enabled
   - Check HTTPS in production
   - Verify domain settings

3. **"Encryption errors"**
   - Check if user has kdfSalt
   - Verify password consistency
   - Clear browser storage and re-login

### Debug Mode
Add to `.env.local` for debugging:
```
NODE_ENV=development
DEBUG=true
```