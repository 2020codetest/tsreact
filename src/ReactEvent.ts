var eventTable: {[index: string]: EventTarget[]} = {}

export interface EventTarget{
    node: Node;
    callback: (event: Event) => void;
}

export function initEvents(){
    eventTable["click"] = []
    window.addEventListener("click", (evt: any) => {
        let targetQueue = [evt.target]
        let callbacks = eventTable["click"]
        let target = evt.target
        while(target.parentNode && target.parentNode !== document.body){
            targetQueue.push(target.parentNode)
            target = target.parentNode
        }

        for (let target of targetQueue){
            for (let callback of callbacks){
                if (callback.node === target){
                    callback.callback.call(undefined, evt)
                    break
                }
            }
        }
    })
}

export function registerEvent(event: string, target: EventTarget){
    if (event in eventTable){
        eventTable[event].push(target)
    }
}