
import registerGuest from "../api/user/registerGuest";
import enterArenaQueue from "../api/arena/enterArenaQueue";
import RequestHandler from "../requestHandler";
import IActionData from "../types/game/actionData";
import buildStart, { IMoveData } from "../api/build/buildStart"
import playMinion from "../api/build/playMinion"
import playSpell from "../api/build/playSpell"
import getCurrentUserInfo from "../api/user/currentUserInfo"
import IUserInfo  from "../types/userInfo";
import rollShop from "../api/build/rollShop"
import endBuild from "../api/build/end"
import ready from "../api/arena/ready"
import battle from "../api/arena/battle"
import watch from "../api/arena/watch"
import Board from "../implementation/board"
import IItemId from "../types/game/itemId";
import IBoardOrders from "../types/game/boardOrders"
import IBoardFreezes from "types/game/boardFreezes";
export default class Match {
	requestHandler:RequestHandler = new RequestHandler("16");
	authToken:string;
	lastActionData:IActionData;
	gameState:IUserInfo;
	buildId:string;
	boardId:string;
	participationId:string;
	board:Board;
	boardHash:number;

	onError:(message:string) => void = _ => {};

	constructor(private handler:RequestHandler) {}
	
	private logError(message:string){
		this.onError(message);
	}

	async loginAsGuest() {
		const accountInfo = await registerGuest(this.handler);
		this.authToken = accountInfo.Token;
		await this.syncState();
	}

	public get turn() {
		return this.gameState.ArenaMatch.Build.Board.Turn;
	}
	public get victories() {
		return this.gameState.ArenaMatch.Build.Board.Victories;
	}
	public get gold() {
		return this.gameState.ArenaMatch.Build.Board.Gold;
	}
	public get health() {
		return 10 - this.gameState.ArenaMatch.Build.Board.Losses;
	}

	get shopPets () {
		return this.gameState.ArenaMatch.Build.Board.MinionShop;
	}
	get shopFood () {
		return this.gameState.ArenaMatch.Build.Board.SpellShop;
	}
	get teamPets () {
		return this.gameState.ArenaMatch.Build.Board.Minions.Items;
	}

	async endBuild() {
		try {
			const data = await endBuild(this.handler, this.authToken, this.moveData);
			this.setHash(data.Data.Hash);
			const battleInfo = await ready(this.handler, this.authToken, this.participationId);
			const battleId = battleInfo.BattleId;
			await battle(this.handler, this.authToken, battleId);
			await watch(this.handler, this.authToken, this.participationId);
			await this.start();
		} catch(e) {
			this.logError(e);
		}
	}

	private async syncState() {
		this.gameState = await getCurrentUserInfo(this.handler, this.authToken);
		if(this.gameState.ArenaMatch){
			this.setHash(this.gameState.ArenaMatch.Build.Board.Hash);
			this.board = new Board(this.gameState.ArenaMatch.Build.Board);
		}
	}

	getPetByUnique(unique:number) {
		for(let minion of this.gameState.ArenaMatch.Build.Board.MinionShop) {
			if(minion.Id.Unique == unique){
				return minion;
			}
		}
		for (let minion of this.gameState.ArenaMatch.Build.Board.Minions.Items) {
			if(minion.Id.Unique == unique){
				return minion;
			}
		}
		return null;
	}

	getShopPetByUnique(unique:number) {
		for(let minion of this.gameState.ArenaMatch.Build.Board.MinionShop) {
			if(minion.Id.Unique == unique){
				return minion;
			}
		}
		return null;
	}

	getShopFoodByUnique(unique:number) {
		for(let spell of this.gameState.ArenaMatch.Build.Board.SpellShop) {
			if(spell.Id.Unique == unique){
				return spell;
			}
		}
		return null;
	}

	getShopItemById(id:IItemId) {
		return this.getShopPetByUnique(id.Unique) || this.getShopFoodByUnique(id.Unique)
	}

	async rollShop() {
		await rollShop(this.handler, this.authToken, this.moveData).then(data => {
			this.setHash(data.Data.Hash);
		});
		await this.syncState();
	}
	
	async buyPet(petId:IItemId, teamIndex:number) {
		await playMinion(this.handler, this.authToken, {
			Aim:null, 
			Data:this.moveData,
			MinionId: petId,
			Point: {
				x:teamIndex,
				y:0
			}
		}).then((dat) => {
			this.setHash(dat.Data.Hash);
		});
		await this.syncState();
	}

	async buyFood(foodId:IItemId, minionId:IItemId) {
		await playSpell(this.handler, this.authToken, {
			Aim: minionId,
			Data: this.moveData,
			SpellId: foodId
		}).then(newData => {
			this.setHash(newData.Data.Hash);
		})
		await this.syncState();
	}

	get moveData ():IMoveData {
		return {
			BoardHash: this.boardHash,
			BoardFreezes: this.getBoardFreezes(),
			BoardOrders: this.getBoardOrders(),
			BuildId:this.buildId
		}
	}
	async enqueue() {
		await enterArenaQueue(this.handler, this.authToken)
			.then(queueData => {
				this.participationId = queueData.ParticipationId;
				this.buildId = queueData.Build.Id;
				this.setHash(queueData.Build.Board.Hash);
			}
		);
		await this.syncState();
	}

	setHash(hash:number) {
		this.boardHash = hash;
	}
	

	freeze(id:IItemId) {
		this.getShopItemById(id).Frozen = true;
	}
	
	unfreeze(id:IItemId) {
		this.getShopItemById(id).Frozen = false;
	}

	async start() {
		await buildStart(this.handler, this.authToken, this.moveData)
			.then(data => this.setHash(data.Data.Hash))
		await this.syncState()
	}

	getBoardOrders():IBoardOrders {
		return this.board.minions.filter(minion => minion).map(
			minion => {
				return {
					MinionId:minion.Id,
					Point:minion.Point,
				}
			}
		)
	}

	getBoardFreezes():IBoardFreezes {
		let items = [...this.shopFood, ...this.shopPets];
		return items.map(item => {
			return {
				ItemId:item.Id,
				Freeze:item.Frozen
			}
		})
	}
}