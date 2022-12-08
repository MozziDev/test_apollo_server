import {Data} from "../../../Data";
import {events} from "./events";

export const mutations = {
    addRegister: async (_, {dataRegister}, {pubSub}) => {
        Data.push(dataRegister);

        await pubSub.publish(events.CHANGE_REGISTERS, {
            addRegister: Data
        });

        return dataRegister;
    },
    updateRegister: (_, {dataRegister}) => {
        
        let modifiedIndex;
        Data.map((item, index)=>{
            if (item.id === dataRegister.id){
                item = {
                    ...dataRegister
                }
            }
            modifiedIndex = index
            return item
        });
        return Data[modifiedIndex]
        },
    deleteRegister: (_, {id}) => {
        let deletedIndex;
        Data.forEach((item, index)=>{
            if (item.id === id){
                deletedIndex = index
            }
        });
        Data.splice(deletedIndex,1);
        return "Deleted item with id: "+ id;
        },
}