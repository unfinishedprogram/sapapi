import * as blessed from "blessed"
import GameDisplay from "../gameDisplay";
import chooseAccountMenu from "../menus/chooseAccountMenu"

interface ILoginCallback {
	(email:string, password:string): void 
}

export default function loginMenu (window:GameDisplay, loginCallback: ILoginCallback ) {
	let menu = blessed.form({
		label: "Login",
		border:"line",
		left: "center",
		top: "center",
		shadow: true,
		height: 11,
		vi:true,
		keyable:true,
		input:true, 
	})
	
	let usernameInput = blessed.textbox({
		name:"username",
		focusable:true, 
		parent: menu, 
		label:"Username/Email",
		border:"line",
		height:3,
		inputOnFocus:true,
		keyable:true,
		mouse:true,
		input:true, 
		style: {
			focus : {
				border: {
					fg:"blue"
				}
			}
		}
	})

	let passwordInput = blessed.textbox({
		name:"password",
		focusable:true, 
		parent: menu, 
		label:"Password",
		height:3,
		inputOnFocus:true,
		top:3,
		keyable:true,
		input:true, 
		mouse:true,
		censor:true, 
		border: {
			type:"line",
			fg:-1,
		},
		style: {
			focus : {
				border: {
					fg:"blue"
				}
			}
		}
	})

	let backButton = blessed.button({
		parent: menu,
		content: "Back",
		bottom:0,
		width:"50%",
		border: "line",
		align: "center",
		height:3,
		style: {
			hover: {
				border: {
					fg:"red"
				}
			}
		}
	})

	let loginButton = blessed.button({
		parent: menu,
		content: "Login",
		mouse: true, 
		clickable: true,
		bottom:0,
		left:"50%",
		border: "line",
		align: "center",
		height:3,
		style: {
			hover: {
				border: {
					fg:"green"
				}
			}
		}
	})

	let blurAll = () => {
		menu.children.forEach(node => {
			node.emit("blur");
		})
	}

	usernameInput.on("click", blurAll)
	passwordInput.on("click", blurAll)

	loginButton.on("click", (data) => {
		menu.submit();
		const sub = menu.submission as {username:string, password:string};
		loginCallback(sub.username, sub.password);
	})

	backButton.on("click", () => {
		menu.cancel();
		window.setMenu(chooseAccountMenu(window))
	})

	menu.focusNext();
	return menu;
}
