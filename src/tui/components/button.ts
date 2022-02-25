import * as blessed from "blessed"

export default function Button(options: blessed.Widgets.ButtonOptions) {
	return blessed.button(
		Object.assign({
			mouse: true,
			clickable: true,
			align: "center",
			border: "line",
			height: 3,
			bold: "true",
			style: {
				hover: {
					border: {
						fg: "blue"
					}
				}
			}
		}, options));
}