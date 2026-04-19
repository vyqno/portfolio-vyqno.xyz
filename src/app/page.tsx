import HomeWithSplash from "@/components/HomeWithSplash";
import SectionsPage from "@/components/SectionsPage";
import { fetchGithubBlocks, fetchContributionData } from "@/lib/github";

export default async function Home() {
  const [githubBlocks, contributionData] = await Promise.all([
    fetchGithubBlocks(),
    fetchContributionData(),
  ]);

  return (
    <HomeWithSplash>
      <div className="relative flex flex-col bg-background">
        <SectionsPage githubBlocks={githubBlocks} contributionData={contributionData} />
      </div>
    </HomeWithSplash>
  );
}
