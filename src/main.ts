
import { createGraves } from "./graveCollection";

const graveYard = document.querySelector("div#graveyard")

if (!graveYard) throw new Error("Graveyard element not found")
else createGraves(8, graveYard, onGraveClick)

function onGraveClick(_event: MouseEvent, element: HTMLDivElement) {
    const slab = element.querySelector(".grave-slab")
    if (slab?.classList.contains("open")) {
        slab.classList.add("closed")
        slab.classList.remove("open")
    } else {
        slab?.classList.remove("closed")
        slab?.classList.add("open")
    }
}
