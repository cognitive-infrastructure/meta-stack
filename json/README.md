# Cognitive Infrastructure JSON Repository

This directory contains structured JSON representations of all concepts, patterns, anti-patterns, and source documents in the Cognitive Infrastructure framework. These files provide machine-readable definitions that can be validated, indexed, and used in applications.

## Directory Structure

- **meta/** - Contains JSON schemas that define the structure of the various JSON files
  - `ci-schema.json` - Schema for concepts, patterns, and anti-patterns
  - `ci-document-schema.json` - Schema for canonical and epistemological source documents

- **core-concepts/** - JSON representations of core concepts
- **patterns/** - JSON representations of implementation patterns
- **anti-patterns/** - JSON representations of anti-patterns
- **docs/** - JSON representations of documentation
  - **canonical-source-documents/** - JSON files for canonical source documents
  - **source-documents/** - JSON files for epistemological source documents

## File Structure

### Concept/Pattern/Anti-Pattern JSON

```json
{
  "@context": { ... },
  "@id": "ci:concept.example-concept",
  "@type": "ci:Concept", // or ci:Pattern, ci:AntiPattern
  "version": "1.0",
  "label": {
    "en": "Example Concept"
  },
  "description": {
    "en": "Brief description of the concept."
  },
  "definition": {
    "en": "Canonical definition of the concept."
  },
  "principles": [ ... ],
  "relatedConcepts": [ ... ],
  "canonicalDate": "YYYY-MM-DD",
  "createdDate": "YYYY-MM-DD",
  "modifiedDate": "YYYY-MM-DD"
}
```

### Canonical Source Document JSON

```json
{
  "@context": { ... },
  "@id": "ci:canonical-source.example-concept",
  "@type": "ci:CanonicalSource",
  "version": "1.0",
  "title": "Example Concept: Canonical Source",
  "category": "canonical-source",
  "author": "Author Name",
  "sourceFile": "docs/canonical-source-documents/example-concept-canonical-source.md",
  "documentStructure": {
    "conceptualLayer": [ ... ],
    "theoreticalLayer": [ ... ],
    ...
  },
  "canonicalDate": "YYYY-MM-DD"
}
```

### Epistemological Source Document JSON

```json
{
  "@context": { ... },
  "@id": "ci:epistemological-source.example-concept",
  "@type": "ci:EpistemologicalSource",
  "version": "1.0",
  "title": "Example Concept: Epistemological Source",
  "category": "epistemological-source",
  "author": "Author Name",
  "sourceFile": "docs/source-documents/example-concept-epistemological-source.md",
  "documentType": "epistemological",
  "researchAreas": [ ... ],
  "externalReferences": [ ... ],
  "canonicalDate": "YYYY-MM-DD"
}
```

## Usage

These JSON files serve multiple purposes:

1. **Validation** - Ensuring that all concepts, patterns, and documents follow a consistent structure
2. **Indexing** - Supporting search and discovery across the knowledge base
3. **Integration** - Enabling programmatic access to the Cognitive Infrastructure framework
4. **Semantic Web** - Providing structured data that can be consumed by semantic web applications
5. **Version Control** - Tracking changes to concepts and documentation over time

JSON files are validated against schemas in the `meta/` directory using a script in the root of the repository:

```bash
npm run validate
```

## Contributing

When adding new concepts, patterns, or documents to the Cognitive Infrastructure framework, ensure that corresponding JSON files are created and validated against the appropriate schema.

1. Create the JSON file in the appropriate directory
2. Validate it against the schema
3. Update related JSON files with new cross-references if needed 