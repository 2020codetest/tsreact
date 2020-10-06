import { PureComponent, RenderComponent} from "./Component";
import { MyReact } from "./MyReact";
import { Square } from "./Square";

interface BoardState{
  col: number;
}
export class Board extends PureComponent<BoardState>{
  constructor(){
    super({})
    this.state = {
      col: 3
    }
  }
    renderSquare(i: number): RenderComponent{
        return (<Square value={i}/>);
    }

    renderRow(i: number){
      let col = this.state.col
      let colList = []
      for (let inx = 0; inx < col; ++inx){
        colList.push(this.renderSquare(i * col + inx))
      }
      return (
        <>
          {colList}
        </>
      )
    }

    componentDidMount() {
      console.log("board component did mount", this.id)
    }

    render() : RenderComponent{
        const status = 'Next player: X';
        return (
          <div onClick={() => {
            console.log("buntton clicked")
          }}>
            <div className="status" onClick={() => {
              this.setState({col: this.state.col == 3 ? 2: 3})
            }}>{status}</div>
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
