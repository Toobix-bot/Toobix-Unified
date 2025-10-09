# Toobix Unified Source & Attribution Policy

## Purpose
Provide verifiable context for every generated or imported piece of information, with special emphasis on Groq-based AI content. The policy applies to documentation, dashboards, MCP tools, command line scripts, and automated systems.

## Core Principles
1. **Traceability** – Every surfaced statement must link to its origin (prompt, dataset, manual input, or external citation).
2. **Transparency** – Users see the model, parameters, and confidence for AI outputs, alongside a short explanation of how the text was produced.
3. **Integrity** – Real-world facts must reference real sources; fictional or simulated content must be marked accordingly.

## Requirements by Content Type

### 1. Groq Generation
- Record the prompt, model, temperature, timestamp, and any system instructions.
- Return structured metadata containing:
  - `text`: generated output
  - `prompt`: full prompt (or redacted variant if sensitive)
  - `model`: Groq model identifier
  - `parameters`: temperature, max tokens, top_p, etc.
  - `timestamp`: ISO 8601 string
  - `source`: `{ provider: "groq", type: "generation" }`
  - `classification`: `fiction`, `simulation`, or `factual`
  - `notes`: free-form explanation, assumptions, disclaimers, or operator remarks
- Persist the metadata when storing responses (memory, logs, dashboards).
- Surface prompt + metadata in UI (tooltip, expandable panel, or side bar).
- If the API key is missing or a fallback is used, clearly state that the content is synthetic and should not be treated as authoritative.

### 2. Manual Inputs & Documentation
- Cite the human author and date.
- Reference external material with a URL or file path (e.g., `docs/ARCHITECTURE.md`).
- Use footnotes or inline `Source:` blocks for longer sections.

### 3. System Telemetry
- Attach the emitting service, dataset, and last refresh timestamp.
- Indicate whether data is live, cached, or simulated.

### 4. Fictional or Experimental Content
- Prefix with `fiction:` or `simulation:` tags in metadata.
- Include a short rationale explaining the creative intent or constraints.

## Implementation Checklist
1. Update `GroqService` to return structured results with metadata and helper utilities for citations.
2. Propagate metadata through MCP tools, APIs, dashboard modules, and idle-story subsystems.
3. Create reusable UI components that display attribution, disclaimers, and raw prompts.
4. Extend persistence layers (e.g., memory database) to store source metadata alongside content bodies.
5. Add automated tests to ensure metadata fields exist for Groq responses and high-level APIs.
6. Educate contributors via this policy, CONTRIBUTING.md, and onboarding tutorials.

## Storage & Retention
- Store AI generation metadata in the same record as the content.
- Maintain rolling logs (at least 30 days) for debugging and audit purposes.
  - `logs/ai/*.jsonl` recommended for structured logs.
- Redact personally identifiable information before persistence.

## User Experience Guidelines
- Show primary attribution inline; put verbose details behind a “Details” expander.
- For dashboards, add badges indicating `source: groq`, `confidence`, or `fiction`.
- Provide a one-click copy of the prompt + parameters for reproducibility.

## Governance
- The policy is part of Phase 4 quality gates.
- Changes require review by the system architecture or ethics maintainers.
- Violations should be tracked in `SECURITY_INCIDENT.md` or equivalent logs with remediation steps.

## References
- `docs/ETERNAL_SYSTEM.md` for system architecture context.
- `SECURITY_PRIVACY.md` for privacy handling requirements.
- `SYSTEM_STATUS.md` for operational reporting templates.

