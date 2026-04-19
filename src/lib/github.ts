import type { BlockData } from "@/components/ui/isometric-block";

const GH_API = "https://api.github.com";

function authHeaders() {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  if (!token) {
    console.warn("[GitHub] GITHUB_ACCESS_TOKEN is missing from process.env");
  }
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function fetchGithubBlocks(): Promise<BlockData[]> {
  const opts = { headers: authHeaders(), next: { revalidate: 300 } } as const;

  const meRes = await fetch(`${GH_API}/user`, opts);
  if (!meRes.ok) {
    console.error("GitHub auth failed:", await meRes.text());
    return [];
  }
  const me: { login: string } = await meRes.json();
  const login = me.login;
  console.log(`[GitHub Sync] Authenticated as: ${login}`);

  const reposRes = await fetch(
    `${GH_API}/users/${login}/repos?sort=pushed&per_page=6&type=public`,
    opts
  );
  if (!reposRes.ok) {
    console.error("GitHub repos fetch failed:", await reposRes.text());
    return [];
  }
  const repos: GHRepo[] = await reposRes.json();
  if (!Array.isArray(repos)) return [];

  const blocks = await Promise.all(
    repos.map(async (repo, i) => {
      const commitsRes = await fetch(
        `${GH_API}/repos/${repo.full_name}/commits?per_page=3`,
        opts
      );
      const commits: GHCommit[] = commitsRes.ok ? await commitsRes.json() : [];

      return {
        blockNum: repos.length - i,
        repo: repo.full_name,
        repoUrl: repo.html_url,
        branch: repo.default_branch ?? "main",
        pushedAt: timeAgo(repo.pushed_at),
        isLatest: i === 0,
        commits: Array.isArray(commits)
          ? commits.map((c) => ({
              hash: c.sha,
              message: c.commit.message.split("\n")[0],
              url: c.html_url,
            }))
          : [],
      } satisfies BlockData;
    })
  );

  return blocks;
}

interface GHRepo {
  full_name: string;
  html_url: string;
  default_branch: string;
  pushed_at: string;
}

interface GHCommit {
  sha: string;
  html_url: string;
  commit: { message: string };
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
}

export interface ContributionData {
  totalContributions: number;
  weeks: { contributionDays: ContributionDay[] }[];
  login: string;
  followers: number;
  following: number;
  totalStars: number;
}

const GQL = "https://api.github.com/graphql";

export async function fetchContributionData(): Promise<ContributionData | null> {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  if (!token) {
    console.error("[GitHub] Cannot fetch contributions: Missing GITHUB_ACCESS_TOKEN");
    return null;
  }

  const query = `{
    viewer {
      login
      followers { totalCount }
      following { totalCount }
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
        nodes { stargazerCount }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }`;

  try {
    const res = await fetch(GQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({ query }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      next: { revalidate: 300 } as any,
    });

    if (!res.ok) return null;

    const json = await res.json() as {
      data?: {
        viewer: {
          login: string;
          followers: { totalCount: number };
          following: { totalCount: number };
          repositories: { nodes: { stargazerCount: number }[] };
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: number;
              weeks: { contributionDays: ContributionDay[] }[];
            };
          };
        };
      };
    };

    const viewer = json.data?.viewer;
    const cal = viewer?.contributionsCollection?.contributionCalendar;
    if (!cal || !viewer) return null;

    const totalStars = viewer.repositories.nodes.reduce(
      (acc, repo) => acc + repo.stargazerCount,
      0
    );

    return {
      login: viewer.login,
      totalContributions: cal.totalContributions,
      followers: viewer.followers.totalCount,
      following: viewer.following.totalCount,
      totalStars,
      weeks: cal.weeks,
    };
  } catch {
    return null;
  }
}
