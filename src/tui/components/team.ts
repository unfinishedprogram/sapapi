import Match from "../../implementation/match";
import * as blessed from "blessed";
import verticalList from "./verticalList";
import petButton from "../components/petButton";
import BuildMenu from "./buildMenu";
import IItemId from "types/game/itemId";
import IMinion from "types/game/minion";

export default class Team {
	list:blessed.Widgets.BoxElement;
	itemElms:blessed.Widgets.ButtonElement[];

	elm:blessed.Widgets.BoxElement;
	items: (IMinion)[];
	match:Match;

	constructor(private buildMenu:BuildMenu) {
		this.match = buildMenu.match;
		this.elm = blessed.box({
			left:"center",
			top:3,
			width:"shrink", 
		});

		this.list = verticalList([], {});
		this.itemElms = [];
	}

	
	getElmById(id:IItemId) {
		return this.itemElms[
			this.items.indexOf(this.getItemById(id))
		] || null;
	}

	getItemById(id:IItemId) {
		return this.items.filter((item) => item.Id.Unique == id.Unique)[0] || null;
	}

	clearSelect() {
		this.buildMenu.teamSelected = null;
		this.itemElms.forEach(elm => {
			elm.style.border.fg = -1;
		})
	}

	select(pos:number) {
		if(this.buildMenu.shopSelected) {
			this.buildMenu.buy(this.buildMenu.shopSelected, pos);
		}

		if(this.buildMenu.teamSelected == pos) {
			this.clearSelect();
			return;
		}

		this.clearSelect();
		this.itemElms[pos].style.border.fg = 2;
		this.buildMenu.teamSelected = pos;
	}

	update() {
		this.clearSelect();
		this.items = [...this.match.board.minions];
		this.itemElms = [
			...this.match.board.minions.map((pet, i) => {
				return petButton(pet, () => this.select(i))
			})
		];

		this.list.destroy();

		this.list = verticalList(this.itemElms, {
			label:"Team",
			width:"shrink",
			mouse:true,
			clickable:true
		})

		this.elm.append(this.list);
	}
}
