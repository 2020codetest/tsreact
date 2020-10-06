import * as ReactEvent from "./ReactEvent"

export interface VNode{
    type: string;
    content?: string;
    props?: {[index: string]: any};
    children: Component[];
}

export type RenderComponent = Component | null | undefined

export interface Component  {
    render() : RenderComponent;
    flush(parentNode: Node) : Node;
    id: number;
    children: Component[];
    root: VNode;
    node: Node;
}

var componentId: number = 0;
function getNextComponentId(): number{
    return ++componentId
}

export class TextWrapper implements Component{
    root: VNode;
    node: Node;
    parentNode: Node;
    rendered: boolean = false
    id: number = 0
    children: [];
    constructor(content: string){
        this.root = {
            type: "#text",
            content: content,
            children: []
        }

        this.id = getNextComponentId()
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

    render(): RenderComponent {
        return this
    }
}

export class ElementWrapper implements Component {
    root: VNode;
    node: Node;
    parentNode: Node;
    rendered: boolean = false;
    id: number = 0
    children: []

    componentWillUnmount?(): void;
    componentDidUpdate?(): void;
    componentDidMount?(): void;

    constructor(type: string, props: any, children: Component[]){
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

        this.id = getNextComponentId()
    }

    flush(parentNode: Node): Node {
        this.parentNode = parentNode
        if (this.root.type === "#custom"){
            let ele = this.render()
            if (ele == null){
                if (this.node){
                    this.parentNode.removeChild(this.node)
                }

                return;
            }

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
                        ReactEvent.registerEvent(event, {node: node, callback: this.root.props[key], id: this.id})
                        continue;
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


        if (this.rendered){
            if (this.componentDidUpdate){
                this.componentDidUpdate()
            }
        }
        else{
            if (this.componentDidMount){
                this.componentDidMount()
            }
        }

        this.rendered = true
        return this.node
    }

    render(): RenderComponent {
        return this
    }
}

export abstract class PureComponent<State = {}, Props = {}> extends ElementWrapper{
    constructor(props: Props){
        super("#custom", props, [])
        this.props = props
        this.state = Object.create({})
    }

    props: Props;
    state: State;

    setState(partial: any){
        Object.assign(this.state, partial)
        this.update()
    }

    update() {
        this.flush(this.parentNode)
    }
}
