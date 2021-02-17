<!-- [SNIPPET_REGISTRY disabled] -->
# Firebase Web Snippets

This repository holds code snippets used in Web documentation
on [firebase.google.com](https://firebase.google.com/docs/).

These snippets are part of our documentation and best read in the context of a documentation page rather than used directly. If you're looking to get started with the Firebase Web SDK the best place to start is [quicstart-web](https://github.com/firebase/quickstart-web).

## Example

Consider this page:
https://firebase.google.com/docs/database/web/lists-of-data

Each snippet in the page is dynamically included from the source in this repository, in this case mostly from this file:
https://github.com/firebase/snippets-web/blob/master/database/lists-of-data.js

Each snippet has a "region tag" which is defined by `// [START tag]` and `// [END tag]` comments. The code between the tags can be included in our documentation. Keeping the code on GitHub, rather than hard-coded into the HTML of our documentation, allows us to ensure the code is correct and up to date.

## Contributing

We love contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Build Status

[![Actions Status][gh-actions-badge]][gh-actions]

[gh-actions]: https://github.com/firebase/snippets-web/actions
[gh-actions-badge]: https://github.com/firebase/snippets-web/workflows/CI%20Tests/badge.svg
