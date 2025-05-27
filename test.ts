import axios from 'axios';
import chalk from 'chalk';

// Configuration
const username = "RealStr1ke";

// Types
interface Beatmap {
	mapset: BeatmapSet;
	id: number;
	mappers: User[];
}

interface BeatmapSet {
	id: number;
	title: string;
	artist: string;
	difficulties: Beatmap[];
	submittedDate: Date;
	status: "ranked" | "loved" | "qualified" | "pending" | "wip" | "graveyard";
	lastUpdated: Date;
	rankedDate: Date | null;
	video: boolean;
	nsfw: boolean;
	

}
interface Beatmap {
	id: number;
	beatmapset_id: number;
	difficulty_rating: number;
	mode: string;
	version: string;
	accuracy: number;
	ar: number;
	bpm: number;
	cs: number;
	drain: number;
	hit_length: number;
	total_length: number;
	max_combo: number;
	status: string;
	url: string;
	is_scoreable: boolean;
	playcount: number;
	passcount: number;
	count_circles: number;
	count_sliders: number;
	count_spinners: number;
	last_updated: string;
	ranked: number;
}

interface BeatmapSet {
	id: number;
	title: string;
	title_unicode: string;
	artist: string;
	artist_unicode: string;
	creator: string;
	status: string;
	source: string;
	tags: string;
	bpm: number;
	play_count: number;
	favourite_count: number;
	submitted_date: string;
	last_updated: string;
	ranked_date: string | null;
	ranked: number;
	storyboard: boolean;
	is_scoreable: boolean;
}
interface Score {

}

interface User {
	id: number;
	username: string;

}