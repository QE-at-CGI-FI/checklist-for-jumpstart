# checklist-for-jumpstart

While we discover features by using GitHub Copilot, watching over coverage of what we should be discovering may be beneficial. And making notes of our insights to share as summary does not hurt, I guess?

## Definition

An LLM agent runs tools in a loop to achieve a goal.

## Tools

- IDE: VS Code (options!)
- Extensions: Github Copilot, VS Code Speech
- Github Account: CGI Hosted or Public
- Github Copilot licence: Private or CGI's or Client's
- Version control: Git on GitHub (options!)
- MCPs: Built-in (IDE)

## Checklist

- [x] Admin rights, Developer exception group
- [x] Security classification to choice of Github Copilot licence
- [x] Central admin features: ask on delete, block local models, limit model access, limit MCPs, limit CLI, limit image recognition
- [x] LLM selection
- [x] From prompt engineering to context engineering
- [x] Context window size
- [x] Inline autocomplete and actions
- [x] Ask, Plan and Agent Mode
- [x] MCPs (code)
- [x] CLI (code)
- [x] Premium token consumption
- [x] Custom instructions (.github/copilot_instructions.md)
- [x] Custom agents (.github/agents/\*.agent.md)
- [x] Custom skills (.github/skills/this_skill/SKILL.md)
- [x] Built-in actions / wizards to create instructions, agents, skills, etc.
- [x] AI exchange
- [x] Awesome copilot https://github.com/github/awesome-copilot
- [x] Session history
- [x] Kill with Developer: Show Running Extensions
- [x] Hidden terminal

## Principles

- Virtual hand raise, use the mic not the chat
- 15 min per person as hands or boss, so rotate on 5 min timer
- Our experiences, through doing something - not a demo, but a discovery
- Pair and ensemble programming: strong-style navigation. For an idea to get to the computer, it must pass through someone else's hands.
- Navigate on highest level of abstraction that creates the action: Intent, location, details.

## Quotes

Governance through prompts is like lending a book to a friend and hoping it comes back.
— Pegah Ahmadi

If it turns out I worked more to preserve workslop, it does not add to the sense of trust.
—Maaret Pyhäjärvi

Developers on average spend as much as 58% of their time comprehending existing source code.
—Felienne Hermans

A majority of the production failures (77%) can be reproduced by a unit test.
—Kevlin Henney

# Expectations

- Experiences at CGI, what are common setting
- Limitations of agentic tools at CGI and getting things activated
- Professional use, easier to use it, minimizing own effort, VS and Github Copilot
- Additional information on top use of IntelliJ and Github Copilot
- Claude user, more clever ways after already getting along with AI
- Basics and use in daily work
- CGI provided copilot limits and the second tier access
- Blocked options, e.g. PR review (locally?)

# Shared tips

If you want to see what does the token mean:
https://platform.openai.com/tokenizer

What's a context
https://youtu.be/sFEDAkJy9Dc?si=IzsLI_uYtelDL55X&t=197
(threre is a change coming on claude tool call traffic, no need to watch the full video)

There are some pointers that point to repository level "guidance" files like CLAUDE.md / AGENTS:md are not helping much
https://arxiv.org/pdf/2602.11988
https://thomas-wiegold.com/blog/claude-md-helpful-or-expensive-noise/
