#!/usr/bin/env node

/**
 * Script to generate TypeScript API client from OpenAPI specification
 * Run with: npm run generate-api-client
 */

const { execSync } = require('child_process');
const path = require('path');

const openApiPath = path.join(__dirname, '..', 'openApi.json');
const outputPath = path.join(__dirname, '..', 'lib', 'api-client');

console.log('🔄 Generating TypeScript API client...');
console.log(`📁 Input: ${openApiPath}`);
console.log(`📁 Output: ${outputPath}`);

try {
  const command = `npx @hey-api/openapi-ts -i ${openApiPath} -o ${outputPath}`;
  execSync(command, { stdio: 'inherit' });
  console.log('✅ API client generated successfully!');
} catch (error) {
  console.error('❌ Failed to generate API client:', error.message);
  process.exit(1);
}
