# Package Installation Guide

## 🚀 Essential Backend Packages

Run this command to install all important packages:

```bash
npm install dotenv helmet express-rate-limit compression morgan uuid
```

## 🛠️ Development Packages

```bash
npm install --save-dev eslint prettier jest supertest @types/node
```

## 📦 Package Details

### Production Dependencies

| Package | Purpose | Priority |
|---------|---------|----------|
| `dotenv` | Environment variables | High - Security |
| `helmet` | Security headers | High - Security |
| `express-rate-limit` | Rate limiting | High - Security |
| `compression` | Gzip compression | High - Performance |
| `morgan` | HTTP logging | Medium - Monitoring |
| `uuid` | Unique ID generation | Medium - Utility |

### Development Dependencies  

| Package | Purpose | Priority |
|---------|---------|----------|
| `nodemon` | Auto-restart | High - DX |
| `eslint` | Code linting | High - Quality |
| `prettier` | Code formatting | High - Quality |
| `jest` | Testing framework | Medium - Quality |
| `supertest` | API testing | Medium - Testing |

## 🔧 Optional Enhancements

### Database Support (if you want to save resumes)
```bash
npm install mongodb mongoose  # MongoDB
# OR
npm install pg sequelize     # PostgreSQL  
```

### Advanced Features
```bash
npm install multer           # File upload handling
npm install jsonwebtoken     # JWT authentication
npm install bcryptjs         # Password hashing
npm install nodemailer       # Email sending
```

### Performance Monitoring
```bash
npm install clinic pino      # Performance profiling
npm install newrelic         # APM monitoring (production)
```

## ⚡ Quick Install Script

Save this as `install-packages.sh`:

```bash
#!/bin/bash
echo "📦 Installing Resume Builder backend packages..."

# Essential production packages
npm install dotenv helmet express-rate-limit compression morgan uuid

# Development packages  
npm install --save-dev eslint prettier jest supertest @types/node

echo "✅ Package installation complete!"
echo "🔧 Run 'npm run setup' to verify installation"
```