---
id: ci:meta.summary
author: "Rashid Azarang"
status: canonical
version: 1.0
summary: Complete index of the Meta-Stack repository content
---

<!-- migrated from knowledge-base repo on 2025-04 -->

# Summary

## Introduction
* [Introduction to Meta-Stack](README.md)
* [Recursive Publishing Engine](meta/recursive-publishing-engine.md)
* [Pending Ingestion Protocol](meta/pending-ingestion-instruction.md)

## Meta Documents
* [Knowledge Base PRD](meta/cognitive-infrastructure-knowledge-base.md)

## Documentation
* [JSON Guide](docs/json-guide.md)
* [Scripts Guide](docs/scripts-guide.md)
* [PRD - CI-Coder](docs/PRD-ci-coder.md)
* [PRD‑ci‑coder](docs/PRD‑ci‑coder.md)

## Document Entry Prompts
* [Step 1: Epistemic Extraction](docs/prompts/manual-document-entries/step-1-epistemic-extraction.md)
* [Step 2: Canonical Entry Generation](docs/prompts/manual-document-entries/step-2-canonical-entry-generation.md)
* [Step 3: Upsert Pending Documents](docs/prompts/manual-document-entries/step-3-upsert-pending-documents.md)
* [Step 4: Cross-Referencing Pass](docs/prompts/manual-document-entries/step-4-cross-referencing-pass.md)

## Development
* [CI Writer Tool](tools/ci-writer.js)
* [CI Coder Tool](tools/ci-coder.js)

## Scripts
* [Ensure JSON Files](scripts/ensure-json-files.js)
* [Update Related Sections](scripts/update-related-sections.js)
* [Validate All](scripts/validate-all.js)
* [Validate Migration](scripts/validate-migration.js)

## Revision Log

- v1.4 (Apr 2025): Reorganized documentation - moved process steps to prompts directory
- v1.3 (Apr 2025): Added migration validation script
- v1.2 (Apr 2025): Added infrastructure guides to Documentation section
- v1.1 (Apr 2025): Added Scripts section with utility scripts
- v1.0 (Apr 2025): Initial migration from knowledge-base monorepo 