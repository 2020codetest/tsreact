import { Component, PureComponent } from "./Component";
import { MyReact } from "./MyReact";

export class Square extends PureComponent{
    constructor(props: {[index: string]: any} | undefined, children: Component[]){
        super(props, children)
    }

    render() : Component{
       return (<div className="square">{this.root.props.value}</div>)
    } 

}