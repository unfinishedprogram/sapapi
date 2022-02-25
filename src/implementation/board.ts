import IBoard from "../types/game/board";
import IMinion from "../types/game/minion";
import ISpell from "../types/game/spell";

export default class Board {

	constructor(private data:IBoard){}

	get id() {
		return this.data.Id;
	}

	get minions():IMinion[] {
		return this.data.Minions.Items;
	}

	get shopMinons():IMinion[] {
		return this.data.MinionShop;
	}

	get shopSpells():ISpell[] {
		return this.data.SpellShop;
	}

	getShopMinion(id:number):IMinion|null {
		for(let minion of this.minions) {
			if(minion.Id.Unique == id) return minion;
		}
		return null;
	}

	getShopSpell(id:number):ISpell|null {
		for(let spell of this.shopSpells) {
			if(spell.Id.Unique == id) return spell;
		}
		return null;
	}

	getTeamMinion(id:number):IMinion|null {
		for(let minion of this.minions) {
			if(minion.Id.Unique == id) return minion;
		}
		return null;
	}
}