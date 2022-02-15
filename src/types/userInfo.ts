import IArenaInfo from "./arenaInfo";

export default interface IUserInfo {
	Id: string,
	DisplayName: string,
	Guest: boolean,
	Points: number,
	Cosmetic: number,
	Background: number,
	Pack: number,
	MatchesStarted: number,
	Abandon: number,
	EmailConfirmed: boolean,
	DeckId: unknown,
	Products: unknown[],
	ArenaMatch: IArenaInfo,
	VersusMatches: unknown[],
	VersusLimit: boolean,
	AchievementMinionFullLevel: unknown,
	AchievementMinionFullLevelVictory: unknown
} 