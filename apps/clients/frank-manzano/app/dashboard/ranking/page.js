import LeaderboardTable from "@/components/training/LeaderboardTable";
import { getLeaderboard, getMyRank } from "@/libs/training";
import config from "@/config";

export const dynamic = "force-dynamic";

export const metadata = { title: `Ranking | ${config.appName}` };

export default async function RankingPage({ searchParams }) {
  const { periodo } = await searchParams;
  const period = periodo === "mes" ? "mes" : "total";

  const [rows, myRank] = await Promise.all([
    getLeaderboard(period, 30),
    getMyRank(period),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Gamificación</p>
        <h1 className="display mt-1 text-4xl text-base-content sm:text-5xl">Ranking</h1>
        <p className="mt-2 max-w-2xl text-base-content/60">
          Cada sesión registrada suma XP. Los días seguidos suman más. Si prefieres no
          aparecer, puedes salir del ranking desde <strong>Mis datos</strong>.
        </p>
      </header>

      <LeaderboardTable rows={rows} period={period} myRank={myRank} />
    </div>
  );
}
