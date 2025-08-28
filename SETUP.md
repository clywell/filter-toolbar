# Getting Started with @clywell/filter-toolbar

This guide will help you set up and publish the filter-toolbar package.

## Prerequisites

1. **GitHub Account**: You'll need a GitHub account to host the repository
2. **NPM Account**: Create an account at [npmjs.com](https://www.npmjs.com/)
3. **Git**: Ensure git is installed and configured

## Repository Setup

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com/) and click "New repository"
2. Name it `filter-toolbar`
3. Set owner to `clywell` (your organization)
4. Make it public (required for free NPM publishing)
5. Don't initialize with README (we already have files)

### 2. Push Code to GitHub

```bash
cd /Users/sodiqyekeen/Documents/dev/filter-toolbar

# Initialize git if not already done
git init

# Add GitHub remote (replace with your actual repository URL)
git remote add origin https://github.com/clywell/filter-toolbar.git

# Add all files
git add .

# Commit initial version
git commit -m "feat: initial filter-toolbar package"

# Push to GitHub
git push -u origin main
```

## NPM Setup

### 1. Create NPM Account
1. Go to [npmjs.com](https://www.npmjs.com/)
2. Sign up or sign in
3. Verify your email address

### 2. Set up NPM Organization (Optional but Recommended)
1. Go to [npmjs.com/org/create](https://www.npmjs.com/org/create)
2. Create organization named `clywell`
3. This allows you to publish as `@clywell/filter-toolbar`

### 3. Generate NPM Access Token
1. Go to [npmjs.com](https://www.npmjs.com/) → Profile → Access Tokens
2. Click "Generate New Token"
3. Choose "Automation" for CI/CD use
4. Copy the token (starts with `npm_`)

### 4. Add NPM Token to GitHub

1. Go to your GitHub repository
2. Click "Settings" tab
3. Go to "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Name: `NPM_TOKEN`
6. Value: Your NPM token from step 3
7. Click "Add secret"

## Initial Publication

### Option 1: Manual First Release

```bash
# Make sure you're logged into NPM
npm login

# Publish the first version
npm publish --access public
```

### Option 2: Automated Release (Recommended)

1. Go to your GitHub repository
2. Click "Actions" tab
3. Find "Manual Release" workflow
4. Click "Run workflow"
5. Choose version type (patch/minor/major)
6. The workflow will:
   - Bump version
   - Create git tag
   - Publish to NPM
   - Create GitHub release

## Verification

After publishing, verify the package:

1. **NPM Registry**: Visit `https://www.npmjs.com/package/@clywell/filter-toolbar`
2. **Installation Test**: 
   ```bash
   npm install @clywell/filter-toolbar
   ```

## Automatic Updates

Once set up, the CI/CD pipeline will:

- ✅ **Test** all pull requests
- ✅ **Analyze** package size and quality
- ✅ **Publish** automatically on releases
- ✅ **Generate** changelogs
- ✅ **Create** GitHub releases

## Next Steps

1. **Documentation**: Update README.md with usage examples
2. **Examples**: Add example implementations in `examples/` folder
3. **Tests**: Add comprehensive test suite
4. **TypeScript**: Ensure all types are properly exported

## Troubleshooting

### Common Issues

1. **NPM Token Invalid**: Regenerate token with "Automation" permission
2. **Package Name Taken**: Use scoped name `@yourorg/filter-toolbar`
3. **Permission Denied**: Ensure you own the NPM organization
4. **Git Push Fails**: Check remote URL and authentication

### Getting Help

- 📖 [NPM Documentation](https://docs.npmjs.com/)
- 📖 [GitHub Actions Documentation](https://docs.github.com/en/actions)
- 🐛 Open an issue in the repository

---

**Ready to publish?** Follow the steps above and your package will be live on NPM! 🚀