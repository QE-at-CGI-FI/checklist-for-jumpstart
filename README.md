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
- [x] Auto model selection, 90% for _most available model_
- [x] From prompt engineering to context engineering
- [x] Context window size
- [x] Inline autocomplete and actions
- [x] Ask, Plan and Agent Mode
- [x] MCPs: playwright, ADO, Jira Rovo, D365 ERP, Bruno, ... 
- [x] CLI - Copilot and tools
- [x] Premium token consumption (on send)
- [x] Custom instructions (.github/copilot_instructions.md)
- [x] Custom agents (.github/agents/\*.agent.md)
- [x] Custom skills (.github/skills/this_skill/SKILL.md)
- [x] Built-in actions / wizards to create instructions, agents, skills, etc.
- [x] AI exchange
- [x] Awesome copilot https://github.com/github/awesome-copilot
- [x] Session history
- [x] Kill with Developer: Show Running Extensions
- [x] Hidden terminal
- [x] Approaches to greenfield and legacy codebases

## Principles

1. Ensemble learning: doing by rotating driver and navigator

- Our experiences, through doing something - not a demo, but a discovery
- Pair and ensemble programming: strong-style navigation. For an idea to get to the computer, it must pass through someone else's hands.
- Virtual hand raise, use the mic not the chat
- Sometimes you may want to ask for control of keyboard to show things as words are harder
- 15 min per person as hands or boss, so rotate on 5 min timer
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

## Expectations

### This session expectations

<insert expectations here>

### Past expectations

#### Foundations and getting started

- Basics and use in daily work
- Everything new
- Getting started with Q developer, what to use this thing for?
- What should be done so that it is really useful?

#### From autocomplete to agents

- Going beyond inline code completion
- Leveraging the agent side, creating your own agent, others' routines with Copilot
- Team of agents doing things at the same time
- More than ad hoc use
- What do you do with developer AI tools vs. general AI tools? How do you build agents?

#### Tools, workflows, and developer ergonomics

- Copilot CLI use
- Professional use, easier to use it, minimizing own effort, VS and Github Copilot
- Additional information on top use of IntelliJ and Github Copilot
- Claude user, more clever ways after already getting along with AI

#### Comparison and positioning

- Github Copilot vs. Claude Code vs. Amazon Q
- Understanding for purposes of selling these things as services, knowing a bit more than right now

#### Governance, controls, and enterprise constraints

- How to stay in control with these tools?
- Experiences at CGI, what are common setting
- Limitations of agentic tools at CGI and getting things activated
- CGI provided Copilot limits and the second tier access
- Blocked options, e.g. PR review (locally?)

## Shared tips

If you want to see what does the token mean:
https://platform.openai.com/tokenizer

What's a context
https://youtu.be/sFEDAkJy9Dc?si=IzsLI_uYtelDL55X&t=197
(threre is a change coming on claude tool call traffic, no need to watch the full video)

There are some pointers that point to repository level "guidance" files like CLAUDE.md / AGENTS:md are not helping much
https://arxiv.org/pdf/2602.11988
https://thomas-wiegold.com/blog/claude-md-helpful-or-expensive-noise/

Premium requests
https://dev.to/anchildress1/copilot-premium-requests-more-than-asked-exactly-what-you-need-8ph

Some clients choose to set up AI-in-IDE so that all models come through their AI-API-platform for cost control without blocking controls. The word around is that 200€ / dev per month is a running cost.
Setting up an agent that selects the reviewer agents out of a selection to be run on PRs has been a good approach.
AI-use-maturity model: from inline, agent-chat, agents-and-skills personal, team, organization and orchestrating tasks.
