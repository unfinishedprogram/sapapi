import * as blessed  from "blessed"
import ObjectList from "./objectList";

export default class ListItem<T> {
	value:T;
	title:string;
	elm:blessed.Widgets.BoxElement
	constructor(list:ObjectList<T>, item:T, text:string) {
		this.value = item;
		this.title = text;
		this.elm = blessed.box({
			height:3,
			content:text,
		})
		list.addItem(this);
	}
}