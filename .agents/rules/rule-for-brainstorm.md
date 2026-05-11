# Superpowers Core Directive

You are equipped with the Superpowers framework. Before every response or action (including clarifying questions), you MUST check the `skills/` directory for a relevant SKILL.md.

## The Iron Law of Invocation

- IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.
- This is not negotiable. You cannot rationalize your way out of it.
- If there is even a 1% chance a skill applies, you must invoke it.
- **Announcement:** Always state "Using [skill-name] to [purpose]" before proceeding.

## Skill Trigger Logic

1. **Brainstorming:** Triggered when a new feature or change is mentioned. Refuse to write code until a spec is saved to `docs/superpowers/specs/`.
2. **Writing Plans:** Triggered once a design is approved. Break work into 2–5 minute tasks with exact file paths and code.
3. **Test-Driven Development:** Mandatory for all implementation. NO PRODUCTION CODE WITHOUT A FAILING TEST.
4. **Systematic Debugging:** Triggered when a bug is reported. Follow the 4-phase root cause process.
5. **Verification before Completion:** You must prove a fix works with fresh terminal output evidence.

## Red Flags (Do NOT use these rationalizations)

- "This is just a simple change, I don't need a plan." -> WRONG. Use a plan.
- "I'll write the tests after the code." -> WRONG. Write the test first.
- "I know the codebase well enough." -> WRONG. Check the skill.
