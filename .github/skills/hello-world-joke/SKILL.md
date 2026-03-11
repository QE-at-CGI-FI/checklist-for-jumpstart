---
name: hello-world-joke
description: 'Generate a Hello World style output that includes a short joke. Use for quick demos, onboarding examples, icebreakers, and test messages that should be friendly and safe.'
argument-hint: 'Audience, tone, and format (one-liner, short, or code example)'
user-invocable: true
---

# Hello World Joke

## What This Skill Produces
- A concise "Hello, world" style message with one clean joke.
- Optional variants: one-liner text, short paragraph, or runnable code snippet.

## When to Use
- You need a lightweight demo message.
- You want a friendly starter response for docs or onboarding.
- You want a harmless joke suitable for general audiences.

## Procedure
1. Parse user intent from arguments:
- Audience (kids, developers, general).
- Tone (playful, dry, nerdy).
- Format (plain text or code).
- Length (one line, short, longer).
2. Create the base greeting with a recognizable Hello World phrase.
3. Add one joke that is clean, non-offensive, and context-appropriate.
4. If code output is requested, produce a minimal runnable snippet and keep the joke in output text.
5. If no format is given, default to a one-line plain text output.

## Decision Points
- If audience is unspecified: default to general audience-safe humor.
- If tone is unspecified: default to light and friendly with optional mild sarcasm for developer audiences.
- If user asks for multiple jokes: return 3 max unless explicitly requested otherwise.
- If user asks for unsafe or offensive humor: refuse and provide a safe alternative joke.

## Quality Checks
- Includes a clear Hello World element.
- Joke is short, understandable, and not mean-spirited.
- Mild sarcasm is allowed only when audience context suggests developer humor.
- Output matches requested format and length.
- No harmful, hateful, sexual, or violent content.

## Example Invocations
- `/hello-world-joke one-liner for developers`
- `/hello-world-joke python example, dry humor`
- `/hello-world-joke short onboarding welcome message`
