
import registerGuest from "../api/user/registerGuest";
import enterArenaQueue from "../api/arena/enterArenaQueue";
import RequestHandler from "../requestHandler";
import IActionData from "../types/game/actionData";
import buildStart, { IMoveData } from "../api/build/buildStart"
import IBoard from "../types/game/board";
import IMinion from "../types/game/minion";
import playMinion from "../api/build/playMinion"
import playSpell from "../api/build/playSpell"
import {minionNames, minionEmoji} from "../data/minions"
import {spellNames, spellEmoji} from "../data/spells"
import ISpell from "../types/game/spell";
import getCurrentUserInfo from "../api/user/currentUserInfo"
import IUserInfo  from "../types/userInfo";
import rollShop from "../api/build/rollShop"
export default class Match {
	requestHandler:RequestHandler = new RequestHandler("16");
	authToken:string;
	lastActionData:IActionData;
	moveData: IMoveData;
	boardData:IBoard;
	gameState:IUserInfo;
	buildId:string;
	boardId:string;
	participationId:string;

	constructor(private handler:RequestHandler) {}

	async init() {
		await registerGuest(this.handler).then(res => this.authToken = res.Token);
		await this.syncState();
	}

	private petEmoji(pet:IMinion) {
		if(pet){
			return minionEmoji[minionNames[pet.Enum]];
		}
		return "➖"
	}
	
	private foodEmoji(food:ISpell) {
		if(food) {
			return spellEmoji[spellNames[food.Enum]];
		}
		return "➖"
	}

	private petsToEmoji(pets: IMinion[]) {
		return pets.map((pet:IMinion) => this.petEmoji(pet))
	}

	private foodsToEmoji(foods: ISpell[]) {
		return foods.map((food:ISpell) => this.foodEmoji(food))

	}

	getTeamPet(index:number): IMinion | null {
		return this.boardData.Minions.Items[index];
	}

	getShopPet(index:number):IMinion | null {
		return this.boardData.MinionShop[index];
	}

	getShopSpell(index:number):ISpell | null {
		return this.boardData.SpellShop[index];
	}

	private async syncState() {
		this.gameState = await getCurrentUserInfo(this.handler, this.authToken)
	}

	async rollShop() {
		await rollShop(this.handler, this.authToken, this.moveData);
		await this.syncState();
	}
	
	async buyPet(shopIndex:number, teamIndex:number) {
		const pet = this.getShopPet(shopIndex);

		const playData = await playMinion(this.handler, this.authToken, {
			Aim:null, 
			Data:this.moveData,
			MinionId: pet.Id,
			Point: {
				x:teamIndex,
				y:0
			}
		});
		this.setHash(playData.Data.Hash);
		await this.syncState();
	}

	async buyFood(shopIndex:number, teamIndex:number) {
		const pet = this.getTeamPet(teamIndex);
		const spell = this.getShopSpell(shopIndex);
		await playSpell(this.handler, this.authToken, {
			Aim: pet.Id,
			Data: this.moveData,
			SpellId: spell.Id
		}).then(newData => {
			this.setHash(newData.Data.Hash);
		})
	}

	printBoard() {
		console.log("Team:")
		console.log(this.petsToEmoji(this.gameState.ArenaMatch.Build.Board.Minions.Items), "\n")
		console.log("Shop Pets:")
		console.log(this.petsToEmoji(this.gameState.ArenaMatch.Build.Board.MinionShop), "\n")
		console.log("Shop Food:")
		console.log(this.foodsToEmoji(this.gameState.ArenaMatch.Build.Board.SpellShop), "\n")
	}

	async enqueue() {
		await enterArenaQueue(this.handler, this.authToken)
			.then(queueData => {
				this.participationId = queueData.ParticipationId;
				this.buildId = queueData.Build.Id;
				this.boardId = queueData.Build.Board.Id;
				this.boardData = queueData.Build.Board;
				this.moveData = {
					BoardHash: queueData.Build.Board.Hash,
					BoardFreezes: null,
					BoardOrders: null,
					BuildId:this.buildId
				}
			}
		);
		await this.syncState();
	}

	setHash(hash:number) {
		this.moveData.BoardHash = hash
	}

	async start() {
		await buildStart(this.handler, this.authToken, this.moveData)
			.then(data => this.setHash(data.Data.Hash))
	}
}