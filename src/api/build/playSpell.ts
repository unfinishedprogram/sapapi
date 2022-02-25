import RequestHandler from "../../requestHandler";
import IBoardStart from "../../types/game/boardMoveHash";
import { IMoveData } from "./buildStart";

export interface IPlaySpellData {
	Aim: {
		BoardId:string, 
		Unique:number
	}
	Data: IMoveData
	SpellId: { 
		BoardId: string,
		Unique: number 
	}
}

export default async function playSpell(handler:RequestHandler, token:string, playSpellData:IPlaySpellData) {
  return handler.getRequest<IBoardStart>()
    .setPath("build/play-spell")
    .setMethod("POST")
		.setAuth(token)
    .setBody(playSpellData)
    .makeRequest()
}