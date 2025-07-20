import { cards } from "./cards";

function deal() {
    const index = Math.floor(Math.random() * cards.length);

    return cards.splice(index, 1)[0];
}

export default deal;