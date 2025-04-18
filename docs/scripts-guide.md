# Scripts and Tools Guide

This document provides detailed information about the scripts and tools available in the Cognitive Infrastructure repository, with a focus on the AI-assisted publishing workflow.

## Overview

The Cognitive Infrastructure repository includes several scripts and tools that help maintain consistency, automate repetitive tasks, and ensure the quality of the documentation. The most important ones are:

- **CI-Writer**: An AI assistant that helps generate content from source manuscripts
- **CI-Coder**: An in-IDE pair programmer that helps with technical maintenance
- **update-related-sections.js**: Updates related concepts in markdown files and JSON data
- **ensure-json-files.js**: Ensures JSON files exist for all concepts
- **validate-all.js**: Validates all JSON files against schemas

## The Publishing Workflow

The Cognitive Infrastructure project follows a specific publishing workflow:

1. You drop a new manuscript into `/sources/manuscripts/` or `/sources/raw-pdf/`
2. Run CI-Writer to auto-generate documentation from that manuscript
3. CI-Writer fills in TODOs in Markdown files
4. Run CI-Coder to validate files, update schemas, and fix links
5. Review the changes and commit them
6. GitBook updates automatically with the new content
7. AI models and humans both benefit from the structured content

This recursive knowledge publishing approach allows for continuous improvement and ensures consistency across the repository.

## CI-Writer

### Purpose

CI-Writer is an AI assistant that:
- Scans the repository for TODO markers in Markdown files
- Pulls in relevant source text from your manuscripts
- Writes clean, concept-driven explanations
- Outputs only content that fits the format

### Requirements

- Node.js 14+ installed
- OpenAI API key set as an environment variable (`OPENAI_API_KEY`)

### Installation

```bash
npm install openai
```

### Usage

```bash
# Process all directories
node tools/ci-writer.js

# Dry run (don't save changes)
node tools/ci-writer.js --dry-run

# Process a specific file or directory
node tools/ci-writer.js --path core-concepts/structure-memory-interaction.md
```

### How It Works

1. CI-Writer scans Markdown files for comments in the format `<!-- TODO: description -->`.
2. It identifies the concept being worked on based on the filename.
3. It searches through manuscript files in the `/sources` directory for relevant content.
4. It uses OpenAI's GPT-4 to generate appropriate content.
5. It replaces the TODO comment with the generated content.

### Example

If you have a file with content like:

```markdown
# Structure-Memory-Interaction Triad

<!-- TODO: Elaborate on the significance of the triad in organizational contexts -->

## Implementation
```

CI-Writer will replace the TODO with well-formatted content based on your source manuscripts.

## CI-Coder

### Purpose

CI-Coder is your in-IDE pair programmer that:
- Validates JSON files against schemas
- Generates GitHub Actions workflows
- Fixes broken links in Markdown files
- Scaffolds test cases, CLI tools, and scripts
- Updates JSON schemas based on existing files
- Creates pull requests with the current changes

### Requirements

- Node.js 14+ installed
- OpenAI API key set as an environment variable (`OPENAI_API_KEY`)
- GitHub CLI (optional, for PR creation)

### Usage

```bash
# Show help
node tools/ci-coder.js help

# Validate JSON files
node tools/ci-coder.js validate

# Generate GitHub Actions workflows
node tools/ci-coder.js generate

# Lint Markdown and JSON files
node tools/ci-coder.js lint

# Scaffold new components
node tools/ci-coder.js scaffold [type] [name]
# Types: test, cli, script, workflow

# Fix broken links in Markdown files
node tools/ci-coder.js fix-links

# Update JSON schemas based on existing files
node tools/ci-coder.js update-schema

# Create a pull request with the current changes
node tools/ci-coder.js pr "Title" "Description"
```

### How It Works

CI-Coder provides a suite of maintenance tools to help keep the repository consistent and well-structured. Each command performs a specific function:

- `validate`: Runs the validation script to check JSON files against their schemas
- `generate`: Creates or updates GitHub Actions workflow files
- `lint`: Runs linting for Markdown and JSON files
- `scaffold`: Creates new component files from templates
- `fix-links`: Automatically fixes broken links in Markdown files
- `update-schema`: Analyzes existing files and updates JSON schemas
- `pr`: Creates a pull request with current changes

## Other Scripts

### update-related-sections.js

Updates the "Related" sections in Markdown files and corresponding JSON files.

```bash
node scripts/update-related-sections.js
```

### ensure-json-files.js

Ensures that all canonical source documents and epistemological source documents have corresponding JSON files.

```bash
node scripts/ensure-json-files.js
```

### validate-all.js

Validates all JSON files against their respective schemas.

```bash
node scripts/validate-all.js
```

## Best Practices

1. **Always start with source documents**: Add manuscript content to the `/sources` directory first, then use CI-Writer to generate documentation.
2. **Use TODOs strategically**: Place TODO comments where you want AI to help generate content.
3. **Run validation frequently**: After making changes, validate the repository to ensure consistency.
4. **Keep related sections updated**: Run `update-related-sections.js` to maintain proper cross-referencing.
5. **Maintain JSON-Markdown parity**: Ensure each concept has both Markdown and JSON representations.

## Troubleshooting

- **OpenAI API Issues**: Check your API key and environment variables.
- **Validation Errors**: Run specific validation scripts to identify and fix issues.
- **Broken Links**: Use `ci-coder.js fix-links` to automatically fix broken links.
- **Missing JSON Files**: Run `ensure-json-files.js` to create missing JSON files.

## Connecting to GitHub

To connect your local repository to GitHub, run the following commands in your terminal:

```bash
git remote add origin https://github.com/cognitive-infrastructure/knowledge-base.git
git branch -M main
git push -u origin main 