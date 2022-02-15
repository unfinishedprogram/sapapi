
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
	private printStats() {
		return `🎚️ : ${this.gameState.ArenaMatch.Build.Board.Tier}
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
		this.gameState = await getCurrentUserInfo(this.handler, this.authToken);
		if(this.gameState.ArenaMatch){
			this.setHash(this.gameState.ArenaMatch.Build.Board.Hash);
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
	async rollShop() {
		await rollShop(this.handler, this.authToken, this.moveData).then(data => {
			this.setHash(data.Data.Hash);
		});
		await this.syncState();
	}
	
	async buyPet(petId:number, teamIndex:number) {
		console.log("Buying pet with id:", petId);

		const pet = this.getShopPetByUnique(petId);

		console.log("Pet object", pet);

		await playMinion(this.handler, this.authToken, {
			Aim:null, 
			Data:this.moveData,
			MinionId: pet.Id,
			Point: {
				x:teamIndex,
				y:0
			}
		}).then((dat) => {
			console.log(dat);
			this.setHash(dat.Data.Hash);
		});
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
		console.log(this.printStats())
		console.log("Team:")
		console.log(this.printTeam().join("\n"), "\n")
		console.log("Shop Pets:")
		console.log(this.printShopPets().join("\n"), "\n")
		console.log("Shop Food:")
		console.log(this.printShopFood().join("\n"), "\n")
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
					BoardFreezes: [],
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

	freeze(id:number) {
		this.clearFreeze(id);
		this.moveData.BoardFreezes.push(
			{
				ItemId:this.getPetByUnique(id).Id,
				Freeze:true
			}
		)
		console.log(this.moveData.BoardFreezes);
	}

	clearFreeze(id:number) {
		this.moveData.BoardFreezes = this.moveData.BoardFreezes.filter((free:{ItemId:{Unique:number, BoardId:string},Freeze:boolean}) => free.ItemId.Unique != id);
	}
	


	unfreeze(id:number) {
		this.clearFreeze(id)
		this.moveData.BoardFreezes.push(
			{
				ItemId:this.getPetByUnique(id).Id,
				Freeze:false
			}
		)
		console.log(this.moveData.BoardFreezes);
	}

	async start() {
		await buildStart(this.handler, this.authToken, this.moveData)
			.then(data => this.setHash(data.Data.Hash))
	}
}