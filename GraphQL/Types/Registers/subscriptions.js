import {events} from "./events";
import {pubSub} from "../../../src/init/pubSub";

export const subscriptions = {
    addRegister: {
        subscribe: () => pubSub.asyncIterator([events.CHANGE_REGISTERS])
    },
}