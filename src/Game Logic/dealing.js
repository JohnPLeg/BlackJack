import { cards } from "./cards";

function deal(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    let index = Math.floor(Math.random() * (max - min + 1)) + min;

    return cards[index];
}

export default deal;