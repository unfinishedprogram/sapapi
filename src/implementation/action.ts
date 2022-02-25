import IItemId from "../types/game/itemId"

export function PerformAction(action:Action):Promise<boolean> {
	return new Promise(async (res, rej) => {
		
	})
}

export abstract class Action {
	cost:number = 0;
}