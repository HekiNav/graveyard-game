
import { createGraves, openGrave, closeGrave, updateGrave } from "./graveCollection";

const graveYard = document.querySelector("div#graveyard") as HTMLDivElement

if (!graveYard) {
    throw new Error("Graveyard element not found")
}

let openGraves: Array<number> = []

const objects = [
    "url(/objects/atom.svg)",
    "url(/objects/flash.svg)",
    "url(/objects/algol.png)",
    "url(/objects/hypercard.png)",
    "url(/objects/objectivec.svg)",
    "url(/objects/angularjs.png)"
]

const graves = createGraves(4, graveYard, onGraveClick)
graves.reduce((prev, curr) => {
    const item = prev.splice(Math.floor(Math.random() * prev.length), 1)[0]
    curr.item = item
    return prev
}, shuffle(objects).slice(0, graves.length / 2).flatMap(o => [{ name: o, target: true }, { name: o, target: false }]))

graves.forEach(g => updateGrave(g))

function onGraveClick(_event: MouseEvent, graveIndex: number) {
    const grave = graves[graveIndex]
    if (grave.elem.querySelector(".grave-slab")?.classList.contains("open")) return
    if (openGraves.length >= 2) return
    openGrave(grave)
    openGraves.push(graveIndex)


    if (openGraves.length >= 2) {
        grave.elem.querySelector(".grave-slab")?.addEventListener("animationend", () => {
            const open = openGraves.map(i => graves[i])
            if (open[0].item?.name == open[1].item?.name) {
                console.log("MATCH")

                const moving = open.find(g => g.item?.target == false)
                const target = open.find(g => g.item?.target == true)

                const rects = [target?.elem.getBoundingClientRect(), moving?.elem.getBoundingClientRect()]

                const xyOffset = { x: (rects[0]?.x || 0) - (rects[1]?.x || 0), y: (rects[0]?.y || 0) - (rects[1]?.y || 0) }

                

                //graves.map(closeGrave)
                openGraves = []
            } else {
                setTimeout(() => {
                    console.log(openGraves.map(i => graves[i].item))
                    openGraves = []
                    graves.map(closeGrave)
                }, 500)
            }


        }, { once: true })

    }
}

function shuffle(arr: Array<any>) {
    var i = arr.length;
    while (--i) {
        var j = Math.floor(Math.random() * (i + 1))
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    return arr;
};
