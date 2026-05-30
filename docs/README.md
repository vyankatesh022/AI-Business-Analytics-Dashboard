# AI Token Preservation & Optimization Guide

This guide establishes the technical strategies and algorithms utilized by the **AI Business Analytics Dashboard** to minimize LLM token consumption, optimize context sizes, and prevent token exhaustion or abuse when using the Gemini and OpenAI APIs.

---

## Technical Token Preservation Strategies

### 1. Context Caching (Gemini API Integration)
- **Mechanism**: Leverage Gemini's native Context Caching for large datasets and repetitive Exploratory Data Analysis (EDA) tasks.
- **Implementation**: Cache the initial data schema and cleaned data overview for multi-turn chat sessions instead of re-transmitting the full context on every message.
- **Saving Impact**: Up to 80% reduction in token consumption for long analytical chats.

### 2. Prompt Compression & Schema Pruning
- **Column Pruning**: When feeding tabular business files to the AI, only transmit necessary columns and statistical data summaries (distributions, correlations, null ratios) instead of raw row-by-row data files.
- **Standardized Serialization**: Use compact, parsed JSON data maps instead of verbose Markdown or raw CSV representations.

### 3. Asynchronous Batch Processing
- **Pattern**: Run heavy statistical calculations (EDA, outliers) asynchronously in Python, sending only the final high-value metrics to the AI engine for business recommendation extraction, avoiding raw computing steps in LLM prompts.

---

## AppSec Token Abuse Safeguards (AI Security Checklist)

1. **User Token Quotas**: Implement Role-Based Access Control (RBAC) token limits:
   - **Free Users**: Strict maximum tokens per request (e.g., 2,000 tokens) and daily message limits.
   - **Pro / Premium Users**: High-performance thresholds with sliding window rate limits.
2. **Context Window Boundary Checks**: The FastAPI middleware dynamically calculates input payload token lengths before invoking the AI API, rejecting requests exceeding system-configured security limits.
3. **Structured Response Formats**: Enforce strict JSON schemas (using Pydantic models) to restrict LLM response lengths and prevent run-away token generation.
