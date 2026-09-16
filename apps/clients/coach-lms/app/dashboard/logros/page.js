import { redirect } from "next/navigation";
import AchievementGrid from "@/components/training/AchievementGrid";
import GameStats from "@/components/training/GameStats";
import { getAchievements, getAthleteStats, getCurrentUser } from "@/libs/training";
import config from "@/config";

export const dynamic = "force-dynamic";

export const metadata = { title: `Medallas | ${config.appName}` };

export default async function AchievementsPage() {
  const { user } = await getCurrentUser();
  if (!user) redirect(config.auth.loginUrl);

  const [achievements, stats] = await Promise.all([
    getAchievements(user.id),
    getAthleteStats(user.id),
  ]);

  const unlocked = achievements.filter((achievement) => achievement.unlocked_at).length;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Gamificación</p>
        <h1 className="display mt-1 text-4xl text-base-content sm:text-5xl">Medallas</h1>
        <p className="mt-2 text-base-content/60">
          Llevas {unlocked} de {achievements.length}.
        </p>
      </header>

      <GameStats stats={stats} />
      <AchievementGrid achievements={achievements} />
    </div>
  );
}
