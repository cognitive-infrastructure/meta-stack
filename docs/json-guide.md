---
title: "JSON Files in Cognitive Infrastructure"
author: "Rashid Azarang"
date: 2025-04-18
draft: false
---

<!-- Migration Status: Complete -->

# JSON Files in Cognitive Infrastructure

This guide explains how JSON files are used in the Cognitive Infrastructure repository to provide machine-readable definitions of concepts, patterns, anti-patterns, and source documents.

## JSON File Structure

The repository contains several types of JSON files:

1. **Core Concepts** (`json/core-concepts/*.json`)
2. **Implementation Patterns** (`json/patterns/*.json`)
3. **Anti-Patterns** (`json/anti-patterns/*.json`)
4. **Canonical Source Documents** (`json/docs/canonical-source-documents/*.json`)
5. **Epistemological Source Documents** (`json/docs/source-documents/*.json`)

Each type follows a schema defined in the `json/meta/` directory.

## Why We Use JSON

JSON files serve multiple purposes in this repository:

1. **Validation** - Ensuring all concepts and documents follow a consistent structure
2. **Indexing** - Supporting search across the knowledge base
3. **Integration** - Enabling programmatic access to concepts and documentation
4. **Semantic Web** - Providing structured data for semantic web applications
5. **Versioning** - Tracking changes to concepts over time

## Working with JSON Files

### Adding a New Concept, Pattern, or Anti-Pattern

When adding a new concept, pattern, or anti-pattern:

1. Create the Markdown file in the appropriate directory
2. Create a corresponding JSON file in the appropriate directory under `json/`
3. Ensure the JSON file includes:
   - A unique `@id` value
   - The correct `@type` value (`ci:Concept`, `ci:Pattern`, or `ci:AntiPattern`)
   - A label, description, and definition
   - Related concepts where appropriate
   - Author and canonical date information

### Adding a New Source Document

When adding a new canonical or epistemological source document:

1. Create the Markdown file in `docs/canonical-source-documents/` or `docs/source-documents/`
2. Run `npm run ensure-json` to automatically generate the corresponding JSON file
3. If needed, edit the generated JSON file to add additional metadata

### Validating JSON Files

To validate that all JSON files conform to their schemas:

```bash
# Validate core concepts, patterns, and anti-patterns
npm run validate

# Validate source documents
npm run validate:docs

# Validate all JSON files
npm run validate:all
```

### JSON ID Conventions

ID values in the JSON files follow these conventions:

- **Concepts**: `ci:concept.concept-name`
- **Patterns**: `ci:pattern.pattern-name`
- **Anti-Patterns**: `ci:antipattern.antipattern-name`
- **Canonical Source Documents**: `ci:canonical-source.document-name`
- **Epistemological Source Documents**: `ci:epistemological-source.document-name`

## JSON Schema

The repository contains two main schemas:

1. `ci-schema.json` - For concepts, patterns, and anti-patterns
2. `ci-document-schema.json` - For source documents

These schemas define the required and optional properties for each type of JSON file and ensure consistency across the repository.

## Automated Tools

The repository includes several tools to help work with JSON files:

- `scripts/ensure-json-files.js` - Creates JSON files for source documents
- `scripts/validate-all.js` - Validates all JSON files against their schemas 