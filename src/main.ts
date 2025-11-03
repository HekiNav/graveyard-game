
import { createGraves, openGrave, closeGrave, updateGrave } from "./graveCollection";

const graveYard = document.querySelector("div#graveyard") as HTMLDivElement

if (!graveYard) {
    throw new Error("Graveyard element not found")
}

let openGraves: Array<number> = []

const objects = [
    "atom.svg",
    "flash.svg",
    "algol.png",
    "hypercard.png",
    "objectivec.svg",
    "angularjs.png",
    "silverlight.png",
    "windows-mobile.webp",
    "1",
    "2",
    "3",
]

const backgroundAudio = new Audio("./background.mp3")
document.addEventListener("click", () => {
    backgroundAudio.loop = true
    backgroundAudio.play()

})

let graves = createGraves(6, 4, graveYard, onGraveClick)


graves.reduce((prev, curr) => {
    const item = prev.splice(Math.floor(Math.random() * prev.length), 1)[0]
    curr.item = item
    return prev
}, [...shuffle(objects).slice(0, graves.length / 2 - 1), "evil"].flatMap(o => [{ name: o, target: true }, { name: o, target: false }]))

graves.forEach(g => updateGrave(g))

function onGraveClick(_event: MouseEvent, graveIndex: number) {
    const grave = graves[graveIndex]
    if (!grave.item) return
    if (grave.elem.querySelector(".grave-slab")?.classList.contains("open")) return
    if (openGraves.length >= 2) return

    openGrave(grave)
    openGraves.push(graveIndex)

    if (grave.item.name == "evil") {
        const newItems = shuffle(graves.filter(g => g.item).map(g => g.item))
        graves.filter(g => g.item).forEach((g, i) => {
            g.item = newItems[i]
        })
        const jumpscareAudio = new Audio("./jumpscare.wav")
        jumpscareAudio.addEventListener("loadeddata", () => {
            console.log("loaded audio")
        })

        grave.elem.addEventListener("animationend", () => {
            document.getElementById("jumpscare")?.classList.remove("hidden")

            jumpscareAudio.addEventListener("ended", () => {
                openGraves = []
                graves.map(closeGrave)
                document.getElementById("jumpscare")?.classList.add("hidden")

                grave.elem.addEventListener("animationend", () => {
                    graves.map(updateGrave)
                }, { once: true })
            })
            jumpscareAudio.play()

        }, { once: true })



        return
    }

    if (openGraves.length >= 2) {
        grave.elem.querySelector(".grave-slab")?.addEventListener("animationend", () => {
            const open = openGraves.map(i => graves[i])
            if (open[0].item?.name == open[1].item?.name) {
                console.log("MATCH")

                const moving = open.find(g => g.item?.target == false)
                const target = open.find(g => g.item?.target == true)

                if (!moving || !target) return

                const rects = [target?.elem.querySelector(".grave-hole")?.getBoundingClientRect(), moving?.elem.querySelector(".grave-hole")?.getBoundingClientRect()]

                const xyOffset = { x: (rects[0]?.x || 0) - (rects[1]?.x || 0), y: (rects[0]?.y || 0) - (rects[1]?.y || 0) }

                const animatedDiv = document.createElement("div")
                const img = document.createElement("img")
                img.src = "./objects/" + open[0].item?.name
                img.alt = open[0].item?.name || "none"
                img.style.width = ((rects[0]?.width || 0) * 0.9 + "px") || "0"

                animatedDiv.append(img)

                animatedDiv.classList.add("animated-container")
                animatedDiv.style.top = rects[1]?.top + "px"
                animatedDiv.style.left = rects[1]?.left + "px"
                animatedDiv.style.height = rects[1]?.height + "px"
                animatedDiv.style.width = rects[1]?.width + "px"

                document.body.append(animatedDiv)
                moving.elem.classList.add("empty")

                animatedDiv.addEventListener("transitionend", () => {
                    animatedDiv.remove()
                    target.elem.classList.add("complete")
                    graves.map(closeGrave)
                    openGraves = []
                    target.elem.addEventListener("animationend", () => {
                        target.elem.classList.add("hidden")
                        moving.elem.classList.add("hidden")
                        target.item = undefined
                        moving.item = undefined
                        checkWin()
                    })
                }, { once: true })

                setTimeout(() => {
                    animatedDiv.style.transform = `translate(${xyOffset.x}px, ${xyOffset.y}px)`
                }, 100)

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
function checkWin() {
    if (!graves.every(g => !g.item)) return
    console.log("YOU WIN")
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
