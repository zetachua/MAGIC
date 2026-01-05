# MAGIC - Career Mentor Chat Application

A full-stack application featuring a React frontend deployed on GitHub Pages and a Node.js/Express backend deployed on Fly.io.

## 🌐 Live URLs

- **Frontend**: https://zetachua.github.io/MAGIC/
- **Backend API**: https://magic-cindy.fly.dev

---

## 📋 Prerequisites

Before deploying, ensure you have:

- **Node.js** (v20 or higher)
- **npm** or **yarn**
- **Git** installed and configured
- **Fly.io CLI** installed (`curl -L https://fly.io/install.sh | sh`)
- **GitHub account** with repository access
- **Fly.io account** with app `magic-cindy` created
- **Environment variables**:
  - `GROQ_API_KEY` - Your Groq API key for the LLM
  - `PORT` - Server port (defaults to 8080 on Fly.io)

---

## 🚀 Deployment Guide

### Backend Deployment (Fly.io)

Deploy your server changes to Fly.io:

```bash
# 1. Navigate to server directory
cd server

# 2. Make sure you're logged into Fly.io
fly auth login

# 3. Set/update environment variables (if needed)
fly secrets set GROQ_API_KEY=your_groq_api_key PORT=8080 -a magic-cindy

# 4. Deploy to Fly.io
fly deploy -a magic-cindy
```

**What happens:**
- Fly.io builds a Docker image from `server/Dockerfile`
- Uploads and deploys it to `https://magic-cindy.fly.dev`
- Your API endpoints are immediately available

**Verify deployment:**
```bash
curl -X POST https://magic-cindy.fly.dev/api/mentor-chat \
  -H "Content-Type: application/json" \
  -d '{"userInput":"Hello","userId":"test"}'
```

---

### Frontend Deployment (GitHub Pages)

Deploy your frontend changes to GitHub Pages:

```bash
# 1. Navigate to project root
cd /Users/zetachua/Documents/GitHub/MAGIC

# 2. Make sure you're on main branch
git checkout main

# 3. Navigate to client directory and build
cd client
npm install  # Only needed if dependencies changed
npm run build

# 4. Go back to project root
cd ..

# 5. Switch to gh-pages branch
git checkout gh-pages

# 6. Copy the new dist files to root
cp -r client/dist/* .

# 7. Stage and commit changes
git add index.html assets/ vite.svg
git commit -m "Update frontend with latest changes"

# 8. Push to GitHub
git push origin gh-pages

# 9. Switch back to main branch
git checkout main
```

**What happens:**
- Vite builds your React app into `client/dist/`
- Files are copied to the `gh-pages` branch root
- GitHub Pages automatically updates within 1-2 minutes
- Your site is live at `https://zetachua.github.io/MAGIC/`

**Note:** If you see new asset files (e.g., `index-XXXXX.js`), make sure to:
- Remove old asset files: `git rm assets/index-OLDHASH.js`
- Add new asset files: `git add assets/index-NEWHASH.js`

---

## 🔄 Quick Deployment Checklist

### For Backend Updates:
- [ ] Make changes in `server/` directory
- [ ] Test locally if needed
- [ ] Run `cd server && fly deploy -a magic-cindy`
- [ ] Verify API is working

### For Frontend Updates:
- [ ] Make changes in `client/src/` directory
- [ ] Run `cd client && npm run build`
- [ ] Switch to `gh-pages` branch
- [ ] Copy `client/dist/*` to root
- [ ] Commit and push `gh-pages` branch
- [ ] Switch back to `main` branch

### For Both Updates:
- [ ] Deploy backend first (Fly.io)
- [ ] Then deploy frontend (GitHub Pages)
- [ ] Test the live site

---

## 🛠️ Local Development

### Run Backend Locally

```bash
cd server

# Create .env file with:
# PORT=5050
# GROQ_API_KEY=your_key_here

npm install
node index.js
```

Backend runs on `http://localhost:5050`

### Run Frontend Locally

```bash
cd client

# Create .env.local file with:
# VITE_API_BASE_URL=http://localhost:5050

npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and proxies API calls to your local backend.

---

## 📁 Project Structure

```
MAGIC/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   └── App.jsx
│   ├── dist/              # Built files (for GitHub Pages)
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── data/
│   │   └── mentor_book.pdf
│   ├── index.js           # Main server file
│   ├── rag.js             # RAG implementation
│   ├── Dockerfile         # Fly.io build config
│   ├── fly.toml           # Fly.io deployment config
│   └── package.json
└── README.md              # This file
```

---

## 🔧 Configuration Files

### `server/fly.toml`
Fly.io deployment configuration. Contains:
- App name: `magic-cindy`
- Port: `8080`
- Region: `sin` (Singapore)

### `client/vite.config.js`
Vite build configuration. Contains:
- Base path: `/MAGIC/` (for GitHub Pages)
- Proxy config for local development

### CORS Configuration
The server allows requests from:
- `http://localhost:5173` (local dev)
- `https://zetachua.github.io` (GitHub Pages)
- `https://www.zetachua.github.io`
- `https://zetachua.github.io/MAGIC`

---

## 🐛 Troubleshooting

### Backend Issues

**"App does not have a Dockerfile"**
- Make sure `server/Dockerfile` exists
- Check that you're in the `server/` directory

**"Failed to initialize RAG"**
- Verify `server/data/mentor_book.pdf` exists
- Check that `GROQ_API_KEY` is set correctly

**CORS errors**
- Verify the frontend URL is in `server/index.js` allowed origins
- Check that you're using the correct API URL in frontend

### Frontend Issues

**"404 on GitHub Pages"**
- Ensure `base: '/MAGIC/'` is set in `vite.config.js`
- Check that `gh-pages` branch has `index.html` at root
- Verify GitHub Pages is configured to use `gh-pages` branch

**"API calls failing"**
- Check that backend is deployed and accessible
- Verify API URL in `MentorChatDialog.jsx` matches Fly.io URL
- Check browser console for CORS errors

**"Assets not loading"**
- Make sure all files in `client/dist/assets/` are committed
- Remove old asset files from git if filenames changed

---

## 📝 Notes

- The `client/dist/` folder is gitignored on `main` branch but tracked on `gh-pages` branch
- Always build the frontend before deploying to ensure latest changes
- Backend deploys are faster (~2-3 minutes) than frontend (~1-2 minutes for GitHub Pages)
- Environment variables on Fly.io persist between deployments

---

## 🔗 Useful Commands

```bash
# Check Fly.io app status
fly status -a magic-cindy

# View Fly.io logs
fly logs -a magic-cindy

# SSH into Fly.io instance
fly ssh console -a magic-cindy

# Check GitHub Pages deployment status
# Visit: https://github.com/zetachua/MAGIC/settings/pages
```

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Fly.io logs: `fly logs -a magic-cindy`
3. Check browser console for frontend errors
4. Verify environment variables are set correctly

---

**Last Updated:** January 2025



// update github pages fully
cd /Users/zetachua/Documents/GitHub/MAGIC

# Switch to gh-pages branch
git checkout gh-pages

# Remove old files
rm -rf assets/* index.html vite.svg

# Copy latest build files
cp -r client/dist/* .

# Check what we have
ls -la assets/

# Stage all changes
git add -A

# Remove old JS file if it exists
git rm assets/index-MJ7TUPZn.js 2>/dev/null || true

# Commit the update
git commit -m "Update frontend to latest version"

# Push to GitHub
git push origin gh-pages

# Switch back to main
git checkout main