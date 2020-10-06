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
    root: VNode;
    node: Node;
    unmounted: boolean;
    renderedComp?: Component;
    hasEvent: boolean;
    componentWillUnmount?(): void;
    componentDidUpdate?(): void;
    componentDidMount?(): void;
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
    unmounted: boolean = false
    id: number = 0
    hasEvent: boolean = false;
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
    unmounted: boolean = false
    hasEvent: boolean = false
    children: []
    renderedComp?: Component;
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

    cleanUpResources(root: VNode): void{
        if (root.children && root.children.length){
            for (let child of root.children){
                if (child.renderedComp){
                    if (child.componentWillUnmount){
                        child.componentWillUnmount()
                    }

                    ReactEvent.unregisterEvent(child.renderedComp.id)
                    this.cleanUpResources(child.renderedComp.root)
                }
                else{
                    ReactEvent.unregisterEvent(child.id)
                    this.cleanUpResources(child.root)
                }
            }
        }
    }

    flush(parentNode: Node): Node {
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
        this.parentNode = parentNode
        if (this.root.type === "#custom"){
            if (this.renderedComp){
                this.cleanUpResources(this.renderedComp.root)
            }

            // here you could perform the diff algorithm
            this.renderedComp = this.render()
            if (this.renderedComp == null){
                if (this.node){
                    this.parentNode.removeChild(this.node)
                }

                return;
            }

            let node = this.renderedComp.flush(parentNode)
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
                        this.hasEvent = true
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
    stateQueue: any[] = []
    promisedIssue: boolean = false

    setState(partial: any){
        this.stateQueue.push(partial)
        if (!this.promisedIssue){
            this.promisedIssue = true
            Promise.resolve().then(() => {
                for (let state of this.stateQueue){
                    Object.assign(this.state, state)
                }

                this.update()
                this.promisedIssue = false
            })
        }
    }

    update() {
        this.flush(this.parentNode)
    }
}
