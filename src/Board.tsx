import { PureComponent, RenderComponent} from "./Component";
import { MyReact } from "./MyReact";
import { Square } from "./Square";

export class Board extends PureComponent{
    renderSquare(i: number): RenderComponent{
        return (<Square value={i}/>);
    }

    renderRow(i: number){
      return (
        <>
          {this.renderSquare(i * 3)}
          {this.renderSquare(i * 3 + 1)}
          {this.renderSquare(i * 3 + 2)}
        </>
      )
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
              {this.renderRow(0)}
            </div>
            <div className="board-row">
              {this.renderRow(1)}
            </div>
            <div className="board-row">
              {this.renderRow(2)}
            </div>
          </div>
        );
    }
}
