---
id: ci:meta.recursive-publishing-engine  
author: "Rashid Azarang"
status: canonical  
version: 1.0  
purpose: Self-description of publishing automation system  
---

<!-- Migration Status: Complete -->

# Recursive Publishing Engine

## 1. What It Is

The Recursive Publishing Engine is a self-documenting system that transforms markdown sources and structured concepts into living, evolving documentation. It orchestrates the generation, validation, maintenance, and evolution of the entire Cognitive Infrastructure knowledge base, ensuring consistency between human-readable documents and machine-parsable structured data.

This engine serves as a meta-architectural layer that enforces coherence across the repository while allowing controlled evolution of the knowledge structures. It bridges the gap between flexible human authoring and rigorous machine processing, creating a unified representation that serves both human and artificial intelligence consumers.

The system follows core principles of Cognitive Infrastructure in its own design—implementing Return-as-Intelligence through versioning, preventing Semantic Drift through validation, and establishing a Semantic Foundation through consistent formats and structures.

## 2. Why It Matters

The recursive publishing approach addresses several critical problems in knowledge management:

- **Epistemic Integrity**: By maintaining parallel representations (.md for humans, .json for machines) and validating their alignment, the system prevents cognitive drift and ensures shared understanding.

- **Versioned Truth**: Every concept and pattern is subject to versioned evolution, allowing clear tracking of how understanding develops while maintaining backward compatibility.

- **Structural Receptivity**: The repository is designed to incorporate new knowledge without fragmentation, maintaining coherence as the system expands.

- **Return Paths**: Through consistent naming, structured indexing, and machine-searchable metadata, the system provides explicit return routes to previously established knowledge.

- **Self-Description**: The system documents its own architecture and evolution rules, creating a meta-level awareness that allows it to be understood, maintained, and enhanced recursively.

Within Cognitive Infrastructure, this recursive publishing engine exemplifies the principle that intelligence architectures must themselves be subject to the same constraints and patterns they describe. It demonstrates a practical implementation of the SMI Triad (Structure-Memory-Interaction) through its file organization, versioning system, and automated generation processes.

## 3. How It Works

The recursive publishing process operates through several integrated components:

### Core Tools

- **ci-writer.js**: Acts as the generation layer, responsible for:
  - Scanning markdown files for TODO placeholders
  - Retrieving relevant content from source materials
  - Generating structured content based on context and templates
  - Filling in TODOs with consistent, well-formatted content
  - Ensuring newly generated content follows established patterns

- **ci-coder.js**: Functions as the validation and synchronization layer, handling:
  - JSON schema validation against established rules
  - Link checking and repair across documents
  - GitHub workflow generation and maintenance
  - Component scaffolding for new patterns, concepts, or tools
  - Pull request creation for automated updates

### Process Flow

1. **Source Addition**: Authors add new content to the `/sources` directory as manuscripts, PDFs, or structured excerpts.

2. **Detection and Generation**: CI-Writer scans the repository for TODO markers in Markdown files, which serve as generation triggers.

3. **Content Processing**: The system retrieves relevant source text, applies templates, and generates properly formatted content.

4. **Parallel Structure Maintenance**: For each Markdown file, a corresponding JSON representation is created or updated in the parallel `/json` directory structure.

5. **Validation**: CI-Coder validates all JSON files against their schemas, ensuring consistency and adherence to the established knowledge structures.

6. **Cross-Reference Management**: The system updates related sections across files, maintaining bidirectional links between connected concepts.

7. **Publication**: Once validated, content becomes available as a trusted reference that can be cited and built upon.

### Document Hierarchy

- **meta/knowledge-base-summary.md**: Acts as the root document and orientation point, providing an overview of the entire repository structure and content.

- **Core Concepts**: Foundational ideas are documented in both human-readable and machine-parsable formats.

- **Patterns and Anti-Patterns**: Implementation approaches and common pitfalls are captured in structured formats.

- **Canonical Source Documents**: In-depth treatments follow a consistent six-layer structure.

- **Meta Documents**: Self-descriptive documents (like this one) that explain the system's own architecture and evolution rules.

### .md and .json Relationship

Each concept in the repository exists simultaneously as:

- A Markdown document optimized for human reading and exploration
- A JSON representation with the same content but structured for machine processing
- Cross-references maintained automatically between related concepts

TODOs serve as insertion points where the system can add or update content, with explicit markers indicating generation needs.

## 4. Evolution Rules

The Recursive Publishing Engine itself must evolve according to these constraints:

1. **Documentation First**: Any structural changes to the publishing system must first update this meta-document before implementation.

2. **Tool Documentation**: New tools or scripts must be documented within this engine's description before becoming part of the standard workflow.

3. **Semantic Layer Integrity**: Changes to content generation logic must be reflected in the JSON schemas and validation rules.

4. **Compatibility**: Updates to ci-writer.js and ci-coder.js must maintain compatibility with existing document formats to avoid breaking changes.

5. **Version Control**: All meta-architectural changes must increment the version number of affected components and document the changes in the revision log.

6. **Structure-Memory Alignment**: File organization and naming conventions must consistently reflect the conceptual organization of the knowledge base.

7. **Test-Driven Evolution**: New features should include validation tests to ensure they properly maintain the integrity of the knowledge base.

8. **Declarative Configuration**: Generation rules and validation constraints should be externalized in configuration rather than embedded in code.

## 📎 Related Documents
* [Knowledge Base PRD](cognitive-infrastructure-knowledge-base.md)

## 5. Revision Log

- v1.0 (Apr 2025): Initial canonical meta-entry documenting publishing engine 