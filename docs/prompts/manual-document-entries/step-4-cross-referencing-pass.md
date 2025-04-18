---
id: ci:meta.prompt.manual-document-entries.step-4
author: "Rashid Azarang"
status: canonical
version: 1.0
summary: Defines the fourth stage in the recursive ingestion pipeline — adding semantic relationships and bi-directional links across all canonical concepts in the repository.
relatedPrompts:
  - ci:meta.prompt.manual-document-entries.step-1
  - ci:meta.prompt.manual-document-entries.step-2
  - ci:meta.prompt.manual-document-entries.step-3
---

<!-- Migration Status: Complete -->

# Step 4: Cross-Referencing Pass

## Purpose

The Cross-Referencing Pass is the final stage in the recursive ingestion pipeline. It analyzes the semantic relationships between all canonical entries in the repository, establishing a rich network of bi-directional links. This process ensures that conceptual connections are explicitly documented, machine-readable, and navigable.

By systematically cross-referencing concepts, patterns, and anti-patterns, this phase transforms a collection of individual entries into a coherent knowledge graph.

## Process Overview

You are acting as a semantic interlinking engine for the Cognitive Infrastructure canon.

Your task is to traverse all canonical `.md` files in the repository and:
1. Analyze their content
2. Detect mentions or references to other known concepts
3. Populate the `relatedConcepts` array in the frontmatter accordingly
4. Ensure consistency across both the Markdown and corresponding `.json` representations in the meta-stack repository
5. Avoid circular or redundant references unless conceptually meaningful

## Instructions

1. Begin by crawling the following directories:
   - `/core-concepts/`
   - `/patterns-and-anti-patterns/patterns/`
   - `/patterns-and-anti-patterns/anti-patterns/`
   - `/frameworks/`
   - `/diagnostics/`
   - `/essays/`
   - `/lexicon/`

2. For each file:
   - Read the title, definition, and body
   - Detect mentions of other canonical concepts (by title or filename)
   - Update the `relatedConcepts` list in frontmatter of the Markdown file
   - Update the corresponding JSON twin in the meta-stack repository

3. Ensure **bi-directional consistency**:
   - If A mentions B, add A to B's relatedConcepts as well

4. Sort `relatedConcepts` alphabetically

5. Save changes with a descriptive changelog and commit

## Semantic Rules

- Mention alone is not sufficient: there must be meaningful conceptual relevance
- Prefer quality of linkage over quantity
- Do not link to non-canonical or draft content
- Add explanatory comments in code blocks if needed for manual review

## Example Frontmatter Before

```yaml
---
id: ci:core-concept.structural-debt
status: canonical
version: 1.0
summary: ...
relatedConcepts: []
---
```

## Example Frontmatter After

```yaml
---
id: ci:core-concept.structural-debt
status: canonical
version: 1.0
summary: ...
relatedConcepts: ["Clarity Laws", "Friction Ontology", "Modal Layer Architecture"]
---
```

## Execution Instructions

```bash
# Execute full cross-referencing pass
node tools/ci-coder.js cross-reference

# For targeted cross-referencing of specific files
node tools/ci-coder.js cross-reference --path core-concepts/structural-debt.md

# To validate results after cross-referencing
node tools/ci-coder.js validate
```

## Execution Context

You are the structural librarian for a recursive intelligence system. Create not just links, but meaning.

The Cross-Referencing Pass is designed to run:
- After new content is added via the Upsert Pending Documents phase
- Periodically to maintain semantic coherence as concepts evolve
- Before major releases to ensure knowledge graph consistency

## Related Components

- Step 1: Epistemic Extraction
- Step 2: Canonical Entry Generation
- Step 3: Upsert Pending Documents
- CI Coder (for validation and processing)

## Revision Log

- v1.0 (Apr 2025): Initial implementation of the Cross-Referencing Pass 