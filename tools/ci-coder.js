#!/usr/bin/env node

/**
 * CI-Coder - In-IDE pair programmer for Cognitive Infrastructure
 * 
 * This script:
 * 1. Validates JSON files against schemas
 * 2. Generates GitHub Actions workflows
 * 3. Ensures consistency across the repository
 * 4. Scaffolds test cases, CLI tools, and scripts
 * 
 * Usage: node tools/ci-coder.js [command] [options]
 * 
 * Commands:
 *   validate        - Validate JSON files
 *   generate        - Generate GitHub Actions workflows
 *   lint            - Lint Markdown and JSON files
 *   scaffold        - Scaffold new components (tests, CLI tools)
 *   fix-links       - Fix broken links in Markdown files
 *   update-schema   - Update JSON schemas based on existing files
 *   pr              - Create a pull request with the current changes
 *   process-pending - Process pending documents
 *   cross-reference - Perform cross-referencing of concepts
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { OpenAI } = require('openai');

// Initialize OpenAI (requires OPENAI_API_KEY environment variable)
const openai = new OpenAI();

// Get command and options
const args = process.argv.slice(2);
const command = args[0] || 'help';
const options = args.slice(1);

// Directories and file paths
const ROOT_DIR = process.cwd();
const JSON_DIR = path.join(ROOT_DIR, 'json');
const SCHEMA_DIR = path.join(JSON_DIR, 'meta');
const GITHUB_DIR = path.join(ROOT_DIR, '.github');
const WORKFLOWS_DIR = path.join(GITHUB_DIR, 'workflows');

// GitHub API token for PR creation (optional)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Function to execute shell commands and return output
function execCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return error.stderr;
  }
}

// Function to validate JSON files against schemas
function validateJSON() {
  console.log('Validating JSON files against schemas...');
  
  // Ensure the validation script exists
  const validateScript = path.join(ROOT_DIR, 'scripts', 'validate-all.js');
  if (!fs.existsSync(validateScript)) {
    console.error(`Validation script not found: ${validateScript}`);
    return false;
  }
  
  try {
    const output = execCommand(`node ${validateScript}`);
    console.log(output);
    return !output.includes('Error');
  } catch (error) {
    console.error('Validation failed:', error.message);
    return false;
  }
}

// Function to generate or update GitHub Actions workflows
async function generateGitHubActions() {
  console.log('Generating GitHub Actions workflows...');
  
  // Ensure directories exist
  if (!fs.existsSync(WORKFLOWS_DIR)) {
    fs.mkdirSync(WORKFLOWS_DIR, { recursive: true });
  }
  
  // Define workflow templates
  const workflowTemplates = [
    {
      name: 'validation.yml',
      description: 'Validates JSON and Markdown files',
      content: `name: Validation

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
      - name: Install dependencies
        run: npm ci
      - name: Validate JSON files
        run: npm run validate:all
      - name: Validate Markdown files
        run: npm run lint
`
    },
    {
      name: 'auto-update.yml',
      description: 'Automatically updates related sections and ensures JSON files',
      content: `name: Auto Update

on:
  push:
    paths:
      - '**.md'
      - 'docs/**'
    branches: [ main ]
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
      - name: Install dependencies
        run: npm ci
      - name: Update related sections
        run: npm run update-related
      - name: Ensure JSON files
        run: npm run ensure-json
      - name: Commit changes
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "Auto-update related sections and ensure JSON files"
          file_pattern: "**/*.md **/*.json"
`
    },
    {
      name: 'release.yml',
      description: 'Creates releases for tagged versions',
      content: `name: Release

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Create Release
        id: create_release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: \${{ github.ref }}
          release_name: Release \${{ github.ref }}
          draft: false
          prerelease: false
`
    }
  ];
  
  // Create or update workflow files
  for (const template of workflowTemplates) {
    const workflowPath = path.join(WORKFLOWS_DIR, template.name);
    
    if (!fs.existsSync(workflowPath) || options.includes('--force')) {
      fs.writeFileSync(workflowPath, template.content);
      console.log(`Created workflow: ${template.name}`);
    } else {
      console.log(`Workflow already exists: ${template.name} (use --force to overwrite)`);
    }
  }
  
  return true;
}

// Function to lint Markdown and JSON files
function lintFiles() {
  console.log('Linting Markdown and JSON files...');
  
  try {
    // Run lint-staged manually
    const output = execCommand('npx lint-staged');
    console.log(output);
    return !output.includes('Error');
  } catch (error) {
    console.error('Linting failed:', error.message);
    return false;
  }
}

// Function to scaffold new components (tests, CLI tools)
async function scaffoldComponent() {
  console.log('Scaffolding new component...');
  
  if (options.length < 2) {
    console.error('Usage: node tools/ci-coder.js scaffold <type> <name>');
    console.error('Types: test, cli, script');
    return false;
  }
  
  const type = options[0];
  const name = options[1];
  
  // Define template generators for different component types
  const templates = {
    test: async () => {
      const filePath = path.join(ROOT_DIR, 'tests', `${name}.test.js`);
      const content = `const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

describe('${name}', () => {
  it('should pass basic validation', () => {
    // Add test logic here
    expect(true).to.equal(true);
  });
});
`;
      
      // Create test directory if it doesn't exist
      if (!fs.existsSync(path.join(ROOT_DIR, 'tests'))) {
        fs.mkdirSync(path.join(ROOT_DIR, 'tests'), { recursive: true });
      }
      
      fs.writeFileSync(filePath, content);
      console.log(`Created test file: ${filePath}`);
      return true;
    },
    
    cli: async () => {
      const filePath = path.join(ROOT_DIR, 'tools', `${name}.js`);
      const content = `#!/usr/bin/env node

/**
 * ${name} - CLI tool for Cognitive Infrastructure
 * 
 * Usage: node tools/${name}.js [options]
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);

// Main function
async function main() {
  console.log('${name} starting...');
  
  // Add your CLI logic here
  
  console.log('${name} finished');
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
`;
      
      fs.writeFileSync(filePath, content);
      fs.chmodSync(filePath, '755'); // Make executable
      console.log(`Created CLI tool: ${filePath}`);
      return true;
    },
    
    script: async () => {
      const filePath = path.join(ROOT_DIR, 'scripts', `${name}.js`);
      const content = `#!/usr/bin/env node

/**
 * Script to ${name}
 * 
 * Usage: node scripts/${name}.js
 */

const fs = require('fs');
const path = require('path');

console.log('${name} script starting...');

// Add your script logic here

console.log('${name} script finished');
`;
      
      fs.writeFileSync(filePath, content);
      fs.chmodSync(filePath, '755'); // Make executable
      console.log(`Created script: ${filePath}`);
      return true;
    },
    
    workflow: async () => {
      const filePath = path.join(WORKFLOWS_DIR, `${name}.yml`);
      
      // Ensure directory exists
      if (!fs.existsSync(WORKFLOWS_DIR)) {
        fs.mkdirSync(WORKFLOWS_DIR, { recursive: true });
      }
      
      // Generate workflow content using AI
      const workflow = await generateWorkflowContent(name);
      
      fs.writeFileSync(filePath, workflow);
      console.log(`Created GitHub workflow: ${filePath}`);
      return true;
    }
  };
  
  if (!templates[type]) {
    console.error(`Unknown component type: ${type}`);
    console.error('Available types: ' + Object.keys(templates).join(', '));
    return false;
  }
  
  return await templates[type]();
}

// Function to generate workflow content using AI
async function generateWorkflowContent(name) {
  console.log(`Generating ${name} workflow content...`);
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are CI-Coder, an AI assistant specialized in generating GitHub Actions workflows for the Cognitive Infrastructure project. Your task is to create a well-structured GitHub Actions workflow file.`
        },
        {
          role: 'user',
          content: `Please create a GitHub Actions workflow file named "${name}.yml" for the Cognitive Infrastructure project. The workflow should be well-structured, secure, and follow best practices.

Based on the name "${name}", design an appropriate workflow that would be useful for this project. The project is a documentation-heavy repository with Markdown and JSON files, focused on creating structured knowledge.

Please provide only the YAML content of the workflow file, without any explanations or backticks.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating workflow content:', error);
    return `# Error generating workflow: ${error.message}
name: ${name}

on:
  workflow_dispatch:

jobs:
  default:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
      - name: Install dependencies
        run: npm ci
      - name: Run default action
        run: echo "Add your workflow actions here"
`;
  }
}

// Function to fix broken links in Markdown files
function fixLinks() {
  console.log('Fixing broken links in Markdown files...');
  
  // Get all Markdown files
  const mdFiles = [];
  
  function findMarkdownFiles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
        findMarkdownFiles(filePath);
      } else if (file.endsWith('.md')) {
        mdFiles.push(filePath);
      }
    }
  }
  
  findMarkdownFiles(ROOT_DIR);
  console.log(`Found ${mdFiles.length} Markdown files`);
  
  // Regular expression to find links
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let fixedLinks = 0;
  
  for (const file of mdFiles) {
    let content = fs.readFileSync(file, 'utf8');
    const dir = path.dirname(file);
    let modified = false;
    
    content = content.replace(linkRegex, (match, text, link) => {
      // Skip external links and anchors
      if (link.startsWith('http') || link.startsWith('#')) {
        return match;
      }
      
      // Resolve the link path
      const linkPath = path.resolve(dir, link);
      
      // Check if the file exists
      if (!fs.existsSync(linkPath)) {
        // Try to find the correct file
        const basename = path.basename(link);
        const searchResult = execCommand(`find ${ROOT_DIR} -name "${basename}" | grep -v "node_modules" | grep -v ".git"`).trim();
        
        if (searchResult && searchResult.split('\n').length === 1) {
          // Found a single match
          const newPath = path.relative(dir, searchResult);
          console.log(`Fixing link in ${file}: ${link} -> ${newPath}`);
          fixedLinks++;
          modified = true;
          return `[${text}](${newPath})`;
        }
      }
      
      return match;
    });
    
    if (modified) {
      fs.writeFileSync(file, content);
    }
  }
  
  console.log(`Fixed ${fixedLinks} broken links`);
  return true;
}

// Function to update JSON schemas based on existing files
async function updateSchema() {
  console.log('Updating JSON schemas based on existing files...');
  
  // Ensure schema directory exists
  if (!fs.existsSync(SCHEMA_DIR)) {
    fs.mkdirSync(SCHEMA_DIR, { recursive: true });
  }
  
  // Define schema file paths
  const conceptSchemaPath = path.join(SCHEMA_DIR, 'ci-schema.json');
  const documentSchemaPath = path.join(SCHEMA_DIR, 'ci-document-schema.json');
  
  // Get example JSON files for different types
  const coreConcepts = fs.readdirSync(path.join(JSON_DIR, 'core-concepts'))
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(JSON_DIR, 'core-concepts', file));
  
  const patterns = fs.readdirSync(path.join(JSON_DIR, 'patterns'))
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(JSON_DIR, 'patterns', file));
  
  const antiPatterns = fs.readdirSync(path.join(JSON_DIR, 'anti-patterns'))
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(JSON_DIR, 'anti-patterns', file));
  
  // Read example files
  const exampleFiles = {
    coreConcepts: coreConcepts.length > 0 ? JSON.parse(fs.readFileSync(coreConcepts[0], 'utf8')) : null,
    patterns: patterns.length > 0 ? JSON.parse(fs.readFileSync(patterns[0], 'utf8')) : null,
    antiPatterns: antiPatterns.length > 0 ? JSON.parse(fs.readFileSync(antiPatterns[0], 'utf8')) : null
  };
  
  // Analyze files and update schemas
  if (Object.values(exampleFiles).some(file => file !== null)) {
    // Update concept schema
    if (!fs.existsSync(conceptSchemaPath) || options.includes('--force')) {
      const conceptSchema = generateConceptSchema(exampleFiles);
      fs.writeFileSync(conceptSchemaPath, JSON.stringify(conceptSchema, null, 2));
      console.log(`Updated concept schema: ${conceptSchemaPath}`);
    } else {
      console.log(`Concept schema already exists: ${conceptSchemaPath} (use --force to overwrite)`);
    }
    
    // Update document schema (if needed)
    // This would follow a similar pattern to the concept schema update
  }
  
  return true;
}

// Function to generate concept schema from example files
function generateConceptSchema(exampleFiles) {
  // Start with a basic schema
  const schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Cognitive Infrastructure Concept Schema",
    "description": "Schema for concepts, patterns, and anti-patterns in the Cognitive Infrastructure framework",
    "type": "object",
    "required": [
      "@context",
      "@id",
      "@type",
      "version",
      "label",
      "description"
    ],
    "properties": {
      "@context": {
        "type": "object",
        "description": "JSON-LD context"
      },
      "@id": {
        "type": "string",
        "description": "Unique identifier for the concept",
        "pattern": "^ci:(concept|pattern|antipattern)\\.[a-z0-9-]+$"
      },
      "@type": {
        "type": "string",
        "description": "Type of the entry",
        "enum": ["ci:Concept", "ci:Pattern", "ci:AntiPattern"]
      },
      "version": {
        "type": "string",
        "description": "Version of the concept"
      },
      "label": {
        "type": "object",
        "description": "Human-readable label for the concept",
        "required": ["en"],
        "properties": {
          "en": {
            "type": "string"
          }
        }
      },
      "description": {
        "type": "object",
        "description": "Brief description of the concept",
        "required": ["en"],
        "properties": {
          "en": {
            "type": "string"
          }
        }
      },
      "definition": {
        "type": "object",
        "description": "Canonical definition of the concept",
        "required": ["en"],
        "properties": {
          "en": {
            "type": "string"
          }
        }
      },
      "principles": {
        "type": "array",
        "description": "Key principles of the concept",
        "items": {
          "type": "object",
          "required": ["en"],
          "properties": {
            "en": {
              "type": "string"
            }
          }
        }
      },
      "relatedConcepts": {
        "type": "array",
        "description": "Related concepts",
        "items": {
          "type": "string",
          "pattern": "^ci:(concept|pattern|antipattern)\\.[a-z0-9-]+$"
        }
      },
      "canonicalDate": {
        "type": "string",
        "description": "Date of canonical definition",
        "format": "date"
      },
      "canonicalSource": {
        "type": "string",
        "description": "Source of the canonical definition"
      },
      "author": {
        "type": "string",
        "description": "Author of the concept"
      },
      "createdDate": {
        "type": "string",
        "description": "Date of creation",
        "format": "date"
      },
      "modifiedDate": {
        "type": "string",
        "description": "Date of last modification",
        "format": "date"
      }
    },
    "additionalProperties": false
  };
  
  // Analyze example files to enhance the schema
  // This is a simplified implementation that could be expanded
  
  return schema;
}

// Function to create a pull request with current changes
async function createPullRequest() {
  console.log('Creating pull request...');
  
  if (!GITHUB_TOKEN) {
    console.error('GITHUB_TOKEN environment variable is required for PR creation');
    return false;
  }
  
  // Get current branch
  const currentBranch = execCommand('git branch --show-current').trim();
  
  // Check if there are any changes
  const status = execCommand('git status --porcelain');
  if (!status) {
    console.log('No changes to commit');
    return false;
  }
  
  // Prompt for PR title and description
  const title = options[0] || `Update from CI-Coder`;
  const body = options[1] || `
This PR was automatically created by CI-Coder.

Changes:
${status.split('\n').map(line => `- ${line}`).join('\n')}
`;
  
  // Commit changes
  execCommand('git add .');
  execCommand(`git commit -m "${title}"`);
  
  // Push changes
  execCommand(`git push origin ${currentBranch}`);
  
  // Create PR using GitHub CLI if available
  try {
    const ghOutput = execCommand(`gh pr create --title "${title}" --body "${body}"`);
    console.log(ghOutput);
    return true;
  } catch (error) {
    console.error('Failed to create PR using GitHub CLI. Is it installed?');
    console.error('You can create a PR manually with these changes.');
    return false;
  }
}

// Function to process pending documents
async function processPendingDocuments() {
  console.log('Processing pending documents...');
  
  const PENDING_DIR = path.join(ROOT_DIR, 'docs', 'pending');
  
  if (!fs.existsSync(PENDING_DIR)) {
    console.log('Pending directory not found. Creating it...');
    fs.mkdirSync(PENDING_DIR, { recursive: true });
    return true;
  }
  
  // Get all markdown files in the pending directory
  const pendingFiles = fs.readdirSync(PENDING_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(PENDING_DIR, file));
  
  if (pendingFiles.length === 0) {
    console.log('No pending documents found.');
    return true;
  }
  
  console.log(`Found ${pendingFiles.length} pending document(s).`);
  
  // Process each pending file
  for (const filePath of pendingFiles) {
    const fileName = path.basename(filePath);
    console.log(`Processing ${fileName}...`);
    
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Analyze content to determine document type and target location
    const docType = determineDocumentType(content);
    const targetDir = getTargetDirectory(docType);
    
    if (!targetDir) {
      console.error(`Could not determine target directory for ${fileName}`);
      continue;
    }
    
    // Generate canonical filename
    const canonicalFileName = generateCanonicalFilename(fileName, docType);
    const targetFilePath = path.join(ROOT_DIR, targetDir, canonicalFileName);
    
    // Apply canonical structure
    const structuredContent = applyCanonicalStructure(content, docType, canonicalFileName);
    
    // Ensure target directory exists
    if (!fs.existsSync(path.join(ROOT_DIR, targetDir))) {
      fs.mkdirSync(path.join(ROOT_DIR, targetDir), { recursive: true });
    }
    
    // Write the file to its target location
    fs.writeFileSync(targetFilePath, structuredContent);
    console.log(`Created ${targetFilePath}`);
    
    // Generate JSON representation
    await generateJsonRepresentation(targetFilePath, docType);
    
    // Remove the original file
    if (!options.includes('--keep-original')) {
      fs.unlinkSync(filePath);
      console.log(`Removed original file: ${filePath}`);
    }
  }
  
  // Update knowledge-base summary
  await updateKnowledgeBaseSummary();
  
  return true;
}

// Function to determine document type from content
function determineDocumentType(content) {
  // Simple heuristics to determine document type
  const contentLower = content.toLowerCase();
  
  if (contentLower.includes('meta') && contentLower.includes('protocol')) {
    return 'meta';
  } else if (contentLower.includes('pattern') && !contentLower.includes('anti-pattern')) {
    return 'pattern';
  } else if (contentLower.includes('anti-pattern') || contentLower.includes('antipattern')) {
    return 'anti-pattern';
  } else if (contentLower.includes('concept') || contentLower.includes('triad') || contentLower.includes('architecture')) {
    return 'concept';
  } else if (contentLower.includes('source') || contentLower.includes('canonical')) {
    return 'source-document';
  } else {
    // Default to concept if we can't determine
    return 'concept';
  }
}

// Function to get target directory based on document type
function getTargetDirectory(docType) {
  switch (docType) {
    case 'concept':
      return 'core-concepts';
    case 'pattern':
      return 'patterns-and-anti-patterns/patterns';
    case 'anti-pattern':
      return 'patterns-and-anti-patterns/anti-patterns';
    case 'source-document':
      return 'docs/source-documents';
    case 'meta':
      return 'meta';
    default:
      return null;
  }
}

// Function to generate canonical filename
function generateCanonicalFilename(fileName, docType) {
  // Remove extension and special characters
  let baseName = fileName.replace('.md', '');
  
  // Convert to kebab-case
  baseName = baseName
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
  
  // Add appropriate prefix or suffix based on document type if needed
  return `${baseName}.md`;
}

// Function to apply canonical structure
function applyCanonicalStructure(content, docType, fileName) {
  // Extract title from the content
  const titleMatch = content.match(/^#\s+(.*?)$/m);
  const title = titleMatch ? titleMatch[1] : path.basename(fileName, '.md').replace(/-/g, ' ');
  
  // Check if frontmatter exists
  const hasFrontmatter = /^---\n[\s\S]*?\n---/.test(content);
  
  // Generate ID based on document type and filename
  const baseName = path.basename(fileName, '.md');
  const id = generateId(docType, baseName);
  
  // If frontmatter exists, replace or update it
  if (hasFrontmatter) {
    return content.replace(/^---\n[\s\S]*?\n---/, 
      `---
id: ${id}
status: draft
version: 0.1
---`);
  } else {
    // Add frontmatter
    return `---
id: ${id}
status: draft
version: 0.1
---

${content}`;
  }
}

// Function to generate ID
function generateId(docType, baseName) {
  switch (docType) {
    case 'concept':
      return `ci:concept.${baseName}`;
    case 'pattern':
      return `ci:pattern.${baseName}`;
    case 'anti-pattern':
      return `ci:antipattern.${baseName}`;
    case 'source-document':
      return `ci:source.${baseName}`;
    case 'meta':
      return `ci:meta.${baseName}`;
    default:
      return `ci:${baseName}`;
  }
}

// Function to generate JSON representation
async function generateJsonRepresentation(filePath, docType) {
  console.log(`Generating JSON representation for ${filePath}...`);
  
  // Read the file content
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';
  
  // Extract ID from frontmatter
  const idMatch = frontmatter.match(/id:\s*(.*?)$/m);
  const id = idMatch ? idMatch[1] : '';
  
  // Extract title
  const titleMatch = content.match(/^#\s+(.*?)$/m);
  const title = titleMatch ? titleMatch[1] : path.basename(filePath, '.md');
  
  // Extract version from frontmatter
  const versionMatch = frontmatter.match(/version:\s*(.*?)$/m);
  const version = versionMatch ? versionMatch[1] : '0.1';
  
  // Extract status from frontmatter
  const statusMatch = frontmatter.match(/status:\s*(.*?)$/m);
  const status = statusMatch ? statusMatch[1] : 'draft';
  
  // Extract sections
  const sections = [];
  let currentSection = null;
  let currentContent = '';
  
  const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---/, '').trim();
  const lines = contentWithoutFrontmatter.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('## ')) {
      // Save previous section if it exists
      if (currentSection) {
        sections.push({
          title: currentSection,
          content: currentContent.trim()
        });
      }
      
      // Start new section
      currentSection = line.replace('## ', '').trim();
      currentContent = '';
    } else if (currentSection) {
      currentContent += line + '\n';
    }
  }
  
  // Add the last section
  if (currentSection) {
    sections.push({
      title: currentSection,
      content: currentContent.trim()
    });
  }
  
  // Create JSON object
  const jsonObj = {
    id,
    version,
    status,
    title,
    sections
  };
  
  // Determine JSON target path
  let jsonDir;
  switch (docType) {
    case 'concept':
      jsonDir = path.join(JSON_DIR, 'core-concepts');
      break;
    case 'pattern':
      jsonDir = path.join(JSON_DIR, 'patterns');
      break;
    case 'anti-pattern':
      jsonDir = path.join(JSON_DIR, 'anti-patterns');
      break;
    case 'source-document':
      jsonDir = path.join(JSON_DIR, 'docs');
      break;
    case 'meta':
      jsonDir = path.join(JSON_DIR, 'meta');
      break;
    default:
      jsonDir = JSON_DIR;
  }
  
  // Ensure directory exists
  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
  }
  
  // Write JSON file
  const jsonPath = path.join(jsonDir, path.basename(filePath, '.md') + '.json');
  fs.writeFileSync(jsonPath, JSON.stringify(jsonObj, null, 2));
  console.log(`Created JSON file: ${jsonPath}`);
  
  return true;
}

// Function to update knowledge-base summary
async function updateKnowledgeBaseSummary() {
  console.log('Updating knowledge-base summary...');
  
  const summaryPath = path.join(ROOT_DIR, 'meta', 'knowledge-base-summary.md');
  
  if (!fs.existsSync(summaryPath)) {
    console.error('Knowledge-base summary file not found.');
    return false;
  }
  
  const content = fs.readFileSync(summaryPath, 'utf8');
  
  // Update revision log
  const currentDate = new Date().toISOString().split('T')[0];
  const newEntry = `- v${currentDate}: Processed pending documents via ingestion protocol`;
  
  let updatedContent;
  
  if (content.includes('## Revision Log')) {
    // Update existing revision log
    updatedContent = content.replace(
      /(## Revision Log\n)([\s\S]*?)(\n##|\n$)/,
      `$1$2- ${currentDate}: Processed pending documents via ingestion protocol$3`
    );
  } else {
    // Add new revision log if it doesn't exist
    updatedContent = content + `\n\n## Revision Log\n- ${currentDate}: Processed pending documents via ingestion protocol`;
  }
  
  fs.writeFileSync(summaryPath, updatedContent);
  console.log('Updated knowledge-base summary.');
  
  return true;
}

// Function to perform cross-referencing of concepts
async function performCrossReferencing() {
  console.log('Performing cross-referencing of concepts...');
  
  // Define directories to scan
  const DIRS_TO_SCAN = [
    path.join(ROOT_DIR, 'library/core-concepts'),
    path.join(ROOT_DIR, 'library/patterns-and-anti-patterns', 'patterns'),
    path.join(ROOT_DIR, 'library/patterns-and-anti-patterns', 'anti-patterns')
  ];
  
  // Add optional directories if they exist
  const OPTIONAL_DIRS = [
    'library/frameworks',
    'library/diagnostics',
    'library/essays',
    'library/lexicon'
  ];
  
  OPTIONAL_DIRS.forEach(dir => {
    const dirPath = path.join(ROOT_DIR, dir);
    if (fs.existsSync(dirPath)) {
      DIRS_TO_SCAN.push(dirPath);
    }
  });
  
  // Check if a specific path is provided
  const pathIndex = options.indexOf('--path');
  const specificPath = pathIndex !== -1 ? options[pathIndex + 1] : null;
  
  // Step 1: Gather all canonical files
  const canonicalFiles = [];
  
  if (specificPath) {
    // Handle specific file or directory
    const fullPath = path.join(ROOT_DIR, specificPath);
    
    if (fs.statSync(fullPath).isDirectory()) {
      // Scan directory for markdown files
      fs.readdirSync(fullPath)
        .filter(file => file.endsWith('.md'))
        .forEach(file => canonicalFiles.push({
          path: path.join(fullPath, file),
          id: '',
          title: '',
          content: ''
        }));
    } else if (fullPath.endsWith('.md')) {
      // Single file
      canonicalFiles.push({
        path: fullPath,
        id: '',
        title: '',
        content: ''
      });
    }
  } else {
    // Scan all directories
    DIRS_TO_SCAN.forEach(dir => {
      if (fs.existsSync(dir)) {
        fs.readdirSync(dir)
          .filter(file => file.endsWith('.md') && file !== 'README.md')
          .forEach(file => canonicalFiles.push({
            path: path.join(dir, file),
            id: '',
            title: '',
            content: ''
          }));
      }
    });
  }
  
  console.log(`Found ${canonicalFiles.length} canonical files to process`);
  
  // Step 2: Read files and extract metadata
  for (const file of canonicalFiles) {
    const content = fs.readFileSync(file.path, 'utf8');
    
    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';
    
    // Extract ID
    const idMatch = frontmatter.match(/id:\s*(.*?)$/m);
    file.id = idMatch ? idMatch[1].trim() : '';
    
    // Extract title from H1
    const titleMatch = content.match(/^#\s+(.*?)$/m);
    file.title = titleMatch ? titleMatch[1].trim() : path.basename(file.path, '.md').replace(/-/g, ' ');
    
    // Store content without frontmatter
    file.content = content.replace(/^---\n[\s\S]*?\n---/, '').trim();
    
    // Initialize related concepts if not already present
    file.relatedConcepts = [];
    const relatedConceptsMatch = frontmatter.match(/relatedConcepts:\s*\[(.*?)\]/s);
    if (relatedConceptsMatch) {
      // Parse the related concepts array
      const relatedConceptsStr = relatedConceptsMatch[1];
      file.relatedConcepts = relatedConceptsStr
        .split(',')
        .map(concept => concept.trim().replace(/["']/g, ''))
        .filter(concept => concept.length > 0);
    }
  }
  
  // Step 3: Build a title-to-file mapping
  const titleToFile = {};
  canonicalFiles.forEach(file => {
    // Map both the title and kebab-case version
    titleToFile[file.title.toLowerCase()] = file;
    titleToFile[file.title.toLowerCase().replace(/\s+/g, '-')] = file;
  });
  
  // Step 4: Detect references and update related concepts
  let changedFiles = 0;
  
  for (const file of canonicalFiles) {
    const newRelatedConcepts = new Set(file.relatedConcepts);
    const contentLower = file.content.toLowerCase();
    
    // Check for mentions of other concepts
    for (const otherFile of canonicalFiles) {
      if (file.path === otherFile.path) continue; // Skip self
      
      // Check if this file mentions the other concept by title
      const otherTitleLower = otherFile.title.toLowerCase();
      if (contentLower.includes(otherTitleLower)) {
        // Add to related concepts if not already there
        newRelatedConcepts.add(otherFile.title);
      }
    }
    
    // Convert set back to array and sort
    const sortedRelatedConcepts = [...newRelatedConcepts].sort();
    
    // Check if changes are needed
    if (JSON.stringify(sortedRelatedConcepts) !== JSON.stringify(file.relatedConcepts)) {
      // Update the file content with new related concepts
      let updatedContent = fs.readFileSync(file.path, 'utf8');
      
      // Format the related concepts array
      const relatedConceptsStr = sortedRelatedConcepts
        .map(concept => `"${concept}"`)
        .join(', ');
      
      // Update or add relatedConcepts in frontmatter
      if (updatedContent.includes('relatedConcepts:')) {
        // Replace existing relatedConcepts
        updatedContent = updatedContent.replace(
          /relatedConcepts:\s*\[.*?\]/s,
          `relatedConcepts: [${relatedConceptsStr}]`
        );
      } else {
        // Add relatedConcepts if missing
        updatedContent = updatedContent.replace(
          /^---\n([\s\S]*?)\n---/,
          `---\n$1\nrelatedConcepts: [${relatedConceptsStr}]\n---`
        );
      }
      
      // Write back to file
      fs.writeFileSync(file.path, updatedContent);
      console.log(`Updated relatedConcepts in ${file.path}`);
      
      // Update corresponding JSON file if it exists
      await updateJsonRelatedConcepts(file.path, sortedRelatedConcepts);
      
      changedFiles++;
    }
  }
  
  // Step 5: Ensure bidirectional references
  for (const fileA of canonicalFiles) {
    for (const relatedConcept of fileA.relatedConcepts) {
      // Find the related file
      const relatedFile = canonicalFiles.find(f => f.title === relatedConcept);
      if (relatedFile) {
        // Check if fileA is in relatedFile's relatedConcepts
        if (!relatedFile.relatedConcepts.includes(fileA.title)) {
          // Add bidirectional reference
          const newRelatedConcepts = [...relatedFile.relatedConcepts, fileA.title].sort();
          
          // Update file
          let updatedContent = fs.readFileSync(relatedFile.path, 'utf8');
          
          // Format the related concepts array
          const relatedConceptsStr = newRelatedConcepts
            .map(concept => `"${concept}"`)
            .join(', ');
          
          // Update relatedConcepts in frontmatter
          if (updatedContent.includes('relatedConcepts:')) {
            updatedContent = updatedContent.replace(
              /relatedConcepts:\s*\[.*?\]/s,
              `relatedConcepts: [${relatedConceptsStr}]`
            );
          } else {
            updatedContent = updatedContent.replace(
              /^---\n([\s\S]*?)\n---/,
              `---\n$1\nrelatedConcepts: [${relatedConceptsStr}]\n---`
            );
          }
          
          // Write back to file
          fs.writeFileSync(relatedFile.path, updatedContent);
          console.log(`Added bidirectional reference: ${fileA.title} <-> ${relatedFile.title}`);
          
          // Update corresponding JSON file if it exists
          await updateJsonRelatedConcepts(relatedFile.path, newRelatedConcepts);
          
          changedFiles++;
          
          // Update in-memory data
          relatedFile.relatedConcepts = newRelatedConcepts;
        }
      }
    }
  }
  
  console.log(`Updated ${changedFiles} files with new related concepts`);
  
  // Update knowledge base summary revision log
  await updateKnowledgeBaseSummary('cross-reference');
  
  return true;
}

// Function to update related concepts in JSON file
async function updateJsonRelatedConcepts(mdFilePath, relatedConcepts) {
  // Convert MD path to JSON path
  const fileBaseName = path.basename(mdFilePath, '.md');
  let jsonDir;
  
  if (mdFilePath.includes('library/core-concepts')) {
    jsonDir = path.join(JSON_DIR, 'core-concepts');
  } else if (mdFilePath.includes('library/patterns-and-anti-patterns/patterns')) {
    jsonDir = path.join(JSON_DIR, 'patterns');
  } else if (mdFilePath.includes('library/patterns-and-anti-patterns/anti-patterns')) {
    jsonDir = path.join(JSON_DIR, 'anti-patterns');
  } else if (mdFilePath.includes('library/frameworks')) {
    jsonDir = path.join(JSON_DIR, 'frameworks');
  } else if (mdFilePath.includes('library/diagnostics')) {
    jsonDir = path.join(JSON_DIR, 'diagnostics');
  } else if (mdFilePath.includes('library/essays')) {
    jsonDir = path.join(JSON_DIR, 'essays');
  } else if (mdFilePath.includes('library/lexicon')) {
    jsonDir = path.join(JSON_DIR, 'lexicon');
  } else {
    return; // Skip if not in a standard directory
  }
  
  const jsonFilePath = path.join(jsonDir, fileBaseName + '.json');
  
  if (fs.existsSync(jsonFilePath)) {
    try {
      const jsonContent = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
      
      // Update relatedConcepts
      jsonContent.relatedConcepts = relatedConcepts;
      
      // Write back to file
      fs.writeFileSync(jsonFilePath, JSON.stringify(jsonContent, null, 2));
      console.log(`Updated relatedConcepts in JSON: ${jsonFilePath}`);
    } catch (error) {
      console.error(`Error updating JSON file ${jsonFilePath}:`, error.message);
    }
  }
}

// Function to display help
function showHelp() {
  console.log(`
CI-Coder - In-IDE pair programmer for Cognitive Infrastructure

Usage: node tools/ci-coder.js [command] [options]

Commands:
  validate        - Validate JSON files
  generate        - Generate GitHub Actions workflows
  lint            - Lint Markdown and JSON files
  scaffold        - Scaffold new components (tests, CLI tools)
  fix-links       - Fix broken links in Markdown files
  update-schema   - Update JSON schemas based on existing files
  pr              - Create a pull request with the current changes
  process-pending - Process pending documents
  cross-reference - Perform cross-referencing of concepts
  help            - Show this help message

Examples:
  node tools/ci-coder.js validate
  node tools/ci-coder.js generate --force
  node tools/ci-coder.js scaffold test validator
  node tools/ci-coder.js scaffold cli new-concept
  node tools/ci-coder.js pr "Update schemas" "Fixed validation issues"
  node tools/ci-coder.js cross-reference --path library/core-concepts/structural-debt.md
`);
}

// Main function to process commands
async function main() {
  console.log('CI-Coder starting...');
  
  let success = false;
  
  switch (command) {
    case 'validate':
      success = validateJSON();
      break;
    case 'generate':
      success = await generateGitHubActions();
      break;
    case 'lint':
      success = lintFiles();
      break;
    case 'scaffold':
      success = await scaffoldComponent();
      break;
    case 'fix-links':
      success = fixLinks();
      break;
    case 'update-schema':
      success = await updateSchema();
      break;
    case 'pr':
      success = await createPullRequest();
      break;
    case 'process-pending':
      success = await processPendingDocuments();
      break;
    case 'cross-reference':
      success = await performCrossReferencing();
      break;
    case 'help':
    default:
      showHelp();
      success = true;
      break;
  }
  
  console.log(`CI-Coder finished with ${success ? 'success' : 'errors'}`);
  process.exit(success ? 0 : 1);
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 