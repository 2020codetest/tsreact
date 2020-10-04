import { Component, ElementWrapper, TextWrapper } from "./Component"

export const MyReact = {
    render: (comp: Component, parent: HTMLElement) => {
        let range = document.createRange()
        range.setStart(parent, 0)
        comp.flush(range)
    },

    createElement: function (component: any, props: {[index: string]: any} | undefined, ...children: any): Component {
        let childArr = []
        for (let child of children){
            if (!((child instanceof ElementWrapper) || (child instanceof TextWrapper))){
                child = new TextWrapper(`${child}`)
            }

            childArr.push(child)
        }

        if (typeof component === 'string'){
            let ele = new ElementWrapper(component, props, childArr)
            return ele
        }

        let comp = new component(props, childArr)
        return comp
    }
}