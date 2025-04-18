---
title: "Scripts Directory"
author: "Rashid Azarang"
date: 2025-04-18
draft: false
---

# Scripts Directory

<!-- migrated from knowledge-base repo on 2025-04 -->

This directory contains utility scripts for managing the Cognitive Infrastructure repositories.

## Document Processing Scripts

### validate-migration.js

Validates the migration status of files across repositories, checking for consistent frontmatter and migration comments.

```bash
# Check migration status
node scripts/validate-migration.js

# Show detailed validation results
node scripts/validate-migration.js --details

# Automatically fix invalid files
node scripts/validate-migration.js --fix
```

### clean-pending.js

Cleans up processed files in the pending directory after running the ingestion process.

```bash
# List processed files and prompt for confirmation
node scripts/clean-pending.js

# Delete processed files without confirmation
node scripts/clean-pending.js --force
```

## Document Ingestion Workflow

The Cognitive Infrastructure repositories use a structured workflow for ingesting new documents:

1. **Document Preparation**: 
   - Place draft documents in the `knowledge-base/docs/pending/` directory
   - Ensure each document has a clear title (H1) and basic content

2. **Process Pending Documents**:
   ```bash
   # Process documents in the pending directory
   node meta-stack/tools/ci-coder.js process-pending
   ```
   This command:
   - Analyzes document content to determine type
   - Moves files to their canonical locations
   - Applies standardized frontmatter
   - Generates JSON representations
   - Removes the original files

3. **Cross-Reference Documents**:
   ```bash
   # Update related concepts across all documents
   node meta-stack/tools/ci-coder.js cross-reference
   ```
   This command:
   - Detects mentions of concepts across documents
   - Updates `relatedConcepts` fields in both Markdown and JSON files
   - Ensures bidirectional relationships between related concepts

4. **Clean Up Processed Files**:
   ```bash
   # Remove any remaining processed files
   node meta-stack/scripts/clean-pending.js --force
   ```

## Repository Structure Maintenance

### validate-all.js

Validates JSON files against schemas defined in the `meta-stack/json/meta/` directory.

```bash
# Validate all JSON files
node scripts/validate-all.js
```

### update-related-sections.js

Updates related sections in documentation files based on content analysis.

```bash
# Update related sections across all files
node scripts/update-related-sections.js
``` 