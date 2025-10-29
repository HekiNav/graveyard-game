
import { createGraves } from "./graveCollection";

const graveYard = document.querySelector("div#graveyard")

if (!graveYard) throw new Error("Graveyard element not found")
else createGraves(8, graveYard)
