#!/usr/bin/env node

/**
 * CI-Writer - AI assistant for Cognitive Infrastructure documentation
 * 
 * This script:
 * 1. Scans the repository for TODO markers in Markdown files
 * 2. Pulls in relevant source text from manuscripts
 * 3. Processes the TODOs and generates appropriate content
 * 4. Updates the Markdown files with the generated content
 * 
 * Usage: node tools/ci-writer.js [--dry-run] [--path <specific-file-or-dir>]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { OpenAI } = require('openai');

// Initialize OpenAI (requires OPENAI_API_KEY environment variable)
const openai = new OpenAI();

// Directories to search for TODOs
const DIRECTORIES = [
  'meta/knowledge-base-summary.md',
  'core-concepts',
  'patterns-and-anti-patterns/patterns',
  'patterns-and-anti-patterns/anti-patterns',
  'docs',
  'docs/pending'
];

// Source directories
const SOURCES_DIR = path.join(process.cwd(), 'sources');
const MANUSCRIPTS_DIR = path.join(SOURCES_DIR, 'manuscripts');
const RAW_PDF_DIR = path.join(SOURCES_DIR, 'raw-pdf');
const EXCERPTS_DIR = path.join(SOURCES_DIR, 'excerpts');

// Command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const pathIndex = args.indexOf('--path');
const specificPath = pathIndex !== -1 ? args[pathIndex + 1] : null;

// TODO regex patterns
const TODO_PATTERN = /<!--\s*TODO:\s*(.*?)\s*-->/g;
const TODO_SECTION_PATTERN = /<!--\s*TODO:\s*(.*?)\s*-->\n(.*?)(\n##|\n<details>|$)/gs;

// Define the potential locations to scan for content
const contentDirs = [
    'library/core-concepts',
    'library/patterns-and-anti-patterns/patterns',
    'library/patterns-and-anti-patterns/anti-patterns',
    'sources/excerpts',
    'sources/manuscripts'
];

// Function to find all markdown files in directories
function findMarkdownFiles(directories) {
  let mdFiles = [];
  
  if (specificPath) {
    if (fs.existsSync(specificPath)) {
      const stats = fs.statSync(specificPath);
      if (stats.isDirectory()) {
        // Find all markdown files in the specified directory
        const files = fs.readdirSync(specificPath)
          .filter(file => file.endsWith('.md'))
          .map(file => path.join(specificPath, file));
        mdFiles = [...mdFiles, ...files];
      } else if (specificPath.endsWith('.md')) {
        // Single markdown file
        mdFiles.push(specificPath);
      }
    }
  } else {
    // Process all specified directories
    directories.forEach(dir => {
      if (fs.existsSync(dir)) {
        const walk = (currentPath) => {
          const files = fs.readdirSync(currentPath);
          
          files.forEach(file => {
            const filePath = path.join(currentPath, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isDirectory()) {
              walk(filePath);
            } else if (file.endsWith('.md')) {
              mdFiles.push(filePath);
            }
          });
        };
        
        walk(dir);
      }
    });
  }
  
  return mdFiles;
}

// Function to find manuscripts relevant to a concept
function findRelevantManuscripts(concept) {
  const conceptKeywords = concept.toLowerCase().split(/[- .]/);
  const manuscriptFiles = [];
  
  // Find manuscript files
  if (fs.existsSync(MANUSCRIPTS_DIR)) {
    const files = fs.readdirSync(MANUSCRIPTS_DIR);
    
    files.forEach(file => {
      const filePath = path.join(MANUSCRIPTS_DIR, file);
      if (fs.statSync(filePath).isFile()) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the manuscript contains keywords related to the concept
        const relevance = conceptKeywords.filter(keyword => 
          keyword.length > 3 && content.toLowerCase().includes(keyword)
        ).length;
        
        if (relevance > 0) {
          manuscriptFiles.push({
            path: filePath,
            relevance
          });
        }
      }
    });
  }
  
  // Find excerpt files
  if (fs.existsSync(EXCERPTS_DIR)) {
    const walk = (currentPath) => {
      const files = fs.readdirSync(currentPath);
      
      files.forEach(file => {
        const filePath = path.join(currentPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          walk(filePath);
        } else if (file.endsWith('.md')) {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Check if the excerpt contains keywords related to the concept
          const relevance = conceptKeywords.filter(keyword => 
            keyword.length > 3 && content.toLowerCase().includes(keyword)
          ).length;
          
          if (relevance > 0) {
            manuscriptFiles.push({
              path: filePath,
              relevance
            });
          }
        }
      });
    };
    
    walk(EXCERPTS_DIR);
  }
  
  // Sort by relevance and return paths
  return manuscriptFiles
    .sort((a, b) => b.relevance - a.relevance)
    .map(item => item.path);
}

// Function to extract relevant content from manuscripts
function extractRelevantContent(manuscripts, todo) {
  let relevantContent = '';
  
  for (const manuscript of manuscripts) {
    const content = fs.readFileSync(manuscript, 'utf8');
    const paragraphs = content.split(/\n\n/);
    
    // Extract paragraphs that might be relevant to the TODO
    const todoKeywords = todo.toLowerCase().split(/\s+/);
    const relevantParagraphs = paragraphs.filter(paragraph => {
      const paragraphLower = paragraph.toLowerCase();
      return todoKeywords.some(keyword => 
        keyword.length > 4 && paragraphLower.includes(keyword)
      );
    });
    
    if (relevantParagraphs.length > 0) {
      relevantContent += relevantParagraphs.join('\n\n') + '\n\n';
      
      // Limit the amount of content to avoid large API requests
      if (relevantContent.length > 5000) {
        relevantContent = relevantContent.substring(0, 5000) + '...';
        break;
      }
    }
  }
  
  return relevantContent.trim();
}

// Function to generate content using OpenAI
async function generateContent(todo, fileContent, relevantContent, filePath) {
  console.log(`Generating content for TODO: ${todo}`);
  
  const filename = path.basename(filePath);
  const conceptName = filename.replace('.md', '');
  const conceptType = filePath.includes('library/patterns-and-anti-patterns/patterns') ? 'pattern' :
                     filePath.includes('library/patterns-and-anti-patterns/anti-patterns') ? 'anti-pattern' :
                     'concept';
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are CI-Writer, an AI assistant specialized in writing documentation for the Cognitive Infrastructure project. 
          Your task is to fill in TODO sections in Markdown files with high-quality, concept-driven explanations.
          
          Follow these guidelines:
          1. Write clear, concise, and technically accurate content
          2. Maintain the style and terminology consistent with the rest of the document
          3. Use formal but accessible language
          4. Include practical examples where appropriate
          5. Do not add personal opinions or unnecessary embellishments
          6. Do not include any markers like "TODO" in your response
          7. Output only the content that should replace the TODO section
          
          The document follows these structural principles:
          - Core concepts have canonical definitions, principles, and implementation details
          - Patterns describe solutions to recurring problems
          - Anti-patterns describe common pitfalls and their remedies`
        },
        {
          role: 'user',
          content: `Please fill in the following TODO section from a Cognitive Infrastructure document:
          
          Document file: ${filename}
          Concept type: ${conceptType}
          Concept name: ${conceptName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          
          TODO task: ${todo}
          
          Context from the document:
          ${fileContent.substring(0, 1500)}
          
          Relevant content from source manuscripts:
          ${relevantContent || "No directly relevant content found in manuscripts."}
          
          Please provide only the content that should replace the TODO section.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating content:', error);
    return `<!-- Failed to generate content: ${error.message} -->`;
  }
}

// Function to process TODOs in a file
async function processTODOs(filePath) {
  console.log(`Processing ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  const conceptName = path.basename(filePath, '.md');
  
  // Find all TODOs in the file
  const todos = [];
  let match;
  while ((match = TODO_PATTERN.exec(content)) !== null) {
    todos.push({
      todo: match[1],
      index: match.index
    });
  }
  
  console.log(`Found ${todos.length} TODOs in ${filePath}`);
  
  if (todos.length === 0) {
    return;
  }
  
  // Find relevant manuscripts for this concept
  const manuscripts = findRelevantManuscripts(conceptName);
  console.log(`Found ${manuscripts.length} relevant manuscripts`);
  
  // Process each TODO
  let newContent = content;
  let offset = 0;
  
  // Reset regex lastIndex
  TODO_SECTION_PATTERN.lastIndex = 0;
  
  while ((match = TODO_SECTION_PATTERN.exec(content)) !== null) {
    const todo = match[1];
    const fullMatch = match[0];
    const matchIndex = match.index;
    
    // Extract relevant content from manuscripts
    const relevantContent = extractRelevantContent(manuscripts, todo);
    
    // Generate content
    const generatedContent = await generateContent(todo, content, relevantContent, filePath);
    
    // Replace the TODO section
    const beforeMatch = newContent.substring(0, matchIndex + offset);
    const afterMatch = newContent.substring(matchIndex + offset + fullMatch.length);
    
    newContent = beforeMatch + generatedContent + afterMatch;
    
    // Update offset for subsequent replacements
    offset += generatedContent.length - fullMatch.length;
    
    console.log(`Replaced TODO: ${todo.substring(0, 50)}...`);
  }
  
  // Save the updated content
  if (newContent !== content) {
    if (isDryRun) {
      console.log(`[DRY RUN] Would update ${filePath}`);
    } else {
      fs.writeFileSync(filePath, newContent);
      console.log(`Updated ${filePath}`);
    }
  }
}

// Main function
async function main() {
  console.log('CI-Writer starting...');
  console.log(`Mode: ${isDryRun ? 'DRY RUN' : 'WRITE'}`);
  
  if (specificPath) {
    console.log(`Looking for TODOs in: ${specificPath}`);
  } else {
    console.log(`Looking for TODOs in: ${DIRECTORIES.join(', ')}`);
  }
  
  const mdFiles = findMarkdownFiles(DIRECTORIES);
  console.log(`Found ${mdFiles.length} Markdown files`);
  
  for (const file of mdFiles) {
    await processTODOs(file);
  }
  
  console.log('CI-Writer finished');
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 