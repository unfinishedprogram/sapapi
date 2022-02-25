import * as blessed from "blessed";

export default function verticalList(
	items:blessed.Widgets.TextElement[],
	options:blessed.Widgets.BoxOptions
) {

	let contentHeight = 0;	
	const heights = items.map(item => Number(item.height))
	const tops:number[] = [];

	heights.forEach((height, i) => {
		if(!i) 
			tops.push(0);
		else 
			tops.push(tops[i-1] + heights[i-1]);
	})

	items.forEach(item => contentHeight += Number(item.height));

	items.forEach((item, index) => item.top = tops[index])

	const base:blessed.Widgets.BoxOptions = {
		height: contentHeight + 2,
		border: "line",
		children:items,
	}

	let vList = blessed.box(Object.assign(options, base));

	return vList;
}