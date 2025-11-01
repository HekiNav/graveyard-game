
import { createGraves, openGrave, closeGrave } from "./graveCollection";

const graveYard = document.querySelector("div#graveyard")

if (!graveYard) {
    throw new Error("Graveyard element not found")
} 

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

function onGraveClick(_event: MouseEvent, graveIndex: number) {
    openGrave(graves[graveIndex])
    console.log(graveIndex)
}
