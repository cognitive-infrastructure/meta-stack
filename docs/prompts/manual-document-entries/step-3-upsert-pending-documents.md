---
id: ci:meta.prompt.manual-document-entries.step-3
author: "Rashid Azarang"
status: canonical
version: 1.2
summary: Defines the third stage in the recursive ingestion pipeline — manually processing, validating, and upserting draft documents into the canonical knowledge base using an LLM assistant without scripts, with special attention to preserving valuable nuances between similar documents.
relatedPrompts:
  - ci:meta.prompt.manual-document-entries.step-1
  - ci:meta.prompt.manual-document-entries.step-2
  - ci:meta.prompt.manual-document-entries.step-4
---

<!-- Migration Status: Complete -->

# Step 3: Upsert Pending Documents

## Purpose

The Upsert Pending Documents phase establishes a self-scaling system for recursively processing draft documents and integrating them into the Cognitive Infrastructure knowledge base. It provides a single entry point (`/docs/pending/`) for adding new content, which is then manually classified, structured, compared, and published according to the repository's canonical formats by an LLM assistant without using scripts.

This protocol ensures structural integrity, avoids duplication, and evolves the knowledge base through a principled upsertion mechanism, leveraging the unique capabilities of LLMs to understand context, make judgments about content quality, and handle the necessary transformations while preserving valuable nuances and distinct perspectives.

## Manual Processing by LLM

**IMPORTANT**: This document processing workflow is designed to be executed by an LLM assistant (like Claude) without using scripts or automated tools. The LLM will manually process each pending document one by one, making judgments about content quality and handling all necessary transformations directly.

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

The LLM assistant will:

1. **Analyze Content**: Determine type (core-concept, pattern, etc.) from metadata or structural cues in the document.
2. **Determine Destination**:
   - Core concepts → `/core-concepts/`
   - Patterns → `/patterns-and-anti-patterns/patterns/`
   - Anti-patterns → `/patterns-and-anti-patterns/anti-patterns/`
   - Diagnostics → `/diagnostics/`
   - Frameworks → `/frameworks/`
   - Essays → `/essays/`
   - Lexicon Terms → `/lexicon/`
   - Meta documents → `/meta/`
3. **Generate Canonical Filename**: Normalize to kebab-case using the title if needed.

### 3. Structural Transformation

The LLM assistant will:

1. **Apply Canonical Structure**:
   - Populate or verify frontmatter (`id`, `status`, `version`, `summary`, `relatedConcepts`)
   - Ensure section headings match the type
   - Add placeholder TODOs if necessary

2. **Nuanced Upsert Logic for Overlaps**:
   - Check if a matching entry already exists at the destination
   - **CRUCIAL**: Carefully examine both documents to identify unique perspectives, examples, frameworks, or insights — even small variations can contain valuable distinctions worth preserving
   - If a matching entry exists, evaluate using the following criteria:
     
     - **🟢 REPLACE** (If pending version is significantly better):
       - Archive original into `/sources/archived/`
       - Replace with the new version in the canonical location
       - **Important**: Even when replacing, preserve unique insights from the original by incorporating them into the new version
       - Note changes in the revision log and in-file comment block
       - Update or create the JSON twin in the meta-stack repository
     
     - **🟡 MERGE** (If both versions have unique value — should be the default approach for similar documents):
       - Combine the best elements from both versions
       - Preserve authorial context in comments
       - Retain original ID and location
       - Increment the version number
       - Ensure merged content preserves distinctive framing, examples, and insights from both sources
       - Update the JSON twin in the meta-stack repository
     
     - **🔵 KEEP ORIGINAL** (Only if pending adds absolutely no new value):
       - Archive the pending version for future reference rather than discarding
       - Document specific reasoning for not incorporating any elements
       - Consider adding unique elements as comments in the original
       - Optionally note this decision in a migration log
     
     - Compare versions based on:
       - Depth and precision of content
       - Inclusion of new principles, examples, or diagnostics
       - Narrative clarity and structural coherence
       - Cross-linking with other concepts
       - Unique perspectives or framing even if covering similar material
       - Different examples or applications that illuminate the concept in new ways
       - Distinctive language or metaphors that might resonate with different audiences

3. **Generate JSON Representation**:
   - Manually create a JSON twin in the meta-stack repository at `/meta-stack/json/[type]/`
   - Structure the JSON according to the document's content type
   - Ensure the JSON representation captures the nuances preserved in the markdown
   - Note: All JSON files should be stored in meta-stack, NOT in knowledge-base

### 4. Integration and Publication

The LLM assistant will:

1. **Validation**:
   - Ensure the document content is complete and well-structured
   - Verify all links are properly formatted
   - Check that all required sections are present
   - Confirm that valuable perspectives from all source documents are preserved

2. **Repository Updates**:
   - Update `/meta/knowledge-base-summary.md` to include the new document
   - Update `SUMMARY.md` to add the document to the appropriate section
   - Remove the document from the Pending Documents section in `SUMMARY.md`
   - Add an entry to the Revision Log in `/meta/knowledge-base-summary.md`

3. **Finalization**:
   - Delete the original document from `/docs/pending/` after it has been successfully processed and all unique insights have been preserved

### 5. Manual Cross-Referencing

The LLM assistant will:

- Identify internal references and concept mentions in the documents
- Update `relatedConcepts` fields in both the markdown and JSON files
- Ensure bidirectional relationships between entries where relevant
- Flag any unresolved or ambiguous links for human review

## Criteria for Nuanced Overlap Resolution

The LLM assistant will use the following criteria to decide how to handle overlaps, with a strong bias toward preserving valuable nuances:

- **Prefer preservation over elimination**: When in doubt, preserve unique elements rather than removing them
- **Look beyond surface similarities**: Documents may appear similar but contain distinct insights or framings
- Prefer conceptual **clarity and depth** over verbosity or polish
- **Identify and retain unique perspectives**: Different viewpoints provide valuable context even if covering similar topics
- **Preserve distinctive examples**: Different examples may resonate with different audiences or illuminate different aspects
- Retain **unique principles, metaphors, or epistemic distinctions**
- **Default to merging** when documents cover similar terrain but with different emphases
- **Integrate rather than select**: Combine strengths of multiple documents rather than choosing between them
- Respect **original authorship and date** when possible
- Always link to archival versions when replacing
- **Document integration decisions**: Note which elements were preserved and why

## Detailed Document Comparison Process

When comparing similar documents, the LLM should:

1. **Identify Unique Elements**: Create a list of elements unique to each document
2. **Recognize Complementary Perspectives**: Note how different articulations might serve different purposes
3. **Preserve Valuable Variations**: Maintain multiple ways of explaining the same concept if they offer different insights
4. **Integrate Harmoniously**: When merging, maintain narrative flow while incorporating diverse perspectives
5. **Consider Audience Value**: Assess how different formulations might benefit different readers
6. **Document Provenance**: Note the origin of key insights when merging content

## Manual Execution Process

Instead of using scripts, the LLM assistant will process each document manually:

1. List contents of the `/docs/pending/` directory
2. Examine each pending document one by one
3. Determine the appropriate destination based on content type
4. Check for existing files at the destination with similar content
5. Carefully compare documents for unique perspectives and valuable nuances
6. Process the document according to the workflow above, with special attention to preserving valuable distinctions
7. Create or update relevant JSON representations
8. Update index and summary files
9. Delete the processed document from the pending directory only after confirming all unique insights have been preserved

## Related Components

- Step 1: Epistemic Extraction
- Step 2: Canonical Entry Generation
- Step 4: Cross-Referencing Pass

## Revision Log

- v1.0 (Apr 2025): Initial implementation of the Upsert Pending Documents phase
- v1.1 (Apr 2025): Added upsert logic and cross-referencing pass for overlapping entries
- v1.2 (Apr 2025): Updated to specify manual processing by LLM assistant without scripts
- v1.3 (Apr 2025): Enhanced guidance on preserving valuable nuances when handling similar documents 