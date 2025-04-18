---
id: ci:meta.prompt.recursive-ingestion.step-1
status: canonical
version: 1.0
summary: Defines the first stage in the recursive ingestion pipeline — extracting core concepts, patterns, diagnostics, and epistemic assets from unstructured manuscripts.
relatedPrompts:
  - ci:meta.prompt.recursive-ingestion.step-2
  - ci:meta.prompt.recursive-ingestion.step-3
  - ci:meta.prompt.recursive-ingestion.step-4
---

# Step 1: Epistemic Extraction

## Purpose

The Epistemic Extraction phase is the first step in transforming raw manuscripts—books, whitepapers, essays—into structured intelligence that can be integrated into the Cognitive Infrastructure canon.

This process does **not** summarize documents. Instead, it extracts **novel epistemic contributions** such as core concepts, frameworks, patterns, diagnostics, and terms. These extractions serve as candidates for canonical entries and prepare the ground for structural publishing.

## How It Works

Given two inputs:
1. `meta/knowledge-base-summary.md` – the current state of the Cognitive Infrastructure canon.
2. A source document (PDF or `.md`) – the new intellectual material to be evaluated.

The LLM runs the following extraction prompt:

```markdown
🔁 LLM INSTRUCTION PROMPT: Cognitive Extraction Pipeline

You are acting as an epistemic distillation engine for the field of Cognitive Infrastructure.

Your task is to extract only **novel, reusable contributions** that:
- Belong to our defined epistemic structure (core-concepts, patterns, diagnostics, etc.)
- Extend, refine, or supplement what already exists
- Are epistemologically rich and structurally sound

For each unit, return:
- title
- type
- 1-line summary
- proposed filename
- suggested path
- overlap notes (if any)
```

## Output Format

The result is a YAML block listing all epistemic units extracted. Each entry becomes a candidate for formalization via canonical .md files in Step 2.

```yaml
extractions:
  - title: "Conceptual Integrity"
    type: "core-concept"
    summary: "The principle that a system's design must proceed from a unified, coherent conceptual framework."
    filename: "conceptual-integrity.md"
    path: "/core-concepts/"
    overlap_notes: "May refine aspects of Semantic Foundation pattern"
  
  - title: "Recursive Comprehension"
    type: "pattern"
    summary: "A structure for ensuring systems can understand their own design principles."
    filename: "recursive-comprehension.md"
    path: "/patterns-and-anti-patterns/patterns/"
    overlap_notes: null
```

## Evaluation Criteria

- Prefer atomic ideas over narrative summaries
- Flag overlaps with existing concepts
- Reject shallow definitions or repeated content
- Only include ideas that can live on as independent epistemic assets

## Next Step

Once extracted, pass the YAML output into Step 2: Canonical Entry Generation, where .md files are created using standard structural templates.

## Related Components

- Step 2: Canonical Entry Generation
- Step 3: Upsert Pending Documents
- Step 4: Cross-Referencing Pass
- CI Writer (for automation)

## Revision Log

- v1.0 (Apr 2025): Initial implementation of the Epistemic Extraction phase 