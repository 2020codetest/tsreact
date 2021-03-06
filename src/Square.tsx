import { PureComponent, RenderComponent } from "./Component";
import { MyReact } from "./MyReact";

interface SquareState{
    click: number;
}

interface SquareProps{
    value: number;
}

export class Square extends PureComponent<SquareState, SquareProps>{
    constructor(props: SquareProps){
        super(props)
        this.state = {
            click: 0
        }
    }

    render() : RenderComponent{
        let className = "square"
        let mod = this.state.click % 3
        if (mod === 1){
            className += " green"
        }
        else if (mod === 2){
            className += " red"
        }

        return (<div className={className} onClick={() => {
            this.setState({click: this.state.click + 1})
            this.setState({click: this.state.click + 2})
        }}>{this.root.props.value}</div>)
    };

    componentWillUnmount(): void{
        console.log("square will unmount", this.id)
    }

    componentDidMount(): void{
        console.log("square did mount", this.id)
    }
}