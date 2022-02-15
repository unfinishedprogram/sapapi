import IBuild from "./build";

export default interface IArenaInfo {
	ParticipationId: string,
	Build: IBuild, 
	BattleId: null,
	BattleWatchedOn: null,
	MatchState: number,
	Ready: boolean,
	Players: number,
	PlayersMax: number,
	Private: boolean,
	Version: number,
	Kicked: null,
	CreatorUserId: null,
	Mode: number,
	Arena: unknown,
	Versus: null
}