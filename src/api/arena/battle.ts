import RequestHandler from "../../requestHandler";
import IArenaInfo from "../../types/arenaInfo";
import IBoard from "../../types/game/board";

interface IBattleResult {
	Id: string,
	Seed: number,
	Outcome: number,
	ResolvedOn: string,
	WatchedOn: null,
	User: {
		Id: string,
		DisplayName: string
	},
	UserBoard: IBoard
	Opponent: {
		Id: string,
		DisplayName: string
	},
	OpponentBoard: IBoard
	EndResult: number
}

export default async function battle(
	handler: RequestHandler,
	token: string,
	battleId: string,
) {
	return handler.getRequest<IBattleResult>()
		.setPath(`battle/get/${battleId}`)
		.setMethod("GET")
		.setAuth(token)
		.makeRequest()
}