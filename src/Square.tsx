import { Component, PureComponent } from "./Component";
import { MyReact } from "./MyReact";

export class Square extends PureComponent{
    constructor(props: {[index: string]: any} | undefined, children: Component[]){
        super(props, children)
        this.state = {
            "click": 0
        }
    }

    render() : Component{
        let className = "square"
        let mod = this.state.click % 3
        if (mod === 1){
            className += " green"
        }
        else if (mod === 2){
            className += " red"
        }

        let _this = this
        return (<div className={className} onClick={function click(){
            _this.setState({click: _this.state.click + 1})
        }}>{this.root.props.value}</div>)
    } 

}