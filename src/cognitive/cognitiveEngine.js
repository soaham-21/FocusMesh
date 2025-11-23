import { computeCognitiveTemperature } from "./scoring.js";

export function getCognitiveTemperature(scroll, tabSwitches, negativeWords) {
    return computeCognitiveTemperature(scroll, tabSwitches, negativeWords);
}
