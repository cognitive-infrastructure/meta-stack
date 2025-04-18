#!/usr/bin/env python3
"""
Script to add author field to JSON and Markdown files with YAML frontmatter.

This script recursively scans directories and adds 'author: "Rashid Azarang"' to:
1. JSON files without an existing author field (after title field)
2. Markdown files with YAML frontmatter without an existing author field (after title or id field)
"""

import os
import json
import re
import sys
from pathlib import Path

# Constants
AUTHOR_NAME = "Rashid Azarang"
AUTHOR_JSON = f'"author": "{AUTHOR_NAME}"'
AUTHOR_YAML = f'author: "{AUTHOR_NAME}"'

def process_json_file(file_path):
    """Process a JSON file to add the author field if it doesn't exist."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Skip if already has author field
    if '"author":' in content:
        return False

    try:
        # Load JSON while preserving the original string
        data = json.loads(content)
        
        # Skip if already has author key (case insensitive check)
        if any(k.lower() == 'author' for k in data.keys()):
            return False
        
        # Prepare the modified content
        if 'title' in data:
            # Add after title
            pattern = r'("title"\s*:\s*"[^"]*")(\s*,)?'
            replacement = r'\1,\n  ' + AUTHOR_JSON + r'\2'
            new_content = re.sub(pattern, replacement, content, count=1)
            
            # If no replacement was made (regex didn't match), add at the end
            if new_content == content:
                # Add before the last closing brace
                new_content = content.rstrip().rstrip('}') + f',\n  {AUTHOR_JSON}\n}}'
        # Check for @type field in RDF-style JSON
        elif '"@type"' in content:
            # Add after @type
            pattern = r'("@type"\s*:\s*"[^"]*")(\s*,)?'
            replacement = r'\1,\n  ' + AUTHOR_JSON + r'\2'
            new_content = re.sub(pattern, replacement, content, count=1)
            
            # If no replacement was made (regex didn't match), add at the end
            if new_content == content:
                # Add before the last closing brace
                new_content = content.rstrip().rstrip('}') + f',\n  {AUTHOR_JSON}\n}}'
        else:
            # Add at the end (before the last closing brace)
            new_content = content.rstrip().rstrip('}') + f',\n  {AUTHOR_JSON}\n}}'
    
        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        return True
    
    except json.JSONDecodeError:
        print(f"Error: {file_path} is not a valid JSON file. Skipping.")
        return False

def process_markdown_file(file_path):
    """Process a Markdown file to add the author field to YAML frontmatter if it doesn't exist."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if there's YAML frontmatter
    if not content.startswith('---'):
        return False
    
    # Find the end of the frontmatter
    end_frontmatter = content.find('---', 3)
    if end_frontmatter == -1:
        return False
    
    # Extract frontmatter
    frontmatter = content[:end_frontmatter]
    
    # Skip if already has author field
    if re.search(r'^author:', frontmatter, re.MULTILINE):
        return False
    
    # Find title or id line to insert after
    title_match = re.search(r'^title:', frontmatter, re.MULTILINE)
    id_match = re.search(r'^id:', frontmatter, re.MULTILINE)
    
    if title_match or id_match:
        # Use the first one that appears
        if title_match and (not id_match or title_match.start() < id_match.start()):
            # Insert after title
            line_to_match = title_match.group(0)
            line_end = frontmatter.find('\n', title_match.start())
            if line_end != -1:
                insert_position = line_end + 1
                new_frontmatter = frontmatter[:insert_position] + AUTHOR_YAML + '\n' + frontmatter[insert_position:]
            else:
                # Title is the last line in frontmatter
                new_frontmatter = frontmatter + AUTHOR_YAML + '\n'
        else:
            # Insert after id
            line_to_match = id_match.group(0)
            line_end = frontmatter.find('\n', id_match.start())
            if line_end != -1:
                insert_position = line_end + 1
                new_frontmatter = frontmatter[:insert_position] + AUTHOR_YAML + '\n' + frontmatter[insert_position:]
            else:
                # ID is the last line in frontmatter
                new_frontmatter = frontmatter + AUTHOR_YAML + '\n'
        
        # Reconstruct the full content
        new_content = new_frontmatter + content[end_frontmatter:]
        
        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        return True
    
    return False

def process_directory(directory='.'):
    """Recursively process all JSON and Markdown files in the given directory."""
    modified_files = []
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            
            # Process JSON files
            if file.endswith('.json'):
                if process_json_file(file_path):
                    modified_files.append(file_path)
            
            # Process Markdown files
            elif file.endswith('.md'):
                if process_markdown_file(file_path):
                    modified_files.append(file_path)
    
    return modified_files

if __name__ == "__main__":
    start_dir = "."
    if len(sys.argv) > 1:
        start_dir = sys.argv[1]
    
    print(f"Starting to process files in {os.path.abspath(start_dir)}...")
    modified = process_directory(start_dir)
    
    print(f"Modified {len(modified)} files:")
    for file in modified:
        print(f"  - {file}") 