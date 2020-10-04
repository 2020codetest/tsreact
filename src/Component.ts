export interface VNode{
    type: string;
    content?: string;
    props?: {[index: string]: string};
    children: Component[];
}

export interface Component {
    render() : Component;
    flush(range: Range) : void;
}

export class TextWrapper implements Component{
    root: VNode;
    constructor(content: string){
        this.root = {
            type: "#text",
            content: content,
            children: []
        }
    }

    flush(range: Range): void {
        let text = document.createTextNode(this.root.content)
        range.insertNode(text)
    }

    render(): Component {
        return this
    }
}

export class ElementWrapper implements Component {
    root: VNode;
    childRange: Range;
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

    flush(range: Range): void {
        if (this.root.type === "#custom"){
            let ele = this.render()
            ele.flush(range)
        }
        else{
            let node = document.createElement(this.root.type)
            if (this.root.props){
                for (let key in this.root.props){
                    let value = this.root.props[key]
                    if ('classname' == key.toLowerCase()){
                        key = 'class'
                    }

                    node.setAttribute(key, value)
                }
            }
            range.insertNode(node)
            if (this.root.children && this.root.children.length){
                this.childRange = document.createRange()
                let i = 0
                for (let child of this.root.children){
                    this.childRange.setStart(node, i)
                    child.flush(this.childRange)
                    ++i
                }
            }
        }
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
