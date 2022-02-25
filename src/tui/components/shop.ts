import Match from "../../implementation/match";
import * as blessed from "blessed";
import verticalList from "./verticalList";
import petButton from "../components/petButton";
import foodButton from "../components/foodButton";
import IMinion from "types/game/minion";
import ISpell from "types/game/spell";
import BuildMenu from "./buildMenu";
import IItemId from "types/game/itemId";

export default class Shop {
	list:blessed.Widgets.BoxElement;
	itemElms:blessed.Widgets.ButtonElement[];

	elm:blessed.Widgets.BoxElement;
	items: (IMinion | ISpell)[];
	match:Match;

	constructor(private buildMenu:BuildMenu) {
		this.match = buildMenu.match;
		this.elm = blessed.box({
			left:0,
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
		this.buildMenu.shopSelected = null;
		this.itemElms.forEach(elm => {
			elm.style.border.fg = -1;
		})
	}

	select(id:IItemId) {
		this.buildMenu.team.clearSelect();
		if(this.buildMenu.shopSelected?.Unique == id.Unique){
			this.clearSelect();
			return;
		}

		this.clearSelect();

		if(this.getItemById(id)){
			this.getElmById(id).style.border.fg = 2;
			this.buildMenu.shopSelected = id;
		} else {
			this.match.onError(`Could not select item of id ${id}`);
		}
	}

	update() {
		this.clearSelect();
		this.items = [...this.match.shopPets, ...this.match.shopFood];

		this.itemElms = [
			...this.match.shopPets.map(pet => {
				return petButton(pet, () => this.select(pet.Id))
			}),
			...this.match.shopFood.map(food => {
				return foodButton(food, () => this.select(food.Id))
			})
		]

		this.list.destroy();

		this.list = verticalList(this.itemElms, {
			label:"Shop Pets",
			mouse:true,
			clickable:true,
			width:"shrink"
		})

		this.elm.append(this.list)
	}
}