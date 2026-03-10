# 🚀 Vercel Deployment Guide - PTE Mock Test

## Prerequisites
- Node.js installed (v18 or higher)
- Vercel account (free tier is sufficient)
- API keys for AI scoring (OpenRouter, Gemini, OpenAI)

## Quick Deploy Options

### Option 1: Vercel CLI (Recommended)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy to Production
```bash
vercel --prod
```

**That's it!** Vercel will automatically:
- Detect your Vite project
- Build the application
- Deploy to a production URL

---

### Option 2: Vercel Dashboard (GitHub Integration)

#### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push-u origin main
```

#### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Keep default settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click "Deploy"

---

## Environment Variables Setup

After deployment, you MUST add these environment variables in Vercel:

### In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

```
VITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here
VITE_OPENAI_API_KEY=sk-proj-your-key-here
VITE_GEMINI_API_KEY=AIzaSy-your-key-here
VITE_WEBHOOK_URL=https://your-n8n-instance.com/webhook/...
VITE_N8N_API_KEY=your-jwt-token
```

### Or via Vercel CLI:
```bash
vercel env add VITE_OPENROUTER_API_KEY
vercel env add VITE_OPENAI_API_KEY
vercel env add VITE_GEMINI_API_KEY
vercel env add VITE_WEBHOOK_URL
vercel env add VITE_N8N_API_KEY
```

Then redeploy:
```bash
vercel --prod
```

---

## Local Build Testing

Before deploying, test the production build locally:

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

This will show you exactly what will be deployed to Vercel.

---

## Custom Domain (Optional)

To add a custom domain:
1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add your domain
4. Update DNS records as instructed

---

## Post-Deployment Checklist

✅ **Test all sections:**
- Speaking (audio recording & AI transcription)
- Writing (AI scoring)
- Reading (comprehension)
- Listening (audio playback)

✅ **Verify AI scoring:**
- Check browser console for API calls
- Ensure scores are not falling back to 5/10
- Test with different question types

✅ **Check authentication:**
- User registration/login
- Session persistence
- Protected routes

✅ **Performance:**
- Initial load time
- Audio recording quality
- AI evaluation response time

---

## Troubleshooting

### Issue: Build fails on Vercel
**Solution:** Check build logs in Vercel dashboard
```bash
# Test build locally first
npm run build
```

### Issue: API calls failing after deployment
**Solution:** 
1. Verify environment variables are set correctly
2. Check CORS settings if using custom backend
3. Ensure webhook URLs use HTTPS in production

### Issue: Audio recording not working
**Solution:**
- Modern browsers require HTTPS for audio recording
- Vercel provides HTTPS automatically
- Check browser permissions for microphone access

### Issue: AI scoring returns 5/10 fallback
**Solution:**
1. Check browser console for detailed error logs
2. Verify API keys are valid and have credits
3. Test each provider individually at `/test-ai-scoring`

---

## Automatic Deployments

When connected to GitHub:
- Every push to `main` branch triggers automatic deployment
- Pull requests get preview deployments
- Production deployments on merge

---

## Performance Optimization

Vercel automatically optimizes:
- ✅ Static asset compression
- ✅ CDN distribution (global edge network)
- ✅ HTTP/2 and Brotli compression
- ✅ Automatic HTTPS
- ✅ Smart caching

---

## Monitoring & Analytics

Enable Vercel Analytics:
1. Go to project settings
2. Enable "Vercel Analytics"
3. Monitor Core Web Vitals
4. Track page views and performance

---

## Cost Estimation

**Free Tier Includes:**
- Unlimited deployments
- 100GB bandwidth/month
- Automatic SSL certificates
- Global CDN
- Perfect for testing and small-scale usage

**Pro Tier ($20/month):**
- Unlimited bandwidth
- Advanced analytics
- Priority support

---

## Support Resources

- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Community Forum: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- Status Page: [vercel.com/status](https://vercel.com/status)

---

## Next Steps After Deployment

1. Share your live URL with students
2. Monitor AI scoring usage and API costs
3. Collect user feedback
4. Iterate and improve based on analytics
5. Consider setting up custom domain for branding

**Your PTE Mock Test is now live! 🎉**