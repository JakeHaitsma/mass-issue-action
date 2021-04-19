const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  // Constants
  const REPO_OWNER = 'JacobHaitsma';
  const REPO_KEY_SUFFIX = '-auctionsoftware';
  const CLIENTS_REPO = 'test-clients-repo';
  const CLIENTS_REPO_ENV_PATH = 'custom_env';
  const REPO_CLIENT_FILE_EXTENSION = '.env';

  // Inputs
  const USER_ACCESS_TOKEN = core.getInput('USER_ACCESS_TOKEN');
  const actor = core.getInput('actor');
  const issueTitle = core.getInput('issue_title');
  const issueBody = core.getInput('issue_body') || '';

  // Get octokit w/ token
  const octokit = github.getOctokit(USER_ACCESS_TOKEN);
  
  // Get repo content at path
  console.log(`💬 Gathering repositories...`)
  const customEnvsData = await octokit.repos.getContent({
    owner: REPO_OWNER,
    repo: CLIENTS_REPO,
    path: CLIENTS_REPO_ENV_PATH
  });

  /* =============================================
    Create list of repositories on which to file issues
      -- Get the name of each file
      -- Trim .env
      -- Add suffix
     ============================================== */
  if (!customEnvsData.data) throw new Error(`No data at path "${CLIENT_REPO_ENV_PATH}" on repo "${REPO_OWNER}/${CLIENTS_REPO}"`)
  const customRepos =
    customEnvsData.data
      .filter((client) => client.name && client.name.endsWith(REPO_CLIENT_FILE_EXTENSION))
      .map((client) => `${client.name.toLowerCase().substr(0, client.name.indexOf(REPO_CLIENT_FILE_EXTENSION))}${REPO_KEY_SUFFIX}`);

  console.log(`💬 Filing issue with title "${issueTitle}" and content "${issueBody}" on ${customRepos.length} repositories...`);

  // For each repo, file an issue
  for (const repo of customRepos) {
    try {
      await octokit.issues.create({
        owner: REPO_OWNER,
        repo: repo,
        title: issueTitle,
        body: `${issueBody}<br /><br />Issued by "${actor}"`, // supports markdown, line breaks with <br />
      });
      console.log(`✅ Successfully filed issue on repository "${repo}"`);
    } catch (e) {
      console.error(`🚨 Error creating issue on repository "${repo}"`);
      console.error(e);
    }
  }
}

run();
