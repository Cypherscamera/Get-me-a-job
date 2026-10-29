# Rule: Codebase Understanding & Knowledge Graph (Mandatory & Always Active)

Always maintain deep architectural awareness and ground codebase reasoning using the project knowledge graph.

## Directives
1. **On Session Start / Workspace Inspection**:
   - Always check for and read `.understand-anything/knowledge-graph.json` in the workspace root.
   - Read this graph to understand project structure, layers, entry points, components, and relationships before making changes or answering architectural questions.
   - If `.understand-anything/knowledge-graph.json` does not exist on a codebase, run `/understand` to generate it.
2. **MANDATORY GRAPH UPDATE ON CHANGES**:
   - Whenever ANY edits, updates, additions, deletions, or refactors are made to the codebase, the agent MUST update `.understand-anything/knowledge-graph.json` (via `/understand` incremental update or updating graph nodes/edges) before concluding the turn.
   - Never leave changed files unrecorded in the knowledge graph.
3. **Architecture & Navigation**:
   - Reference the knowledge graph nodes and layer mappings instead of blindly scanning entire repositories.
