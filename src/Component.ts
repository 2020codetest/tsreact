import { MyReact } from "./MyReact";
import * as ReactEvent from "./ReactEvent"

export interface VNode{
    type: string;
    content?: string;
    props?: {[index: string]: any};
    children: Component[];
}

export interface Component {
    render() : Component;
    flush(parentNode: Node) : Node;
    update(): void;
}

export class TextWrapper implements Component{
    root: VNode;
    node: Node;
    parentNode: Node;
    constructor(content: string){
        this.root = {
            type: "#text",
            content: content,
            children: []
        }
    }

    flush(parentNode: Node) :Node{
        let text = document.createTextNode(this.root.content)
        if (this.node){
            parentNode.replaceChild(text, this.node)
        }
        else{
            parentNode.appendChild(text)
        }

        this.parentNode = parentNode;
        this.node = text
        return text
    }

    update(): void{
        this.flush(this.parentNode)
    }

    render(): Component {
        return this
    }
}

export class ElementWrapper implements Component {
    root: VNode;
    node: Node;
    parentNode: Node;
    state: {[index: string]: any};
    constructor(type: string, props: {[index: string]: string} | undefined, children: Component[]){
        this.root = {
            type: type,
            props: props,
            children: []
        }

        for (let child of children){
            if (!((child instanceof ElementWrapper) || (child instanceof TextWrapper))){
                child = new TextWrapper(`${child}`)
            }

            this.root.children.push(child)
        }
    }

    update(): void {
        this.flush(this.parentNode)
    }

    setState(state: {[index: string]: any}): void {
        if (!this.state){
            this.state = state
        }
        else{
            for (let key in state){
                this.state[key] = state[key]
            }
        }

        this.update()
    }

    flush(parentNode: Node): Node {
        this.parentNode = parentNode
        if (this.root.type === "#custom"){
            let ele = this.render()
            let node = ele.flush(parentNode)
            if (this.node){
                this.parentNode.replaceChild(node, this.node)
            }
            else{
                this.parentNode.appendChild(node)
            }

            this.node = node
        }
        else{
            let node = document.createElement(this.root.type)
            if (this.root.props){
                for (let key in this.root.props){
                    let value = this.root.props[key]
                    if ('classname' == key.toLowerCase()){
                        key = 'class'
                    }
                    else if (key.match(/^on([\s\S]+)/)){
                        let event = key.substr(2).toLowerCase()
                        ReactEvent.registerEvent(event, {node: node, callback: this.root.props[key]})
                    }

                    node.setAttribute(key, value)
                }
            }

            if (this.root.children && this.root.children.length){
                let i = 0
                for (let child of this.root.children){
                    child.flush(node)
                    ++i
                }
            }

            if (this.node){
                this.parentNode.replaceChild(node, this.node)
            }
            else{
                this.parentNode.appendChild(node)
            }

            this.node = node
        }

        return this.node
    }

    render(): Component {
        return this
    }
}

export class PureComponent extends ElementWrapper{
    constructor(props: {[index: string]: any} | undefined, children: Component[]){
        super("#custom", props, children)
    } 
}
