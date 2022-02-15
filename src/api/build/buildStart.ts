import RequestHandler from "../../requestHandler";
import IBoardStart from "../../types/game/boardMoveHash";

export interface IMoveData {
	BoardFreezes: unknown[],
	BoardHash: number,
	BoardOrders: unknown,
	BuildId: string
}

// The IBuildData must be sent every time

export default async function buildStart(handler:RequestHandler, token:string, moveData:IMoveData) {
  return handler.getRequest<IBoardStart>()
    .setPath("build/start")
    .setMethod("POST")
		.setAuth(token)
    .setBody({ Data:moveData })
    .makeRequest()
}