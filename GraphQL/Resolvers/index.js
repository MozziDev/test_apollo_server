import {queries as RegistersQueries} from "../Types/Registers/queries";
import {mutations as RegistersMutations} from "../Types/Registers/mutations";
import { subscriptions as RegistersSubscriptions} from "../Types/Registers/subscriptions";


const resolvers = {
    Query: {
        ...RegistersQueries
    },
    Mutation: {
        ...RegistersMutations
    },
    Subscription: {
        ...RegistersSubscriptions
    }
}

export default resolvers;