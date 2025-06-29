# 🚀 Keploy API Testing Setup Guide

This guide will walk you through setting up and using Keploy for AI-powered API testing in your task management project.

## 📋 Prerequisites

Before setting up Keploy, ensure you have:

- ✅ Node.js (v14+ recommended)
- ✅ MongoDB (local or cloud)
- ✅ Git repository with GitHub Actions enabled
- ✅ Task Management API running locally

## 🛠️ Installation Steps

### Step 1: Install Keploy CLI

#### For Linux/macOS:
```bash
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/keploy /usr/local/bin/keploy
```

#### For Windows:
```powershell
# Download and extract Keploy binary
Invoke-WebRequest -Uri "https://github.com/keploy/keploy/releases/latest/download/keploy_windows_amd64.zip" -OutFile "keploy.zip"
Expand-Archive -Path "keploy.zip" -DestinationPath "."
# Add to PATH or use directly
```

#### Verify Installation:
```bash
keploy --version
```

### Step 2: Project Configuration

The project already includes the necessary Keploy configuration files:

- `keploy.yml` - Keploy configuration
- `openapi.yaml` - OpenAPI 3.0 specification
- `.github/workflows/api-testing.yml` - CI/CD pipeline

### Step 3: Environment Setup

1. **Create environment file**:
   ```bash
   cp env.example .env
   ```

2. **Update configuration**:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskmanagement
   ```

## 🧪 Running API Tests

### Local Testing

1. **Start your application**:
   ```bash
   npm start
   ```

2. **Run comprehensive API tests**:
   ```bash
   npm run test:keploy
   ```

3. **Validate OpenAPI schema**:
   ```bash
   npm run test:openapi
   ```

### Using Keploy Dashboard

1. **Access Keploy Dashboard**: Visit [Keploy Console](https://app.keploy.io)

2. **Connect your project**:
   - Sign up/Login to Keploy
   - Connect your GitHub repository
   - Upload your OpenAPI specification

3. **Generate test cases**:
   - Keploy will automatically generate test cases from your OpenAPI spec
   - AI will create comprehensive test scenarios
   - Tests will cover all endpoints, edge cases, and error conditions

4. **Run tests**:
   - Execute tests locally or in CI/CD
   - View detailed test reports
   - Monitor API performance and reliability

## 🏗️ CI/CD Integration

### GitHub Actions Setup

The project includes a complete GitHub Actions workflow that:

1. **Sets up the testing environment**
2. **Installs dependencies and Keploy CLI**
3. **Starts MongoDB and the application**
4. **Runs comprehensive API tests**
5. **Generates test reports**
6. **Uploads artifacts for review**

### Triggering the Pipeline

The pipeline runs automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual workflow dispatch

### Viewing Results

1. **GitHub Actions tab**: View pipeline execution logs
2. **Artifacts**: Download test reports and coverage data
3. **Status badges**: Monitor pipeline status in README

## 📊 Test Reports and Screenshots

After running the tests, you should capture screenshots for documentation:

### Required Screenshots:

1. **Keploy Dashboard** (`docs/screenshots/keploy-dashboard.png`)
   - Overview of your project in Keploy console
   - Test execution summary
   - AI-generated test scenarios

2. **API Test Results** (`docs/screenshots/api-test-results.png`)
   - Detailed test results for each endpoint
   - Pass/fail status for all test cases
   - Response time metrics

3. **CI/CD Pipeline** (`docs/screenshots/cicd-pipeline.png`)
   - GitHub Actions workflow execution
   - All pipeline steps completed successfully
   - Test coverage and quality metrics

4. **Test Coverage Report** (`docs/screenshots/test-coverage.png`)
   - Comprehensive test coverage statistics
   - Coverage by endpoint and functionality
   - Quality assurance metrics

### How to Capture Screenshots:

1. **Run the complete test suite**:
   ```bash
   npm run test:keploy
   ```

2. **Access Keploy Dashboard** and navigate to your project

3. **Take screenshots** of the test execution and results

4. **Save screenshots** in the `docs/screenshots/` directory

5. **Update README.md** with actual screenshot paths

## 🔧 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**:
   ```bash
   # Ensure MongoDB is running
   sudo systemctl start mongod
   # Or use Docker
   docker run -d -p 27017:27017 mongo:latest
   ```

2. **Port Already in Use**:
   ```bash
   # Kill process using port 5000
   lsof -ti:5000 | xargs kill -9
   ```

3. **Keploy CLI Not Found**:
   ```bash
   # Add to PATH or use full path
   export PATH=$PATH:/usr/local/bin
   ```

4. **OpenAPI Validation Errors**:
   ```bash
   # Install swagger-codegen-cli
   npm install -g swagger-codegen-cli
   # Validate schema
   swagger-codegen-cli validate -i openapi.yaml
   ```

### Getting Help:

- 📚 [Keploy Documentation](https://docs.keploy.io)
- 💬 [Keploy Community](https://discord.gg/keploy)
- 🐛 [GitHub Issues](https://github.com/keploy/keploy/issues)

## 🎯 Best Practices

1. **Keep OpenAPI Spec Updated**:
   - Update `openapi.yaml` when adding new endpoints
   - Include detailed descriptions and examples
   - Validate schema regularly

2. **Monitor Test Coverage**:
   - Aim for 100% endpoint coverage
   - Include edge cases and error scenarios
   - Test with different data sets

3. **Regular Test Execution**:
   - Run tests before each deployment
   - Monitor API performance metrics
   - Review test reports regularly

4. **Documentation**:
   - Keep screenshots updated
   - Document any custom test configurations
   - Share test reports with team members

## 🚀 Next Steps

1. **Set up Keploy account** and connect your repository
2. **Run the initial test suite** and capture screenshots
3. **Integrate additional test scenarios** based on your specific requirements
4. **Set up monitoring and alerting** for continuous API health checks
5. **Share the setup** with your team for collaborative testing

---

## 📝 Notes

- This setup provides comprehensive API testing with minimal manual effort
- Keploy's AI capabilities automatically generate test cases from your OpenAPI specification
- The CI/CD integration ensures continuous quality assurance
- All test reports and metrics are automatically generated and archived

For any questions or issues, refer to the troubleshooting section or reach out to the Keploy community for support. 