# AI Intelligence: which pattern for which job

**Patterns (line range):** ai-chat 7-14 · ai-error-states 15-22 · ai-loading-states 23-30 · ai-suggestions 31-38 · context-window 39-46 · model-selector 47-54 · prompt-input 55-62 · response-feedback 63-70 · streaming-response 71-78 · token-counter 79-86

AI-powered interface patterns. Full pattern files: `patterns/ai-intelligence/<slug>.md`.

## ai-chat: AI Chat Interface

Conversational AI chat interfaces. Build effort high.
- **Also called:** chatbot, assistant, conversational UI
- **Use for:** Assistant sidebars and copilots; Support and help experiences; Conversation-first AI products
- **Not for:** Avoid adding AI-specific UI when a standard non-AI workflow would be clearer and more reliable; Do not expose advanced controls unless users can actually benefit from them; Do not hide model uncertainty behind polished visuals alone
- **Alternatives:** Prompt Input (ai-intelligence/prompt-input): when users need prompt input instead of ai chat interface as the primary interaction | Streaming Response (ai-intelligence/streaming-response): when users need streaming response instead of ai chat interface as the primary interaction | Response Feedback (ai-intelligence/response-feedback): when users need response feedback instead of ai chat interface as the primary interaction

## ai-error-states: AI Error States

Handling AI-specific errors. Build effort medium.
- **Also called:** AI failure, refusal
- **Use for:** Rate limit and provider errors; Safety or policy blocks; Network and timeout failures during generation
- **Not for:** Avoid adding AI-specific UI when a standard non-AI workflow would be clearer and more reliable; Do not expose advanced controls unless users can actually benefit from them; Do not hide model uncertainty behind polished visuals alone
- **Alternatives:** AI Loading States (ai-intelligence/ai-loading-states): when users need ai loading states instead of ai error states as the primary interaction | Notification (user-feedback/notification): when users need notification instead of ai error states as the primary interaction | Response Feedback (ai-intelligence/response-feedback): when users need response feedback instead of ai error states as the primary interaction

## ai-loading-states: AI Loading States

Loading states for AI operations. Build effort medium.
- **Also called:** thinking indicator
- **Use for:** Long-running generation; Tool calls and retrieval; Stream setup before first tokens arrive
- **Not for:** Avoid adding AI-specific UI when a standard non-AI workflow would be clearer and more reliable; Do not expose advanced controls unless users can actually benefit from them; Do not hide model uncertainty behind polished visuals alone
- **Alternatives:** Streaming Response (ai-intelligence/streaming-response): when users need streaming response instead of ai loading states as the primary interaction | Loading Indicator (user-feedback/loading-indicator): when users need loading indicator instead of ai loading states as the primary interaction | Skeleton (user-feedback/skeleton): when users need skeleton instead of ai loading states as the primary interaction

## ai-suggestions: AI Suggestions

AI-powered autocomplete and suggestions. Build effort medium.
- **Also called:** inline completion, smart suggestions
- **Use for:** Inline prompt completion; Recommended next actions; AI help inside editors and forms
- **Not for:** Avoid adding AI-specific UI when a standard non-AI workflow would be clearer and more reliable; Do not expose advanced controls unless users can actually benefit from them; Do not hide model uncertainty behind polished visuals alone
- **Alternatives:** Autocomplete (forms/autocomplete): when users need autocomplete instead of ai suggestions as the primary interaction | Prompt Input (ai-intelligence/prompt-input): when users need prompt input instead of ai suggestions as the primary interaction | Model Selector (ai-intelligence/model-selector): when users need model selector instead of ai suggestions as the primary interaction

## context-window: Context Window

Managing AI conversation context. Build effort high.
- **Also called:** context limit
- **Use for:** Long-running AI work sessions; File-heavy chat and copilots; Systems with prompt or response truncation risk
- **Not for:** Avoid adding AI-specific UI when a standard non-AI workflow would be clearer and more reliable; Do not expose advanced controls unless users can actually benefit from them; Do not hide model uncertainty behind polished visuals alone
- **Alternatives:** Token Counter (ai-intelligence/token-counter): when users need token counter instead of context window as the primary interaction | AI Chat Interface (ai-intelligence/ai-chat): when users need ai chat interface instead of context window as the primary interaction | Streaming Response (ai-intelligence/streaming-response): when users need streaming response instead of context window as the primary interaction

## model-selector: Model Selector

AI model selection interface. Build effort medium.
- **Also called:** model picker
- **Use for:** Multi-model AI workbenches; Speed-versus-quality tradeoffs; Feature-gated AI interfaces
- **Not for:** Avoid adding AI-specific UI when a standard non-AI workflow would be clearer and more reliable; Do not expose advanced controls unless users can actually benefit from them; Do not hide model uncertainty behind polished visuals alone
- **Alternatives:** Prompt Input (ai-intelligence/prompt-input): when users need prompt input instead of model selector as the primary interaction | Token Counter (ai-intelligence/token-counter): when users need token counter instead of model selector as the primary interaction | Response Feedback (ai-intelligence/response-feedback): when users need response feedback instead of model selector as the primary interaction

## prompt-input: Prompt Input

Enhanced text inputs for AI prompts. Build effort medium.
- **Also called:** chat composer, message box
- **Use for:** Chat composer experiences; AI workbench prompts; Structured prompting with attachments or modes
- **Not for:** Avoid adding AI-specific UI when a standard non-AI workflow would be clearer and more reliable; Do not expose advanced controls unless users can actually benefit from them; Do not hide model uncertainty behind polished visuals alone
- **Alternatives:** Text Field (forms/text-field): when users need text field instead of prompt input as the primary interaction | Textarea (forms/textarea): when users need textarea instead of prompt input as the primary interaction | AI Suggestions (ai-intelligence/ai-suggestions): when users need ai suggestions instead of prompt input as the primary interaction

## response-feedback: Response Feedback

Feedback mechanisms for AI responses. Build effort medium.
- **Also called:** thumbs up/down
- **Use for:** Thumbs up and down on generated responses; Quality review flows for internal copilots; Regeneration loops after an unsatisfactory answer
- **Not for:** Avoid adding AI-specific UI when a standard non-AI workflow would be clearer and more reliable; Do not expose advanced controls unless users can actually benefit from them; Do not hide model uncertainty behind polished visuals alone
- **Alternatives:** Like Button (social/like-button): when users need like button instead of response feedback as the primary interaction | Notification (user-feedback/notification): when users need notification instead of response feedback as the primary interaction | AI Error States (ai-intelligence/ai-error-states): when users need ai error states instead of response feedback as the primary interaction

## streaming-response: Streaming Response

Real-time AI response streaming. Build effort high.
- **Also called:** typing effect, token streaming
- **Use for:** Chat and assistant answers; Structured AI output that unfolds over time; Long responses where immediate reading matters
- **Not for:** Avoid adding AI-specific UI when a standard non-AI workflow would be clearer and more reliable; Do not expose advanced controls unless users can actually benefit from them; Do not hide model uncertainty behind polished visuals alone
- **Alternatives:** AI Loading States (ai-intelligence/ai-loading-states): when users need ai loading states instead of streaming response as the primary interaction | AI Chat Interface (ai-intelligence/ai-chat): when users need ai chat interface instead of streaming response as the primary interaction | Context Window (ai-intelligence/context-window): when users need context window instead of streaming response as the primary interaction

## token-counter: Token Counter

Display token usage and limits. Build effort medium.
- **Also called:** usage meter
- **Use for:** Prompt authoring with hard limits; Cost-sensitive AI tools; Debugging truncation and context overflow
- **Not for:** Avoid adding AI-specific UI when a standard non-AI workflow would be clearer and more reliable; Do not expose advanced controls unless users can actually benefit from them; Do not hide model uncertainty behind polished visuals alone
- **Alternatives:** Context Window (ai-intelligence/context-window): when users need context window instead of token counter as the primary interaction | Prompt Input (ai-intelligence/prompt-input): when users need prompt input instead of token counter as the primary interaction | Model Selector (ai-intelligence/model-selector): when users need model selector instead of token counter as the primary interaction
