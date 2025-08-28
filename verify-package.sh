#!/bin/bash

echo "🔍 Filter Toolbar Package Verification"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in package root directory${NC}"
    echo "Please run this script from the filter-toolbar package root"
    exit 1
fi

echo -e "${BLUE}📦 Package Information${NC}"
echo "----------------------"
PACKAGE_NAME=$(node -p "require('./package.json').name")
PACKAGE_VERSION=$(node -p "require('./package.json').version")
echo "Name: $PACKAGE_NAME"
echo "Version: $PACKAGE_VERSION"
echo ""

echo -e "${BLUE}📁 File Structure Check${NC}"
echo "----------------------"

# Check required files
files=(
    "package.json"
    "README.md"
    "LICENSE"
    "CHANGELOG.md"
    "tsconfig.json"
    "rollup.config.js"
    "src/index.ts"
    "src/styles.css"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file${NC}"
    fi
done

echo ""

echo -e "${BLUE}🔧 Dependencies Check${NC}"
echo "---------------------"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules exists${NC}"
else
    echo -e "${YELLOW}⚠️  node_modules not found - run 'npm install'${NC}"
fi

# Check if package-lock.json exists
if [ -f "package-lock.json" ]; then
    echo -e "${GREEN}✅ package-lock.json exists${NC}"
else
    echo -e "${YELLOW}⚠️  package-lock.json not found${NC}"
fi

echo ""

echo -e "${BLUE}🏗️  Build Test${NC}"
echo "---------------"

# Test if the package builds
echo "Running build test..."
npm run build > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
    
    # Check dist files
    if [ -d "dist" ]; then
        echo -e "${GREEN}✅ dist/ directory created${NC}"
        
        if [ -f "dist/index.js" ]; then
            echo -e "${GREEN}✅ dist/index.js exists${NC}"
        else
            echo -e "${RED}❌ dist/index.js missing${NC}"
        fi
        
        if [ -f "dist/index.d.ts" ]; then
            echo -e "${GREEN}✅ dist/index.d.ts exists${NC}"
        else
            echo -e "${RED}❌ dist/index.d.ts missing${NC}"
        fi
        
        if [ -f "dist/styles.css" ]; then
            echo -e "${GREEN}✅ dist/styles.css exists${NC}"
        else
            echo -e "${RED}❌ dist/styles.css missing${NC}"
        fi
    else
        echo -e "${RED}❌ dist/ directory not created${NC}"
    fi
else
    echo -e "${RED}❌ Build failed${NC}"
    echo "Run 'npm run build' manually to see errors"
fi

echo ""

echo -e "${BLUE}📋 TypeScript Check${NC}"
echo "------------------"

npm run type-check > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ TypeScript types are valid${NC}"
else
    echo -e "${RED}❌ TypeScript errors found${NC}"
    echo "Run 'npm run type-check' to see details"
fi

echo ""

echo -e "${BLUE}🎨 Styling Check${NC}"
echo "----------------"

if [ -f "src/styles.css" ]; then
    CSS_VARS=$(grep -c "^[[:space:]]*--" src/styles.css)
    echo -e "${GREEN}✅ CSS file contains $CSS_VARS variables${NC}"
else
    echo -e "${RED}❌ CSS file not found${NC}"
fi

echo ""

echo -e "${BLUE}📚 Documentation Check${NC}"
echo "----------------------"

# Check README sections
readme_sections=(
    "# @clywell/filter-toolbar"
    "## Installation"
    "## Quick Start"
    "## API Reference"
)

for section in "${readme_sections[@]}"; do
    if grep -q "$section" README.md; then
        echo -e "${GREEN}✅ README contains: $section${NC}"
    else
        echo -e "${YELLOW}⚠️  README missing: $section${NC}"
    fi
done

echo ""

echo -e "${BLUE}🚀 GitHub Actions Check${NC}"
echo "------------------------"

if [ -d ".github/workflows" ]; then
    echo -e "${GREEN}✅ .github/workflows directory exists${NC}"
    
    if [ -f ".github/workflows/ci-cd.yml" ]; then
        echo -e "${GREEN}✅ CI/CD workflow exists${NC}"
    else
        echo -e "${RED}❌ CI/CD workflow missing${NC}"
    fi
    
    if [ -f ".github/workflows/release.yml" ]; then
        echo -e "${GREEN}✅ Release workflow exists${NC}"
    else
        echo -e "${RED}❌ Release workflow missing${NC}"
    fi
else
    echo -e "${RED}❌ .github/workflows directory missing${NC}"
fi

echo ""

echo -e "${BLUE}📦 Package.json Validation${NC}"
echo "-------------------------"

# Check package.json fields
required_fields=(
    "name"
    "version"
    "description"
    "main"
    "types"
    "files"
    "scripts.build"
    "peerDependencies"
)

for field in "${required_fields[@]}"; do
    if node -p "require('./package.json').$field" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ package.json has $field${NC}"
    else
        echo -e "${RED}❌ package.json missing $field${NC}"
    fi
done

echo ""

echo -e "${BLUE}🔐 Security Check${NC}"
echo "----------------"

if [ -f "SECURITY.md" ]; then
    echo -e "${GREEN}✅ SECURITY.md exists${NC}"
else
    echo -e "${YELLOW}⚠️  SECURITY.md missing${NC}"
fi

if [ -f ".gitignore" ]; then
    echo -e "${GREEN}✅ .gitignore exists${NC}"
else
    echo -e "${RED}❌ .gitignore missing${NC}"
fi

echo ""

echo -e "${BLUE}📋 Pre-publish Checklist${NC}"
echo "----------------------------"
echo ""
echo "Before publishing, ensure:"
echo "🔹 NPM account is set up"
echo "🔹 GitHub repository is created"
echo "🔹 NPM_TOKEN secret is configured in GitHub"
echo "🔹 All tests pass"
echo "🔹 Documentation is complete"
echo "🔹 Version number is correct"
echo ""

echo -e "${GREEN}🎉 Verification Complete!${NC}"
echo ""

if [ -d "dist" ] && [ -f "dist/index.js" ] && [ -f "dist/index.d.ts" ]; then
    echo -e "${GREEN}✅ Package appears ready for publication!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Create GitHub repository"
    echo "2. Push code to GitHub"
    echo "3. Set up NPM_TOKEN secret"
    echo "4. Create first release"
else
    echo -e "${YELLOW}⚠️  Package needs attention before publication${NC}"
fi