import { Component, ElementWrapper, TextWrapper } from "./Component"

export const MyReact = {
    render: (comp: Component, parent: HTMLElement) => {
        comp.flush(parent)
    },

    createElement: function (component: any, props: {[index: string]: any} | undefined, ...children: any): Component | Component[] {
        let childArr = []
        for (let child of children){
            if (child === null || child === undefined){
                continue
            }

            if (Array.isArray(child)){
                childArr = childArr.concat(child)
                continue
            }

            if (!((child instanceof ElementWrapper) || (child instanceof TextWrapper))){
                child = new TextWrapper(`${child}`)
            }


            childArr.push(child)
        }

        if (typeof component === 'string'){
            if (component === "#fragment"){
                return childArr
            }
            else{
                let ele = new ElementWrapper(component, props, childArr)
                return ele
            }
        }

        let comp = new component(props) as Component
        comp.root.children = childArr
        return comp
    },

    Fragment: "#fragment"
}