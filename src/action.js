const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
  const octokit = github.getOctokit(GITHUB_TOKEN);
  
  const issues = await octokit.paginate(
    "GET /repos/{owner}/{repo}/issues",
    { owner: "AuctionSoft", repo: "as2-clients" },
    (response) => response.data.map((issue) => issue.title)
  );

  console.log(issues.join(','));
}

run();
