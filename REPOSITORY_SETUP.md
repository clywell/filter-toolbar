# Repository Setup Guide

This guide explains how to properly configure your GitHub repository for the automated CI/CD pipeline.

## 🔧 Repository Settings

### 1. Enable GitHub Actions

1. Go to your repository settings
2. Navigate to **Actions** → **General**
3. Under "Actions permissions", select "Allow all actions and reusable workflows"
4. Under "Workflow permissions", select "Read and write permissions"
5. Check "Allow GitHub Actions to create and approve pull requests"

### 2. Configure Branch Protection (Optional but Recommended)

1. Go to **Settings** → **Branches**
2. Click "Add rule" for `main` branch
3. Configure protection rules:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators (optional)
   - ❌ Restrict pushes that create files larger than 100MB

**Important**: If you enable branch protection, make sure to allow GitHub Actions to bypass push restrictions:
- Under "Restrict pushes that create files larger than 100MB", add `github-actions[bot]` to the exceptions

### 3. Set Up Secrets

#### Required Secrets:
1. **NPM_TOKEN** (for NPM publishing)
   - Go to [npmjs.com](https://www.npmjs.com/) → Profile → Access Tokens
   - Create "Automation" token
   - Copy the token (starts with `npm_`)
   - In GitHub: Settings → Secrets and variables → Actions → New repository secret
   - Name: `NPM_TOKEN`, Value: your token

#### Optional Secrets (if you need enhanced permissions):
2. **PERSONAL_ACCESS_TOKEN** (if standard permissions aren't enough)
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token with `repo` and `workflow` scopes
   - In GitHub repo: Settings → Secrets and variables → Actions → New repository secret
   - Name: `PERSONAL_ACCESS_TOKEN`, Value: your token

## 🚀 Testing the Setup

### Test CI/CD Pipeline
1. Make a small change to README.md
2. Commit and push to main branch
3. Check Actions tab to see if workflow runs successfully

### Test Release Pipeline
1. Go to Actions tab in your repository
2. Select "Release" workflow
3. Click "Run workflow"
4. Choose version type (patch/minor/major)
5. Run workflow and check results

## ⚠️ Troubleshooting Common Issues

### Permission Denied (403) Error
```
remote: Permission to clywell/filter-toolbar.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/clywell/filter-toolbar/': The requested URL returned error: 403
```

**Solutions:**
1. **Check Workflow Permissions** (Most Common)
   - Settings → Actions → General → Workflow permissions
   - Select "Read and write permissions"

2. **Branch Protection Override**
   - If main branch is protected, ensure GitHub Actions can push
   - Settings → Branches → main → Edit rule
   - Allow force pushes → Everyone (or add github-actions[bot])

3. **Repository Permissions**
   - Ensure you have admin access to the repository
   - Repository must be public for free GitHub Actions (or paid plan for private)

### NPM Publishing Failed
```
npm ERR! 401 Unauthorized
```

**Solutions:**
1. **Check NPM Token**
   - Verify NPM_TOKEN secret is set correctly
   - Token must have "Automation" scope
   - Token must be for the correct NPM account

2. **Package Name Conflict**
   - Check if package name is already taken
   - Use scoped package (@yourorg/package-name)

3. **NPM Account Issues**
   - Verify NPM account has publishing permissions
   - Check if organization exists for scoped packages

### Build Failures
```
npm ERR! peer dep missing
```

**Solutions:**
1. **Clean Dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Update Package Versions**
   - Check for conflicting peer dependencies
   - Update dependencies to compatible versions

## 📋 Pre-Publication Checklist

Before your first release:

- [ ] Repository has correct permissions (read/write for Actions)
- [ ] NPM_TOKEN secret is configured
- [ ] Package name is available on NPM
- [ ] All tests pass locally (`npm test`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Version in package.json is correct
- [ ] CHANGELOG.md is up to date
- [ ] README.md has proper installation instructions

## 🔄 Workflow Overview

### Automatic Triggers:
- **Push to main/develop**: Runs tests and builds
- **Pull Request**: Runs tests, builds, and package analysis
- **Release Published**: Automatically publishes to NPM

### Manual Triggers:
- **Release Workflow**: Creates version bump, changelog, git tag, and GitHub release

### Workflow Permissions:
- **CI/CD**: `contents: read`, `actions: read`, `checks: write`
- **Release**: `contents: write`, `pull-requests: write`, `issues: write`

---

**Need Help?** 
- 📖 [GitHub Actions Documentation](https://docs.github.com/en/actions)
- 📖 [NPM Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- 🐛 [Open an Issue](https://github.com/clywell/filter-toolbar/issues)