const base = import.meta.env.BASE_URL || ""
export interface Grave {
    elem: Element,
    item?: Item
}
export interface Item {
    name: string,
    target: boolean
}
interface Elem {
    elem: Element,
    type: string
}
export function closeGrave(grave: Grave) {
    const slab = grave.elem.querySelector(".grave-slab")
    if (slab?.classList.contains("open")) slab?.classList.add("closed")
    slab?.classList.remove("open")
}
export function openGrave(grave: Grave) {
    const slab = grave.elem.querySelector(".grave-slab")
    slab?.classList.remove("closed")
    slab?.classList.add("open")

}
export function updateGrave(grave: Grave) {
    const item = grave.item!
    const hole = grave.elem.querySelector(".grave-hole") as HTMLDivElement
    if (item.name == "evil") {
        hole.style.border = "1px solid red"
        hole.style.setProperty("--content", `url(${base}/objects/chatgpt.png)`)
        return
    }
    console.log(hole, item)
    hole.style.border = "none"

    hole.setAttribute("data-target", item.target ? "yes" : "no")
    hole.style.setProperty("--content", `url(${base}/objects/${item.name})`)
}


export function createGraves(width: number, height: number, graveYard: HTMLDivElement, onGraveClick: Function): Array<Grave> {
    const graves = new Array<Grave>()
    for (let i = 0; i < height * 1.5; i++) {
        for (let j = 0; j < width; j++) {

            const flipped = i % 3 == 2

            const elem = i % 3 == 1 ? j == 0 ? pathElement(graveYard) : null : graveElement(graveYard, flipped, onGraveClick, (i - Math.floor((i + 1) / 3)) * width + j)
            if (elem && elem.type == "grave") graves.push({
                elem: elem.elem
            })
        }
    }
    graveYard.style.setProperty("--size", width.toString())

    return graves
}
function graveElement(container: Element, flipped: boolean, onclick: Function, grave: number): Elem {
    const graveTemplate = document.querySelector("#grave-template")
    if (!graveTemplate) throw new Error("Grave Tempate not found")

    let el = document.createElement("div")
    el.innerHTML = graveTemplate.innerHTML
    el.classList.add("grave")

    el.addEventListener("click", e => onclick(e, grave))

    el.style.setProperty("--random", Math.floor(Math.random() * 100).toString())

    if (flipped) el.classList.add("flipped")

    container.append(el)

    return { elem: el, type: "grave" }
}

function pathElement(container: Element): Elem {

    let el = document.createElement("div")
    el.classList.add("path")

    container.append(el)

    return { elem: el, type: "path" }
}