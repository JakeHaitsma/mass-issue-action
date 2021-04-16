const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const MACHINE_WORKER_TOKEN = core.getInput('MACHINE_WORKER_TOKEN');
  const octokit = github.getOctokit(MACHINE_WORKER_TOKEN);
  
  const issues = await octokit.paginate(
    "GET /repos/{owner}/{repo}/issues",
    { owner: "AuctionSoft", repo: "as2-clients" },
    (response) => response.data.map((issue) => issue.title)
  );

  console.log(issues.join(','));
}

run();
