import RequestHandler from "../../requestHandler";
import { IMoveData } from "../../api/build/buildStart";
import IBoard from "../../types/game/board";

interface IChoseNameResponse {
  AvailableAdjectives: [string, string, string],
  AvailableNouns: [string, string, string],
  AvailableCaptains:unknown,
  Board:IBoard;
  Id:string;
}

export default async function choseName (
  handler:RequestHandler, 
  token:string, 
  moveData:IMoveData,
	adjective:string,
	noun:string,
) {
  return handler.getRequest<IChoseNameResponse>()
    .setPath("build/name")
    .setMethod("POST")
    .setBody({
			data: moveData,
			adjevtive: adjective,
			noun:noun
		})
    .setAuth(token)
    .makeRequest()
}