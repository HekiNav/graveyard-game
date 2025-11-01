
import { createGraves, openGrave, closeGrave } from "./graveCollection";

const graveYard = document.querySelector("div#graveyard")

if (!graveYard) {
    throw new Error("Graveyard element not found")
}

let openGraves: Array<number> = []

const objects = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8"
]

const graves = createGraves(4, graveYard, onGraveClick)
graves.reduce((prev, curr) => {
    const item = prev.splice(Math.floor(Math.random() * prev.length), 1)[0]
    curr.item = item
    return prev
}, objects.slice(0, graves.length / 2).flatMap(o => [{ name: o, target: true }, { name: o, target: false }]))

function onGraveClick(_event: MouseEvent, graveIndex: number) {
    const grave = graves[graveIndex]
    if (grave.elem.querySelector(".grave-slab")?.classList.contains("open")) return
    openGrave(grave)
    openGraves.push(graveIndex)


    if (openGraves.length >= 2) {
        grave.elem.querySelector(".grave-slab")?.addEventListener("animationend", () => {
            console.log(openGraves.map(i => graves[i].item))
            openGraves = []
            graves.map(closeGrave)
        }, {once: true})

    }
}
