import RequestHandler from "../../requestHandler";
import IBoardStart from "../../types/game/boardMoveHash";
import { IMoveData } from "./buildStart";

export interface IPlayMinionData {
	Aim: unknown
	Data: IMoveData
	MinionId: { 
		BoardId: string,
		Unique: number 
	}
	Point: { x: number, y: number }
}

export default async function playMinion(handler:RequestHandler, token:string, playMinionData:IPlayMinionData) {
  return handler.getRequest<IBoardStart>()
    .setPath("build/play-minion")
    .setMethod("POST")
		.setAuth(token)
    .setBody(playMinionData)
    .makeRequest()
}