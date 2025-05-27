// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { auth, tools, v1, v2 } from 'osu-api-extended';
import config from './config.js';
import chalk from 'chalk';

const username = process.argv[2] || 'RealStr1ke';

await auth.login({
    type: 'v2',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    cachedTokenPath: './client.json'
});

const userSearch = await v2.search({
    type: 'site',
    mode: 'all',
    query: username,
});

console.log(`Searching for user: ${username}`);
if (userSearch?.user?.total === 0 || userSearch?.user?.data[0].username !== username) {
    console.error(chalk.red(`User ${username} not found!`));
    process.exit(1);
}
console.log(`Found user: ${userSearch?.user?.data[0].username} (${userSearch?.user?.data[0].id})`);

const programStartTime = new Date(); // Record the program start time
const loggedScoreIds = new Set<number>(); // Keep track of logged score IDs

console.log(`Program started at: ${programStartTime.toISOString()}`);

async function fetchAndLogNewScores() {
    try {
        const scores = await v2.scores.list({
            type: 'user_recent',
            user_id: userSearch.user.data[0].id,
            limit: 1,
        });
		// console.log(scores)

        for (const score of scores) {
            const scoreTime = new Date(score.ended_at);

            // Check if the score is new and hasn't been logged yet
            if (scoreTime > programStartTime && !loggedScoreIds.has(score.id)) {
                const songLine = `${chalk.cyan(score.beatmapset.title)} by ${chalk.magenta(score.beatmapset.artist)} | [${'★ ' + chalk.yellow(score.beatmap.difficulty_rating)}] ${chalk.green(score.beatmap.version)} ${chalk.italic(`(mapset by ${score.beatmapset.creator})`)} ${chalk.grey(`[${score.beatmap_id}]`)}`;

                const stats = score.statistics;
                const greats = stats.great || 0;
                const oks = stats.ok || 0;
                const mehs = stats.meh || 0;
                const misses = stats.miss || 0;
                const modsText = score.mods.length ? chalk.grey(`${tools.calculate_mods(score.mods, true).name}`) : chalk.grey('NM');
                const isFC = score.max_combo === (score.beatmap.count_circles + score.beatmap.count_sliders + score.beatmap.count_spinners);
                const fcText = isFC ? `(${chalk.green('FC')})` : '';
                const hits = `${chalk.blue(greats)}/${chalk.green(oks)}/${chalk.yellow(mehs)}/${chalk.red(misses)}`;

                const performanceLine = [
                    modsText,
                    chalk.grey(`${(score.accuracy * 100).toFixed(2)}%`),
                    score.pp ? chalk.yellow(`${score.pp.toFixed(2)}pp`) : chalk.red('No PP'),
                    chalk.cyan(score.classic_total_score.toLocaleString()),
                    hits,
                    `${chalk.grey(`${score.max_combo}x`)} ${fcText}`,
                ].join(' | ');

                console.log(`New score logged at ${scoreTime.toISOString()}:\n ${songLine}\n  ${performanceLine}\n`);
                loggedScoreIds.add(score.id); // Mark the score as logged
            }
        }
    } catch (error) {
        console.error('Error fetching scores:', error);
    }
}

// Query every 10 seconds
setInterval(fetchAndLogNewScores, 10000);