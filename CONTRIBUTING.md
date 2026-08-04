# Contributing to MESBG List Builder

Thank you for considering a contribution to MESBG List Builder.

MESBG List Builder is an unofficial community project maintained in people's
free time. Clear, focused contributions are appreciated, whether they improve
the application, correct data, improve accessibility, update documentation, or
fix a bug.

## Code of conduct

Be respectful, constructive, and patient.

Assume good intent, discuss the work rather than the person, and avoid
harassment, discrimination, personal attacks, or deliberately disruptive
behaviour. Maintainers may close discussions or reject contributions that do
not meet these expectations.

## Before starting

Search the existing issues and pull requests before beginning work. Someone may
already be working on the same problem, or the maintainers may have relevant
context.

For small bug fixes, documentation corrections, accessibility improvements, and
minor data corrections, you may open a pull request directly.

Please open an issue before starting work on:

- Significant features or redesigns.
- Changes to saved data formats or migrations.
- Changes that affect roster validation or army-building rules broadly.
- Large dependency or architecture changes.
- Work likely to require substantial review or coordination.

Opening an issue first does not reserve the work indefinitely. It helps align
the proposed change with the direction and constraints of the project.

## Reporting security issues

Do not publish suspected security vulnerabilities in a public issue.

Report them privately to:

`support@mesbg-list-builder.com`

Include enough information to reproduce and assess the problem, but do not
include real user credentials, tokens, personal data, or other secrets.

## Legal and licensing requirements

Unless a file states otherwise, original project source code and project-authored
documentation are licensed under the GNU Affero General Public License version
3 only (`AGPL-3.0-only`). See `LICENSE` and `NOTICE.md`.

By submitting a contribution, you confirm that:

1. You created the contribution yourself, or you have the legal right to submit
   it.
2. You agree that the contribution may be distributed under
   `AGPL-3.0-only`.
3. You are not knowingly including confidential information, trade secrets, or
   material that you are not permitted to publish.
4. You understand that accepted contributions become part of a public
   repository and may be retained in its history.

No contributor licence agreement is currently required.

### Third-party and game-related material

This repository relates to the Middle-earth Strategy Battle Game and therefore
contains or refers to names, game data, trademarks, and other material that may
belong to third parties.

Do not contribute any of the following unless the repository clearly already
has permission to use it or you can document a compatible licence or explicit
permission:

- Scans, photographs, or substantial excerpts from rulebooks, supplements, or
  other publications.
- Third-party artwork, logos, icons, fonts, miniatures photography, or other
  images.
- Proprietary source code.
- Material copied from another application or website.
- New dependencies whose licences are incompatible with this project.

For corrections based on an official rulebook, FAQ, or errata document, provide
a concise source reference in the issue or pull request. Do not attach scans or
reproduce more proprietary text than is necessary to explain the correction.

The maintainers may decline or rewrite a contribution when its provenance or
licensing is unclear.

## Development setup

### Requirements

- Git.
- npm.
- A Node.js version supported by Vite 7:
  - Node.js 20.19 or newer, or
  - Node.js 22.12 or newer.
- Python 3 when working with the data-generation scripts.

### Install and run

```bash
git clone https://github.com/mhollink/mesbg-list-builder-v2024.git
cd mesbg-list-builder-v2024
npm ci
npm start
```

The development server is provided by Vite.

To expose the development server to other devices on your network:

```bash
npm run start:host
```

### Storybook

Run Storybook locally with:

```bash
npm run storybook
```

Build Storybook with:

```bash
npm run build-storybook
```

### Data generation

Changes to source data may require regenerating application data:

```bash
npm run build:data
```

On systems with `find` and `entr`, the data files can be watched with:

```bash
npm run watch:data
```

Always inspect generated changes before committing them. Do not commit unrelated
generated output.

## Making changes

Keep each contribution focused on one problem or coherent feature.

When changing code:

- Follow the existing React, TypeScript, Material UI, and project conventions.
- Prefer maintainable, testable code over clever or highly compressed code.
- Keep business rules separate from presentation where practical.
- Avoid introducing abstractions before they solve a demonstrated problem.
- Preserve keyboard operation, semantic HTML, screen-reader behaviour, and
  adequate contrast.
- Consider desktop and mobile layouts.
- Do not include unrelated formatting or refactoring in the same pull request.
- Never commit credentials, API keys, private configuration, personal data, or
  production exports.

When changing user-visible text, keep terminology consistent with the existing
application.

When changing persisted data, consider compatibility with existing browser and
cloud-synchronised data.

## Validating changes

Before opening a pull request, run:

```bash
npm run check
npm run build
```

`npm run check` validates formatting and linting. `npm run build` performs the
TypeScript and production build.

Depending on the change, also:

- Exercise the affected workflow manually with `npm start`.
- Verify keyboard-only navigation and relevant screen-reader output.
- Check narrow and wide viewport layouts.
- Build Storybook when shared components or stories changed.
- Regenerate and inspect data when source data changed.
- Add or update automated tests where the existing test setup covers the
  changed behaviour.

If a check cannot be run, explain why in the pull request.

## Commit guidance

Use clear commit messages that explain the change. Keep commits reasonably
small and avoid mixing unrelated work.

Examples:

```text
Fix roster summary when opening saved roster
Add date range filter to match history
Correct profile data for Crebain
```

Do not include generated version bumps unless the maintainers requested them.

## Pull requests

A pull request should include:

- A concise summary of what changed.
- Why the change is needed.
- How it was validated.
- Screenshots or recordings for visible UI changes.
- Accessibility considerations for interactive or visual changes.
- The relevant issue number, when applicable.
- A source reference for game-data, profile, FAQ, or errata corrections.
- Any migration or compatibility impact.

Mark unfinished work as a draft pull request.

Maintainers may request changes, edit small details, squash commits, or close a
pull request that does not fit the project. Review may take time because this is
a hobby project.

## Data and rules corrections

For a data or rules correction, include:

- The affected army, profile, model, rule, or option.
- The current behaviour or value.
- The proposed behaviour or value.
- The publication, FAQ, or errata source.
- The publication date or version when relevant.
- A short explanation of the impact on roster building or game mode.

Do not upload copyrighted publications or screenshots of them.

## Documentation

Documentation-only contributions are welcome. Use clear language, keep examples
current, and update links or screenshots when behaviour changes.

## Questions

For contribution questions, open an issue or contact the project through the
channels listed in the repository README.
