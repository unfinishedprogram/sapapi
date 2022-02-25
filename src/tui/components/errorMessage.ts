import * as blessed from "blessed"
import GameDisplay from "../gameDisplay"

export default function errorMessage<T>(window: GameDisplay, text: string) {
	const error = blessed.box({
		width: "shrink",
		height: "shrink",
		left: 0,
		top: 0,
		content: text,
		bg:"red",
		padding:1
	})

	window.screen.append(error)
	window.render();

	setTimeout(() => {
		error.destroy();
	}, 1000)
}