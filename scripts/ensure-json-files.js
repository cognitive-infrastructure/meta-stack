#!/usr/bin/env node

/**
 * Script to ensure all canonical source documents and epistemological source documents
 * have corresponding JSON files.
 * 
 * Usage: node scripts/ensure-json-files.js
 */

const fs = require('fs');
const path = require('path');

// Directories to check
const CANONICAL_DOC_DIR = 'docs/canonical-source-documents';
const EPISTEMOLOGICAL_DOC_DIR = 'docs/source-documents';
const JSON_CANONICAL_DIR = 'json/docs/canonical-source-documents';
const JSON_EPISTEMOLOGICAL_DIR = 'json/docs/source-documents';

// Create directories if they don't exist
[JSON_CANONICAL_DIR, JSON_EPISTEMOLOGICAL_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Template for canonical source JSON
function createCanonicalSourceJSON(filename, docPath) {
  // Extract the concept name from the filename
  const baseName = path.basename(filename, '-canonical-source.md');
  
  return {
    "@context": {
      "ci": "https://cognitiveinfrastructure.org/schema#",
      "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
      "schema": "http://schema.org/"
    },
    "@id": `ci:canonical-source.${baseName}`,
    "@type": "ci:CanonicalSource",
    "version": "1.0",
    "title": `${baseName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}: Canonical Source`,
    "category": "canonical-source",
    "author": "Rashid Azarang",
    "language": "en",
    "label": {
      "en": `${baseName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Canonical Source`
    },
    "description": {
      "en": `Comprehensive exploration of the ${baseName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} concept, including theoretical underpinnings, diagnostic frameworks, and real-world examples.`
    },
    "relatedConcepts": [
      `ci:concept.${baseName}`
    ],
    "sourceFile": docPath,
    "documentStructure": {
      "conceptualLayer": [
        "Canonical Definition",
        "One-line Summary",
        "Contrast Map"
      ],
      "theoreticalLayer": [
        "Foundational Thinkers",
        "Epistemological Implications",
        "OIF Placement"
      ],
      "diagnosticLayer": [
        "Quick-scan Checklist",
        "Severity Gradient",
        "Example Vignettes"
      ],
      "linguisticLayer": [
        "Various Forms",
        "Cross-lingual Analogues",
        "Subtype Taxonomy"
      ],
      "narrativeLayer": [
        "Metaphors",
        "Illustrative Scenes",
        "Taglines"
      ],
      "culturalEconomicLayer": [
        "Trend Dynamics",
        "Cultural Narratives",
        "Economic Mechanisms"
      ]
    },
    "canonicalDate": "2024-04-16",
    "createdDate": "2024-04-16",
    "modifiedDate": "2024-04-16"
  };
}

// Template for epistemological source JSON
function createEpistemologicalSourceJSON(filename, docPath) {
  // Extract the concept name from the filename
  const baseName = path.basename(filename, '-epistemological-source.md');
  
  return {
    "@context": {
      "ci": "https://cognitiveinfrastructure.org/schema#",
      "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
      "schema": "http://schema.org/"
    },
    "@id": `ci:epistemological-source.${baseName}`,
    "@type": "ci:EpistemologicalSource",
    "version": "1.0",
    "title": `${baseName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}: Epistemological Source`,
    "category": "epistemological-source",
    "author": "Rashid Azarang",
    "language": "en",
    "label": {
      "en": `${baseName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Epistemological Source`
    },
    "description": {
      "en": `Exploration of the epistemological foundations and implications of the ${baseName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} concept, including research, external references, and broader context.`
    },
    "relatedConcepts": [
      `ci:concept.${baseName}`
    ],
    "sourceFile": docPath,
    "documentType": "epistemological",
    "researchAreas": [
      "Organizational Psychology",
      "System Architecture",
      "Knowledge Management"
    ],
    "externalReferences": [],
    "canonicalDate": "2024-04-16",
    "createdDate": "2024-04-16",
    "modifiedDate": "2024-04-16"
  };
}

// Process canonical source documents
function processCanonicalDocs() {
  if (!fs.existsSync(CANONICAL_DOC_DIR)) {
    console.log(`Directory ${CANONICAL_DOC_DIR} does not exist. Skipping canonical source documents.`);
    return;
  }

  const canonicalFiles = fs.readdirSync(CANONICAL_DOC_DIR)
    .filter(file => file.endsWith('-canonical-source.md'));
  
  console.log(`Found ${canonicalFiles.length} canonical source documents.`);
  
  let missingCount = 0;
  
  canonicalFiles.forEach(file => {
    const jsonFilename = file.replace('.md', '.json');
    const jsonPath = path.join(JSON_CANONICAL_DIR, jsonFilename);
    
    if (!fs.existsSync(jsonPath)) {
      console.log(`Creating JSON file for ${file}`);
      const docPath = path.join(CANONICAL_DOC_DIR, file);
      const jsonContent = createCanonicalSourceJSON(file, docPath);
      
      fs.writeFileSync(jsonPath, JSON.stringify(jsonContent, null, 2));
      missingCount++;
    }
  });
  
  console.log(`Created ${missingCount} missing canonical source JSON files.`);
}

// Process epistemological source documents
function processEpistemologicalDocs() {
  if (!fs.existsSync(EPISTEMOLOGICAL_DOC_DIR)) {
    console.log(`Directory ${EPISTEMOLOGICAL_DOC_DIR} does not exist. Skipping epistemological source documents.`);
    return;
  }

  const epistemologicalFiles = fs.readdirSync(EPISTEMOLOGICAL_DOC_DIR)
    .filter(file => file.endsWith('-epistemological-source.md'));
  
  console.log(`Found ${epistemologicalFiles.length} epistemological source documents.`);
  
  let missingCount = 0;
  
  epistemologicalFiles.forEach(file => {
    const jsonFilename = file.replace('.md', '.json');
    const jsonPath = path.join(JSON_EPISTEMOLOGICAL_DIR, jsonFilename);
    
    if (!fs.existsSync(jsonPath)) {
      console.log(`Creating JSON file for ${file}`);
      const docPath = path.join(EPISTEMOLOGICAL_DOC_DIR, file);
      const jsonContent = createEpistemologicalSourceJSON(file, docPath);
      
      fs.writeFileSync(jsonPath, JSON.stringify(jsonContent, null, 2));
      missingCount++;
    }
  });
  
  console.log(`Created ${missingCount} missing epistemological source JSON files.`);
}

// Main execution
console.log('Ensuring all source documents have corresponding JSON files...');
processCanonicalDocs();
processEpistemologicalDocs();
console.log('Done!'); 