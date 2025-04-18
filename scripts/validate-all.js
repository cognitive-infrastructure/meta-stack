#!/usr/bin/env node

/**
 * Script to validate all JSON files against their respective schemas.
 * 
 * Usage: node scripts/validate-all.js
 */

const { exec } = require('child_process');
const path = require('path');

console.log('Validating all JSON files against their schemas...');

// Validate concept, pattern, and anti-pattern JSON files
const validateCoreCmd = 'npx ajv validate -s json/meta/ci-schema.json -r "json/meta/*.json" -d "json/{core-concepts,patterns,anti-patterns}/*.json"';

// Validate document JSON files
const validateDocsCmd = 'npx ajv validate -s json/meta/ci-document-schema.json -r "json/meta/*.json" -d "json/docs/**/*.json"';

// Execute validation commands
console.log('\n1. Validating core concepts, patterns, and anti-patterns:');
exec(validateCoreCmd, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error validating core files: ${error.message}`);
    console.log(stderr);
    return;
  }
  
  console.log(stdout || 'All core JSON files are valid!');
  
  console.log('\n2. Validating document JSON files:');
  exec(validateDocsCmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error validating document files: ${error.message}`);
      console.log(stderr);
      return;
    }
    
    console.log(stdout || 'All document JSON files are valid!');
    console.log('\nValidation complete! All JSON files conform to their schemas.');
  });
}); 