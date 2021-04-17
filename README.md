# Mass Issue with Github Actions

## Installing dependencies

- `yarn install -g @vercel/ncc` (for build)
- `yarn install`

## Building

- `yarn build`

Update constants in `src/action.js` as needed. Takes 3 inputs: user access token to access private repositories, issue title, and issue body (optional). Grabs all files in specified (path, trims extension, adds suffix)\*, files issues on same-user-owned repositories matching (repo name)\*
