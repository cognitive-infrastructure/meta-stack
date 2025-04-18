#!/usr/bin/env node

/**
 * clean-pending.js
 * 
 * A script to clean up processed files in the pending directory
 * 
 * Usage: node scripts/clean-pending.js [--force]
 * 
 * Options:
 *   --force  Delete files without confirmation
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Setup directories
const ROOT_DIR = process.cwd();
const PENDING_DIR = path.join(ROOT_DIR, 'knowledge-base', 'docs', 'pending');

// Parse command line arguments
const args = process.argv.slice(2);
const force = args.includes('--force');

// Function to prompt for confirmation
function confirm(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

// Main function
async function main() {
  console.log('Cleaning up processed files in the pending directory...');
  
  if (!fs.existsSync(PENDING_DIR)) {
    console.log('Pending directory not found:', PENDING_DIR);
    return;
  }
  
  // Find processed files
  const pendingFiles = fs.readdirSync(PENDING_DIR)
    .filter(file => file.endsWith('.processed'))
    .map(file => path.join(PENDING_DIR, file));
  
  if (pendingFiles.length === 0) {
    console.log('No processed files found in the pending directory.');
    return;
  }
  
  console.log(`Found ${pendingFiles.length} processed file(s):`);
  pendingFiles.forEach(file => console.log(`- ${path.basename(file)}`));
  
  // Confirm deletion
  let shouldDelete = force;
  if (!force) {
    shouldDelete = await confirm('Delete these files? (y/n) ');
  }
  
  if (shouldDelete) {
    // Delete the files
    pendingFiles.forEach(file => {
      fs.unlinkSync(file);
      console.log(`Deleted: ${file}`);
    });
    console.log('Cleanup completed successfully.');
  } else {
    console.log('Cleanup cancelled.');
  }
}

// Run the main function
main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
}); 