import * as blessed from "blessed"
import GameDisplay from "../gameDisplay"

export default async function loadingScreen<T>(window: GameDisplay, text: string, promise: Promise<T>) {
	const loading = blessed.box({
		width: "shrink",
		height: "shrink",
		left: "center",
		top: "center",
		border: "line",
		content: text
	})

	window.screen.append(loading)

	await promise;
	loading.destroy();
	window.render();
}