// import { Client, Auth, LegacyClient } from 'osu-web.js';
// import config from './config.js';
// // const api = new LegacyClient(config.apiKey);
// // const scores = await api.getUserRecentScores({
// //   	u: 17763506
// // });

// const auth = new Auth(config.clientId, config.clientSecret, config.redirectUri);
// const token = await auth.clientCredentialsGrant();
// // console.log(token);
// const api = new Client(token.access_token);
// // const events = await api.users.getUserRecentActivity(17763506);
// // console.log(events);
// const scores = await api.users.getUserScores(17763506, 'recent', {
// 	query: {
// 		mode: 'osu',
// 		limit: 3
// 	}
// });
// console.log(scores);

import { Client, Auth } from 'osu-web.js';
import config from './config.js';

const auth = new Auth(config.clientId, config.clientSecret, config.redirectUri);

async function main() {
    const programStartTime = new Date(); // Record the program start time
    const token = await auth.clientCredentialsGrant();
    const api = new Client(token.access_token);

    const loggedScoreIds = new Set<number>(); // Keep track of logged score IDs
	let loggedScoreCount = 0; // Initialize a counter for logged scores
	console.log('Authentication successful, starting score tracking...');

    console.log(`Program started at: ${programStartTime.toISOString()}`);

    async function fetchAndLogNewScores() {
        try {
            const scores = await api.users.getUserScores(17763506, 'recent', {
                query: {
                    mode: 'osu',
                    limit: 10
                }
            });

            for (const score of scores) {
                const scoreTime = new Date(score.created_at);

                // Check if the score is new and hasn't been logged yet
                if (scoreTime > programStartTime && !loggedScoreIds.has(score.id)) {
                    console.log(`New score logged at ${scoreTime.toISOString()}:`, score);
                    loggedScoreIds.add(score.id); // Mark the score as logged
                }
            }

			// Log the new scores found this query
			const newScoresCount = scores.filter(score => !loggedScoreIds.has(score.id)).length;
			if (newScoresCount > 0) {
				console.log(`New scores found in this query: ${newScoresCount}`);
				loggedScoreCount += newScoresCount; // Update the logged score count
			} else {
				console.log('No new scores found in this query.');
			}
        } catch (error) {
            console.error('Error fetching scores:', error);
        }
    }

    // Query every 10 seconds
    setInterval(fetchAndLogNewScores, 10000);
}

main().catch((error) => {
    console.error('Error initializing the program:', error);
});