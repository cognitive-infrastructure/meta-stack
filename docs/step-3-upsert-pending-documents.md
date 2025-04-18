---
id: ci:meta.prompt.recursive-ingestion.step-3
status: canonical
version: 1.0
summary: Defines the third stage in the recursive ingestion pipeline — processing, validating, and upserting draft documents into the canonical knowledge base.
relatedPrompts:
  - ci:meta.prompt.recursive-ingestion.step-1
  - ci:meta.prompt.recursive-ingestion.step-2
  - ci:meta.prompt.recursive-ingestion.step-4
---

# Step 3: Upsert Pending Documents

## Purpose

The Upsert Pending Documents phase establishes a self-scaling system for recursively processing draft documents and integrating them into the Cognitive Infrastructure knowledge base. It provides a single entry point (`/docs/pending/`) for adding new content, which is then automatically classified, structured, compared, and published according to the repository's canonical formats.

This protocol ensures structural integrity, avoids duplication, and evolves the knowledge base through a principled upsertion mechanism.

## Process Workflow

### 1. Draft Submission

New documents are submitted as Markdown (`.md`) files in the `/docs/pending/` directory. These drafts can be:
- Concept definitions
- Pattern implementations
- Anti-pattern descriptions
- Diagnostic frameworks
- Source condensations
- Meta-architectural documents
- Essays, Lexicon entries, or Frameworks (if not yet in repo)

Each draft should include:
- A descriptive filename
- A clear title (H1)
- Basic content outlining the concept/pattern

Optionally:
- Frontmatter with preliminary metadata
- TODO markers for sections requiring AI-assisted completion
- References to related concepts

### 2. Classification and Routing

1. **Analyze Content**: Determine type (core-concept, pattern, etc.) from metadata or structural cues.
2. **Determine Destination**:
   - Core concepts → `/core-concepts/`
   - Patterns → `/patterns-and-anti-patterns/patterns/`
   - Anti-patterns → `/patterns-and-anti-patterns/anti-patterns/`
   - Diagnostics → `/diagnostics/`
   - Frameworks → `/frameworks/`
   - Essays → `/essays/`
   - Lexicon Terms → `/lexicon/`
   - Meta documents → `/meta/`
3. **Generate Canonical Filename**: Normalize to kebab-case using the title.

### 3. Structural Transformation

1. **Apply Canonical Structure**:
   - Populate frontmatter (`id`, `status`, `version`, `summary`, `relatedConcepts`)
   - Ensure section headings match the type
   - Add placeholder TODOs if necessary

2. **Upsert Logic for Overlaps**:
   - If a matching entry already exists:
     - Parse both versions
     - Compare by:
       - Depth and precision
       - Inclusion of new principles, examples, or diagnostics
       - Narrative clarity or cross-linking
     - If the new draft is better:
       - Archive original into `/sources/archived/`
       - Replace with the new version
       - Note changes in the revision log and in-file comment block
     - If both are valuable:
       - Merge content (manual or assisted)
       - Preserve authorial context in comments
       - Retain original ID

3. **Generate JSON Representation**:
   - Create JSON twin in `/json/[type]/`
   - Ensure validity against schema

### 4. Integration and Publication

1. **Validation**:
   - Schema validation
   - Link resolution
   - Section completeness

2. **Repository Updates**:
   - Update `/meta/knowledge-base-summary.md` summary and filemap
   - Update `SUMMARY.md` and section indexes if needed
   - Note all changes in `## Revision Log` section of summary

3. **Final Commit**:
   - Move final document to correct directory
   - Remove from `/docs/pending/`
   - Commit with detailed message

### 5. Cross-Referencing Pass

Once all pending files are ingested, execute Step 4: Cross-Referencing Pass:
- Parse all `.md` and `.json` canonical entries
- Identify internal references and concept mentions
- Automatically populate `relatedConcepts` fields based on contextual matches
- Ensure bidirectional relationships between entries where relevant
- Flag unresolved or ambiguous links for manual review

## Criteria for Overlap Resolution

Use the following criteria to decide how to handle overlaps:
- Prefer conceptual **clarity and depth** over verbosity or polish
- Retain **unique principles, metaphors, or epistemic distinctions**
- Merge when documents cover distinct but related aspects
- Respect **original authorship and date** when possible
- Always link to archival versions when replacing

## Execution Instructions

```bash
# Generate TODO content
node tools/ci-writer.js --path docs/pending

# Process and upsert documents
node tools/ci-coder.js process-pending

# Validate results
node tools/ci-coder.js validate

# Execute Cross-Referencing Pass
node tools/ci-coder.js cross-reference

# Commit changes
git add .
git commit -m "Upserted documents from pending with canonical reconciliation and cross-referencing"
```

## Related Components

- Step 1: Epistemic Extraction
- Step 2: Canonical Entry Generation
- Step 4: Cross-Referencing Pass
- CI Writer (for automation)
- CI Coder (for validation and processing)

## Revision Log

- v1.0 (Apr 2025): Initial implementation of the Upsert Pending Documents phase
- v1.1 (Apr 2025): Added upsert logic and cross-referencing pass for overlapping entries 