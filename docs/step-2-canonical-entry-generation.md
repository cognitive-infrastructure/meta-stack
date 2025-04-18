---
id: ci:meta.prompt.recursive-ingestion.step-2
status: canonical
version: 1.0
summary: Defines the second stage in the recursive ingestion pipeline — transforming extracted epistemic units into structured canonical Markdown entries.
relatedPrompts:
  - ci:meta.prompt.recursive-ingestion.step-1
  - ci:meta.prompt.recursive-ingestion.step-3
  - ci:meta.prompt.recursive-ingestion.step-4
---

# Step 2: Canonical Entry Generation

## Purpose

This step transforms the YAML output of Step 1 (Epistemic Extraction) into fully structured `.md` files. Each epistemic unit becomes a first-class entry in the Cognitive Infrastructure repository.

This process ensures:
- Structural consistency across documents
- Proper metadata and frontmatter
- Immediate machine-readability and LLM ingestion

## How It Works

You use the following instruction prompt to guide the LLM:

```markdown
🔁 LLM INSTRUCTION PROMPT: Canonical Entry Generator

For each YAML block from the Epistemic Extraction output, generate a fully-structured Markdown file:
- Use the canonical frontmatter (`id`, `status`, `version`, `summary`, etc.)
- Apply the correct structural template by type (core-concept, pattern, framework, etc.)
- If `overlaps_with` is not null, treat as refinement or extension
- Output one `.md` per YAML entry
```

## Output Format

You will receive a list of .md files, correctly formatted and ready for placement in subdirectories like:
- `/core-concepts/`
- `/frameworks/`
- `/diagnostics/`
- `/patterns-and-anti-patterns/patterns/`
- `/patterns-and-anti-patterns/anti-patterns/`
- `/meta/`

Each canonical entry follows this basic structure:

```markdown
---
id: ci:core-concept.conceptual-integrity
status: canonical
version: 1.0
summary: The principle that a system's design must proceed from a unified, coherent conceptual framework.
relatedConcepts: []
---

# Conceptual Integrity

## Definition

Conceptual integrity is the principle that...

## Why It Matters

...

## Principles

1. ...
2. ...
3. ...

## Implementation

...
```

## Templates Used

Each file is based on a standardized structural template defined by type:
- **core-concept**: Definition → Why It Matters → Principles → Cross-links
- **framework**: Overview → Modal Layer Mapping → Use Cases
- **pattern**: Problem → Solution → Implementation → Examples
- **anti-pattern**: Symptoms → Diagnosis → Root Causes → Remedies
- **diagnostic**: Description → Procedure → Inputs/Outputs → When to Use

## Next Step

Move the generated .md files into `/docs/pending/` directory and run Step 3: Upsert Pending Documents to route, structure, and publish them.

## Related Components

- Step 1: Epistemic Extraction
- Step 3: Upsert Pending Documents 
- Step 4: Cross-Referencing Pass
- CI Writer (for automation)

## Revision Log

- v1.0 (Apr 2025): Initial implementation of the Canonical Entry Generation phase 