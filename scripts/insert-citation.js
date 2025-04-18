#!/usr/bin/env node

/**
 * Citation Helper - Inserts citations into markdown files from sources index
 * Usage: node insert-citation.js [sourceId]
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Load the sources index
function loadSourcesIndex() {
  try {
    const yamlPath = path.join(process.cwd(), 'sources/index.yaml');
    if (!fs.existsSync(yamlPath)) {
      console.error('Error: sources/index.yaml not found');
      process.exit(1);
    }
    
    const content = fs.readFileSync(yamlPath, 'utf8');
    const data = yaml.load(content);
    return data.sources || {};
  } catch (error) {
    console.error('Failed to load sources index:', error);
    process.exit(1);
  }
}

// List all available sources
function listSources(sources) {
  console.log('\nAvailable sources:');
  console.log('------------------');
  
  Object.entries(sources).forEach(([id, source]) => {
    console.log(`${id}: "${source.title}" by ${source.author} (${source.year})`);
  });
  
  console.log('\nUsage: node insert-citation.js SOURCE_ID');
  console.log('Example: node insert-citation.js SYSTEMS_THINKING_2023\n');
}

// Main function
function main() {
  const sources = loadSourcesIndex();
  
  // If no arguments provided, list all sources
  if (process.argv.length < 3) {
    listSources(sources);
    return;
  }
  
  const sourceId = process.argv[2];
  
  // Check if the source exists
  if (!sources[sourceId]) {
    console.error(`Error: Source ID '${sourceId}' not found in sources index`);
    listSources(sources);
    return;
  }
  
  // Generate the citation text
  const citationText = `<!-- cite: ${sourceId} -->`;
  
  // Print for copying to clipboard
  console.log('\nCitation generated:');
  console.log('------------------');
  console.log(citationText);
  console.log('\nCitation details:');
  console.log('------------------');
  const source = sources[sourceId];
  console.log(`Title: ${source.title}`);
  console.log(`Author: ${source.author}`);
  console.log(`Year: ${source.year}`);
  console.log(`Type: ${source.type}`);
  console.log('\nCopy the citation text above to insert into your document.\n');
}

main(); 