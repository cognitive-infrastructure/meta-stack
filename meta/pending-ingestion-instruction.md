{
  "id": "ci:meta.pending-ingestion-instruction",
  "version": "1.1",
  "status": "canonical",
  "title": "Pending Ingestion Protocol",
  "summary": "A self-scaling system for recursively processing draft documents and integrating them into the Cognitive Infrastructure knowledge base.",
  "sections": [
    {
      "title": "Purpose",
      "content": "The Pending Ingestion Protocol establishes a self-scaling system for recursively processing draft documents and integrating them into the Cognitive Infrastructure knowledge base. It provides a single entry point (`/docs/pending/`) for adding new content, which is then automatically classified, structured, compared, and published according to the repository's canonical formats. This protocol ensures structural integrity, avoids duplication, and evolves the knowledge base through a principled upsertion mechanism."
    },
    {
      "title": "Protocol Workflow",
      "content": "The protocol follows a five-stage workflow: 1) Draft Submission - New documents are submitted as Markdown files in the /docs/pending/ directory; 2) Classification and Routing - Documents are analyzed, classified by type, and routed to appropriate destinations; 3) Structural Transformation - Canonical structure is applied, overlapping entries are resolved through upsertion, and JSON representations are created; 4) Integration and Publication - Content is validated, repository metadata is updated, and documents are published to their final locations; 5) Cross-Referencing Pass - All entries are analyzed to identify relationships and ensure bidirectional references."
    },
    {
      "title": "Draft Submission",
      "content": "New documents are submitted as Markdown (.md) files in the `/docs/pending/` directory. These drafts can be concept definitions, pattern implementations, anti-pattern descriptions, diagnostic frameworks, source condensations, meta-architectural documents, essays, lexicon entries, or frameworks (if not yet in repo). Each draft should include a descriptive filename, a clear title (H1), and basic content outlining the concept/pattern. Optionally, drafts can include frontmatter with preliminary metadata, TODO markers for sections requiring AI-assisted completion, and references to related concepts."
    },
    {
      "title": "Classification and Routing",
      "content": "When executing the pending ingestion process: 1) Analyze Content: Determine type (core-concept, pattern, etc.) from metadata or structural cues; 2) Determine Destination: Route to appropriate directories including core-concepts, patterns, anti-patterns, diagnostics, frameworks, essays, lexicon, or meta; 3) Generate Canonical Filename: Normalize to kebab-case using the title."
    },
    {
      "title": "Structural Transformation",
      "content": "For each classified document: 1) Apply Canonical Structure: Populate frontmatter (id, status, version, summary, relatedConcepts), ensure section headings match the type, add placeholder TODOs if necessary; 2) Upsert Logic for Overlaps: If a matching entry already exists, parse both versions and compare by depth, precision, new content, and clarity - either archive and replace the original or merge content as appropriate; 3) Generate JSON Representation: Create JSON twin in /json/[type]/ and ensure validity against schema."
    },
    {
      "title": "Integration and Publication",
      "content": "After transformation: 1) Validation: Schema validation, link resolution, section completeness; 2) Repository Updates: Update /meta/knowledge-base-summary.md summary and filemap, update SUMMARY.md and section indexes if needed, note all changes in revision log; 3) Final Commit: Move final document to correct directory, remove from /docs/pending/, commit with detailed message."
    },
    {
      "title": "Cross-Referencing Pass",
      "content": "Once all pending files are ingested, execute the Cross-Referencing Pass: Parse all .md and .json canonical entries, identify internal references and concept mentions, automatically populate relatedConcepts fields based on contextual matches, ensure bidirectional relationships between entries where relevant, flag unresolved or ambiguous links for manual review."
    },
    {
      "title": "Criteria for Overlap Resolution",
      "content": "Use the following criteria to decide how to handle overlaps: Prefer conceptual clarity and depth over verbosity or polish, retain unique principles, metaphors, or epistemic distinctions, merge when documents cover distinct but related aspects, respect original authorship and date when possible, always link to archival versions when replacing."
    },
    {
      "title": "Execution Instructions",
      "content": "To process pending documents: 1) Generate TODO content with node tools/ci-writer.js --path docs/pending; 2) Process and upsert documents with node tools/ci-coder.js process-pending; 3) Validate results with node tools/ci-coder.js validate; 4) Execute Cross-Referencing Pass with node tools/ci-coder.js cross-reference; 5) Commit changes."
    },
    {
      "title": "Revision Log",
      "content": "v1.1 (Apr 2025): Added upsert logic and cross-referencing pass for overlapping entries; v1.0 (Apr 2025): Initial implementation of the Pending Ingestion Protocol"
    }
  ]
} 