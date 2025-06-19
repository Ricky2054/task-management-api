#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Task Management API Quick Start');
console.log('=====================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📋 Creating .env file from template...');
  try {
    fs.copyFileSync(path.join(__dirname, 'env.example'), envPath);
    console.log('✅ .env file created successfully!\n');
  } catch (error) {
    console.log('❌ Failed to create .env file. Please copy env.example to .env manually.\n');
  }
}

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully!\n');
  } catch (error) {
    console.log('❌ Failed to install dependencies. Please run "npm install" manually.\n');
    process.exit(1);
  }
}

console.log('🌱 Seeding database with sample data...');
try {
  execSync('npm run seed', { stdio: 'inherit' });
  console.log('✅ Database seeded successfully!\n');
} catch (error) {
  console.log('⚠️ Database seeding failed. You can run "npm run seed" later.\n');
}

console.log('🎉 Setup complete! Starting the server...\n');
console.log('📖 Visit the following URLs:');
console.log('   - API Health: http://localhost:5000/health');
console.log('   - API Info: http://localhost:5000/api');
console.log('   - Tasks: http://localhost:5000/api/tasks');
console.log('   - Frontend: http://localhost:3000 (if running React app)\n');

console.log('📚 Quick commands:');
console.log('   - Start server: npm start');
console.log('   - Development mode: npm run dev');
console.log('   - Seed database: npm run seed');
console.log('   - Start frontend: cd client && npm start\n');

// Start the server
try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.log('❌ Failed to start server. Please run "npm run dev" manually.');
} 