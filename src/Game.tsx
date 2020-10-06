import { Board } from "./Board";
import { PureComponent, RenderComponent } from "./Component";
import { MyReact } from "./MyReact";

interface GameStatus{
  checked: boolean;
}

export class Game extends PureComponent<GameStatus>{
  constructor(){
    super({})
    this.state = {checked: false}
  }

  componentDidMount(): void{
    console.log("Game component did mount", this.id)
  }

  getStatus(): RenderComponent{
    if (this.state.checked){
      return (<ol>Check Status</ol>)
    }
    else{
      return null;
    }
  }

  updateCheck(){
    this.setState({checked: !this.state.checked})
  }

  render() : RenderComponent{
    let status = this.getStatus()
    let _this = this
        return (
          <div className="game">
            <div className="game-board">
              <Board />
            </div>
            <div className="game-info">
              <div onClick={this.updateCheck.bind(this)}>null check</div>
              {status}
            </div>
          </div>
        );
      }
}