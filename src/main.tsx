import { MyReact } from "./MyReact";
import "./main.css"
import { Game } from "./Game";
import * as ReactEvent from "./ReactEvent"

ReactEvent.initEvents()
MyReact.render((<Game />), document.body)