import { Board } from "./Board";
import { Component, PureComponent } from "./Component";
import { MyReact } from "./MyReact";

export class Game extends PureComponent{
    constructor(props: {[index: string]: any} | undefined, children: Component[]){
        super(props, children)
    }

    render() : Component{
        return (
          <div className="game">
            <div className="game-board">
              <Board />
            </div>
            <div className="game-info">
              <div>{/* status */}</div>
              <ol>{/* TODO */}</ol>
            </div>
          </div>
        );
      }
}