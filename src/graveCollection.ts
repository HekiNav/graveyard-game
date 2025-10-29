
export interface Grave {
    elem: Element
}

const graves = new Array<Grave>()

export function createGraves(width: number, graveYard: HTMLDivElement): void {
    // height is half of width
    for (let i = 0; i < width * 2 / 3; i++) {
        for (let j = 0; j < width; j++) {

            const flipped = i % 3 == 2

            const elem = i % 3 == 1 ? j == 0 ? pathElement(graveYard) : null : graveElement(graveYard, flipped)
            console.log(i, j, elem)
            if (elem) graves.push({
                elem: elem
            })
        }
    }
    graveYard.style.setProperty("--size", width.toString())

}
function graveElement(container: Element, flipped: boolean): Element {
    const graveTemplate = document.querySelector("#grave-template")
    if (!graveTemplate) throw new Error("Grave Tempate not found")

    let el = document.createElement("div")
    el.innerHTML = graveTemplate.innerHTML
    el.classList.add("grave")
    if (flipped) el.classList.add("flipped")

    container.append(el)

    return el
}
function pathElement(container: Element): Element {

    let el = document.createElement("div")
    el.classList.add("path")

    container.append(el)

    return el
}