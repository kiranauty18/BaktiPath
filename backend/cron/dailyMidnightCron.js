const cron = require("node-cron");
const Devotee = require("../models/Devotee");
const DailyLeaderboard = require("../models/DailyLeaderboard");

// Helper: Formats YYYY-MM-DD
const getDateString = (daysOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Snapshot generator & day reset logic
const executeDailyMidnightRollover = async () => {
  try {
    const yesterday = getDateString(-1);
    const today = getDateString(0);

    console.log(
      `⏰ [CRON] Starting Daily Midnight Leaderboard Rollover for ${yesterday}...`,
    );

    // 1. Gather all devotees and compute their final scores for yesterday
    const devotees = await Devotee.find({ role: "devotee" })
      .select(
        "name lastQuizDate dailyQuizScore dailyQuizTimeTaken lastJapDate dailyCompletedMalas",
      )
      .lean();

    const formattedRankings = devotees
      .map((d) => {
        const quizScore =
          d.lastQuizDate === yesterday ? d.dailyQuizScore || 0 : 0;
        const quizTimeTaken =
          d.lastQuizDate === yesterday
            ? d.dailyQuizTimeTaken || 999999
            : 999999;
        const malas =
          d.lastJapDate === yesterday ? d.dailyCompletedMalas || 0 : 0;
        const japPoints = malas * 5;
        const combinedScore = quizScore + japPoints;

        return {
          devoteeId: d._id,
          name: d.name,
          quizScore,
          quizTimeTaken,
          completedMalas: malas,
          japPoints,
          combinedScore,
        };
      })
      .filter((item) => item.combinedScore > 0) // Keep participants who scored
      .sort((a, b) => {
        if (b.combinedScore !== a.combinedScore)
          return b.combinedScore - a.combinedScore;
        if (a.quizTimeTaken !== b.quizTimeTaken)
          return a.quizTimeTaken - b.quizTimeTaken;
        return b.completedMalas - a.completedMalas;
      })
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

    // 2. Archive snapshot into DailyLeaderboard
    await DailyLeaderboard.findOneAndUpdate(
      { date: yesterday },
      { date: yesterday, rankings: formattedRankings, isFinalized: true },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    console.log(
      `✅ [CRON] DailyLeaderboard snapshot archived for ${yesterday} (${formattedRankings.length} devotees).`,
    );

    // 3. Reset daily metrics on all devotees for the new day
    const resetResult = await Devotee.updateMany(
      {},
      {
        $set: {
          dailyQuizScore: 0,
          dailyQuizAttempts: 0,
          dailyQuizTimeTaken: 999999,
          dailyCompletedMalas: 0,
          japScore: 0,
          totalScore: 0,
          lastJapDate: today,
        },
      },
    );

    console.log(
      `🌅 [CRON] New day (${today}) started. Reset ${resetResult.modifiedCount} devotee daily scores.`,
    );
    return {
      success: true,
      yesterday,
      archivedDevotees: formattedRankings.length,
    };
  } catch (error) {
    console.error("❌ [CRON] Midnight Rollover Error:", error);
    throw error;
  }
};

// Initializes the cron job to run at 00:00 every day
const startMidnightCron = () => {
  cron.schedule("0 0 * * *", () => {
    executeDailyMidnightRollover();
  });
  console.log(
    "⏳ [CRON] Midnight Rollover scheduler initialized (runs daily at 00:00).",
  );
};

module.exports = {
  startMidnightCron,
  executeDailyMidnightRollover,
};
