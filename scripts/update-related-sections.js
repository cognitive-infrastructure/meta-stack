#!/usr/bin/env node

/**
 * Script to update the "## Related" sections in all markdown files
 * and update corresponding JSON files with consistent relatedConcepts data.
 * 
 * Usage: node scripts/update-related-sections.js
 */

const fs = require('fs');
const path = require('path');

// Directories to process
const CORE_CONCEPTS_DIR = 'core-concepts';
const PATTERNS_DIR = 'patterns-and-anti-patterns/patterns';
const ANTI_PATTERNS_DIR = 'patterns-and-anti-patterns/anti-patterns';

// JSON file directories
const JSON_CORE_CONCEPTS_DIR = 'json/core-concepts';
const JSON_PATTERNS_DIR = 'json/patterns';
const JSON_ANTI_PATTERNS_DIR = 'json/anti-patterns';

// Map of directories to help with navigation and relationship building
const directoryMap = {
  'core-concepts': {
    markdownDir: CORE_CONCEPTS_DIR,
    jsonDir: JSON_CORE_CONCEPTS_DIR,
    idPrefix: 'ci:concept.',
    linkPrefix: '', // Will be calculated based on source file
    displayName: 'Core Concept',
    type: 'concept'
  },
  'patterns': {
    markdownDir: PATTERNS_DIR,
    jsonDir: JSON_PATTERNS_DIR,
    idPrefix: 'ci:pattern.',
    linkPrefix: '', // Will be calculated based on source file
    displayName: 'Pattern',
    type: 'pattern'
  },
  'anti-patterns': {
    markdownDir: ANTI_PATTERNS_DIR,
    jsonDir: JSON_ANTI_PATTERNS_DIR,
    idPrefix: 'ci:antipattern.',
    linkPrefix: '', // Will be calculated based on source file
    displayName: 'Anti-Pattern',
    type: 'antipattern'
  }
};

// Mapping of filenames to titles
const conceptMap = {};

// Calculate relative path between two files
function getRelativePath(fromPath, toPath) {
  const fromDir = path.dirname(fromPath);
  const toDir = path.dirname(toPath);
  const relativePath = path.relative(fromDir, toDir);
  
  if (relativePath) {
    return path.join(relativePath, path.basename(toPath));
  } else {
    return path.basename(toPath);
  }
}

// Read all files and build concept map
function buildConceptMap() {
  for (const key in directoryMap) {
    const dirInfo = directoryMap[key];
    
    if (!fs.existsSync(dirInfo.markdownDir)) {
      console.log(`Directory ${dirInfo.markdownDir} does not exist. Skipping.`);
      continue;
    }
    
    const files = fs.readdirSync(dirInfo.markdownDir)
      .filter(file => file.endsWith('.md') && !file.startsWith('README'));
    
    files.forEach(file => {
      const baseName = path.basename(file, '.md');
      const filePath = path.join(dirInfo.markdownDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Extract title from the first heading or use the filename
      let title = baseName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      const titleMatch = fileContent.match(/^# (.*)/m);
      if (titleMatch) {
        title = titleMatch[1].trim();
      }
      
      conceptMap[baseName] = {
        title,
        file,
        path: filePath,
        jsonPath: path.join(dirInfo.jsonDir, baseName + '.json'),
        type: dirInfo.type,
        idPrefix: dirInfo.idPrefix,
        displayName: dirInfo.displayName
      };
    });
  }
  
  console.log(`Built concept map with ${Object.keys(conceptMap).length} entries.`);
}

// Find related concepts based on content similarity and mentions
function findRelatedConcepts(conceptKey) {
  const concept = conceptMap[conceptKey];
  if (!concept) return [];
  
  // Read the content of the concept file
  const content = fs.readFileSync(concept.path, 'utf8');
  
  // Build a list of related concepts by checking mentions
  const related = [];
  
  for (const otherKey in conceptMap) {
    if (otherKey === conceptKey) continue; // Skip self
    
    const otherConcept = conceptMap[otherKey];
    
    // Check if this concept is mentioned in the content
    const regex = new RegExp(otherConcept.title.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
    if (regex.test(content)) {
      related.push(otherKey);
    }
  }
  
  // Limit to max 5 related concepts
  return related.slice(0, 5);
}

// Update the Related section in a markdown file
function updateMarkdownRelatedSection(conceptKey, relatedKeys) {
  const concept = conceptMap[conceptKey];
  let content = fs.readFileSync(concept.path, 'utf8');
  
  // Generate the new related section content
  let relatedSection = '## Related\n\n';
  
  if (relatedKeys.length === 0) {
    relatedSection += 'No directly related concepts identified yet.\n';
  } else {
    relatedKeys.forEach(relKey => {
      const relConcept = conceptMap[relKey];
      if (relConcept) {
        // Calculate the relative path from this file to the related file
        const relativePath = getRelativePath(concept.path, relConcept.path);
        relatedSection += `- [${relConcept.title}](${relativePath}) (${relConcept.displayName})\n`;
      }
    });
  }
  
  // Remove all existing Related sections to avoid duplicates
  // First, check if there are any ## Related sections
  const relatedSectionRegex = /## Related[\s\S]*?(?=##|$)/g;
  const relatedMatches = content.match(relatedSectionRegex);
  
  if (relatedMatches && relatedMatches.length > 0) {
    // Remove all existing Related sections
    content = content.replace(relatedSectionRegex, '');
    
    // Add a new Related section just before the end or before any <details> section
    const detailsPosition = content.indexOf('<details>');
    if (detailsPosition !== -1) {
      // Add before <details>
      content = content.slice(0, detailsPosition) + '\n' + relatedSection + '\n' + content.slice(detailsPosition);
    } else {
      // Add at the end
      content = content + '\n\n' + relatedSection;
    }
  } else {
    // No Related section exists, add at the end
    content = content + '\n\n' + relatedSection;
  }
  
  fs.writeFileSync(concept.path, content);
  console.log(`Updated Related section in ${concept.path}`);
}

// Update the relatedConcepts field in a JSON file
function updateJsonRelatedConcepts(conceptKey, relatedKeys) {
  const concept = conceptMap[conceptKey];
  
  if (!fs.existsSync(concept.jsonPath)) {
    console.log(`JSON file ${concept.jsonPath} does not exist. Skipping.`);
    return;
  }
  
  try {
    const jsonContent = JSON.parse(fs.readFileSync(concept.jsonPath, 'utf8'));
    
    // Update relatedConcepts with full IDs
    jsonContent.relatedConcepts = relatedKeys.map(relKey => {
      const relConcept = conceptMap[relKey];
      return relConcept ? relConcept.idPrefix + relKey : '';
    }).filter(Boolean);
    
    fs.writeFileSync(concept.jsonPath, JSON.stringify(jsonContent, null, 2));
    console.log(`Updated relatedConcepts in ${concept.jsonPath}`);
  } catch (error) {
    console.error(`Error updating JSON for ${conceptKey}:`, error.message);
  }
}

// Process all concepts
function processAllConcepts() {
  for (const conceptKey in conceptMap) {
    console.log(`Processing ${conceptKey}...`);
    const relatedKeys = findRelatedConcepts(conceptKey);
    
    console.log(`  Found ${relatedKeys.length} related concepts for ${conceptKey}`);
    
    updateMarkdownRelatedSection(conceptKey, relatedKeys);
    updateJsonRelatedConcepts(conceptKey, relatedKeys);
  }
}

// Main execution
console.log('Updating Related sections in markdown files and relatedConcepts in JSON files...');
buildConceptMap();
processAllConcepts();
console.log('Done!'); 