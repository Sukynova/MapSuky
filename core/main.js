import {
  initMovementLock
} from "../ui/movementLock.js";

import { loadMap } from "./renderer.js";

console.log("Main cargado");

await loadMap();

initMovementLock();