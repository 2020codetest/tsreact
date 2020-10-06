import { PureComponent, RenderComponent} from "./Component";
import { MyReact } from "./MyReact";
import { Square } from "./Square";

export class Board extends PureComponent{
    renderSquare(i: number): RenderComponent{
        return (<Square value={i}/>);
    }

    componentDidMount() {
      console.log("board component did mount", this.id)
    }

    render() : RenderComponent{
        const status = 'Next player: X';
        return (
          <div onClick={function click() {
            console.log("buntton clicked")
          }}>
            <div className="status">{status}</div>
            <div className="board-row">
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
            </div>
            <div className="board-row">
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
            </div>
            <div className="board-row">
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
            </div>
          </div>
        );
    }
}
