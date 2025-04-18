---
id: ci:meta-stack.readme
author: "Rashid Azarang"
status: canonical
version: 1.0
summary: README documentation for manual-document-entries directory
---

---
id: ci:meta.prompt.manual-document-entries.readme
status: canonical
version: 1.0
summary: Overview of the manual document entry prompts used in the recursive publishing workflow
---

<!-- migrated from knowledge-base repo on 2025-04 -->

# Manual Entry Protocols: From Source to Canonical

This folder contains the **step-by-step prompts** used to manually or semi-automatically convert epistemic source documents (books, whitepapers, essays) into structured, canonical entries in the Cognitive Infrastructure knowledge base.

Each step is designed for **cooperation between humans and LLMs**, ensuring new content is not only added, but **refined, classified, interlinked, and upserted** into the recursive publishing system.

---

## 🧭 Overview of the 4-Step Process

| Step | Purpose | Output |
|------|---------|--------|
| **Step 1** | Extract conceptual atoms from a source document | YAML list of concepts, frameworks, diagnostics, etc. |
| **Step 2** | Generate properly structured `.md` files from YAML | Canonical Markdown files placed in `/docs/pending` |
| **Step 3** | Upsert and classify pending documents into the repo | Moved, merged, or archived in canonical structure |
| **Step 4** | Cross-reference and link concepts across the system | Related concepts updated, JSON + indexes refreshed |

---

## The Recursive Publishing Workflow

1. **[Step 1: Epistemic Extraction](step-1-epistemic-extraction.md)** - Extract core concepts, patterns, and other epistemic assets from unstructured manuscripts
2. **[Step 2: Canonical Entry Generation](step-2-canonical-entry-generation.md)** - Transform extracted units into structured markdown entries
3. **[Step 3: Upsert Pending Documents](step-3-upsert-pending-documents.md)** - Process, validate, and integrate draft documents into the canonical knowledge base
4. **[Step 4: Cross-Referencing Pass](step-4-cross-referencing-pass.md)** - Establish semantic relationships and bidirectional links between concepts

---

## 🛠️ Quick Guide: How to Use

1. **Start with Source**  
   Upload a PDF or `.md` file of the source material (book, whitepaper, etc.)

2. **Run Step 1**  
   Use the `step-1-epistemic-extraction.md` prompt with the source + `knowledge-base-summary.md` to extract YAML entries.

3. **Run Step 2**  
   Feed the YAML list into `step-2-canonical-entry-generation.md` to generate pending `.md` files for each canonical entry.

4. **Review or Edit Pending Files (Optional)**  
   Adjust metadata, filenames, or merge ideas manually if needed.

5. **Run Step 3**  
   Use the upsert protocol in `step-3-upsert-pending-documents.md` to move or replace canonical entries.

6. **Run Step 4**  
   Final pass to update related links, summaries, indexes, and ensure interconnection integrity.

---

## 🔁 Notes

- These steps are fully compatible with the recursive publishing engine.
- Future automation will unify these prompts into a fully-integrated ingestion pipeline.
- All outputs must conform to the canonical frontmatter and directory structure conventions.

---

## Related Resources

- [JSON Guide](../../json-guide.md) - Guide to the JSON representation of knowledge base entries
- [Scripts Guide](../../scripts-guide.md) - Overview of utility scripts used in the publishing workflow
- [CI Writer Tool](../../../tools/ci-writer.js) - Tool for automating content generation
- [CI Coder Tool](../../../tools/ci-coder.js) - Tool for validation and processing 