
import registerGuest from "../api/user/registerGuest";
import enterArenaQueue from "../api/arena/enterArenaQueue";
import RequestHandler from "../requestHandler";
import IActionData from "../types/game/actionData";
import buildStart, { IMoveData } from "../api/build/buildStart"
import playMinion from "../api/build/playMinion"
import playSpell from "../api/build/playSpell"
import {minionNames, minionEmoji} from "../data/minions"
import {spellNames, spellEmoji} from "../data/spells"
import getCurrentUserInfo from "../api/user/currentUserInfo"
import IUserInfo  from "../types/userInfo";
import rollShop from "../api/build/rollShop"
import endBuild from "../api/build/end"
import ready from "../api/arena/ready"
import battle from "../api/arena/battle"
import watch from "../api/arena/watch"
import Board from "../implementation/board"
import IItemId from "types/game/itemId";

export default class Match {
	requestHandler:RequestHandler = new RequestHandler("16");
	authToken:string;
	lastActionData:IActionData;
	moveData: IMoveData;
	gameState:IUserInfo;
	buildId:string;
	boardId:string;
	participationId:string;
	board:Board;

	onError:(message:string) => void = _ => {};

	constructor(private handler:RequestHandler) {}
	
	private logError(message:string){
		this.onError(message);
	}

	async loginAsGuest() {
		await registerGuest(this.handler).then(res => this.authToken = res.Token);
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

	private printStats() {
		return `\
🎚️ : ${this.gameState.ArenaMatch.Build.Board.Tier}
🎲 : ${this.gameState.ArenaMatch.Build.Board.Turn}
🏆 : ${this.gameState.ArenaMatch.Build.Board.Victories}
🪙 : ${this.gameState.ArenaMatch.Build.Board.Gold}`
	}

	private printTeam() {
		return this.gameState.ArenaMatch.Build.Board.Minions.Items.map((pet, i) => {
			if(!pet) return `[${i}] ➖`;
			return `[${i}] ${minionEmoji[minionNames[pet.Enum]]} (${pet.Attack.Permanent + pet.Attack.Temporary},${pet.Health.Permanent + pet.Health.Temporary})`
		})
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

	private printShopPets() {
		return this.gameState.ArenaMatch.Build.Board.MinionShop.map(pet => {
			return `[${pet.Id.Unique}] ${minionEmoji[minionNames[pet.Enum]]} (${pet.Attack.Permanent + pet.Attack.Temporary},${pet.Health.Permanent + pet.Health.Temporary})`
		})
	}

	private printShopFood() {
		return this.gameState.ArenaMatch.Build.Board.SpellShop.map(item => 
			`[${item.Id.Unique}] ${spellEmoji[spellNames[item.Enum]]}`
		)
	}

	async endBuild() {
		this.setHash((await endBuild(this.handler, this.authToken, this.moveData)).Data.Hash);
		const battleId = (await ready(this.handler,this.authToken, this.participationId)).BattleId;
		await this.handleBattle(battleId);
		await watch(this.handler, this.authToken, this.participationId);
		await this.start();
	}

	async handleBattle(battleId:string) {
		await battle(this.handler, this.authToken, battleId);
	}

	async ready() {
		let battleId = (await ready(this.handler, this.authToken, this.participationId)).BattleId;
		await this.syncState();
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

	getShopItemByUnique(unique:number) {
		for(let spell of this.gameState.ArenaMatch.Build.Board.SpellShop) {
			if(spell.Id.Unique == unique){
				return spell;
			}
		}
		return null;
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

	async enqueue() {
		await enterArenaQueue(this.handler, this.authToken)
			.then(queueData => {
				this.participationId = queueData.ParticipationId;
				this.buildId = queueData.Build.Id;
				this.moveData = {
					BoardHash: queueData.Build.Board.Hash,
					BoardFreezes: [],
					BoardOrders: null,
					BuildId:this.buildId
				}
			}
		);
		await this.syncState();
	}

	setHash(hash:number) {
		this.moveData.BoardHash = hash;
	}

	freeze(id:IItemId) {
		this.clearFreeze(id);
		let item = this.getShopPetByUnique(id.Unique) || this.getShopItemByUnique(id.Unique);
		item.Frozen = true;		
		this.moveData.BoardFreezes.push(
			{
				ItemId:id,
				Freeze:true
			}
		)
	}

	clearFreeze(id:IItemId) {
		this.moveData.BoardFreezes = this.moveData.BoardFreezes.filter((free:{ItemId:IItemId,Freeze:boolean}) => free.ItemId.Unique != id.Unique);
	}
	
	unfreeze(id:IItemId) {
		this.clearFreeze(id)

		let item = this.getShopPetByUnique(id.Unique) || this.getShopItemByUnique(id.Unique);
		item.Frozen = false;

		this.moveData.BoardFreezes.push(
			{
				ItemId:id,
				Freeze:false
			}
		)
	}

	async start() {
		await buildStart(this.handler, this.authToken, this.moveData)
			.then(data => this.setHash(data.Data.Hash))
		await this.syncState()
	}
}