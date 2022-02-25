import blessed from "blessed";
import ListItem from "./listItem";

export default class ObjectList<T>{
	items:T[];
	elm:blessed.Widgets.ListElement;
	_selected : T;

	get selected() {
		return this._selected;
	}

	select(item:T) {
		this._selected = item;
	}

	constructor() {
		this.items = [];
	}

	addItem(item: ListItem<T>) {
		this.items.push(item.value);
		this.elm.add(item.title)
	}
	getItem(index:number) {
		return this.items[index];
	}
	removeItem(index:number) {
		this.items.splice(index);
		// this.elm.remove(this.elm)
	}
}