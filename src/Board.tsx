import { Component, PureComponent} from "./Component";
import { MyReact } from "./MyReact";
import { Square } from "./Square";

export class Board extends PureComponent{
    constructor(props: {[index: string]: any} | undefined, children: Component[]){
        super(props, children)
    }

    renderSquare(i: number): Component{
        return (<Square value={i}/>);
    }

    render() : Component{
        const status = 'Next player: X';
        return (
          <div>
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
