var eventTable: {[index: string]: EventTarget[]} = {}

export interface EventTarget{
    id: number;
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

export function unregisterEvent(id: number){
    for (let event in eventTable){
        let callbacks = eventTable[event]
        let inx = 0
        for (let callback of callbacks){
            if (callback.id === id){
                callbacks.splice(inx, 1)
                break
            }

            ++inx
        }
    }
}

export function registerEvent(event: string, target: EventTarget){
    if (event in eventTable){
        eventTable[event].push(target)
    }
}