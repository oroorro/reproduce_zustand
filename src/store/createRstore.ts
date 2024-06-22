import { createWithEqualityFn } from 'zustand/traditional';
import initialState from './initialState';
import { ReactFlowState,Relation } from '../types/store';
type IteratorTimeFrame = {
    nodeId: string,
    nodeTimeFrameIndex: number
}


const createRStore = () => {
   return createWithEqualityFn<ReactFlowState>(
    (set, get) => ({
        ...initialState,
        getRelations:()=>{
            const {relations} = get();
            return relations!;
        },
        getRelationElement:(nodeId: string)=>{
    
            const {relations} = get();
    
            return (relations?.get(nodeId)! as Relation);
    
        },
        createRelation:(payload:any)=>{
            const { relations } = get();
            relations?.set(`${payload.id}-${payload.type}-Relation`,payload.data);
        },
        setRelation:(payload:any)=>{
            //const {relations} = get();
    

            // const relation = relations?.get("3-Iterator-Relation");
        
            // if(!relation) {
            //     const relation:Relation = {
            //         nodeId: "nodeId-2",
            //         contentForIter: [],
            //     }
               
            //     relations?.set(`3-Iterator-Relation`,relation);
            //     //relations?.set(`5`,relation);

            //     relation!.contentForIter = (payload as string[]);
            //     console.log("Relation in store", relations , relation?.contentForIter);
            // }else{
            //     relation!.contentForIter = (payload as string[]);
            //     console.log("Relation in store", relations , relation?.contentForIter);
            // }

            console.log("store", `${payload.id}-${payload.type}-Relation`);

            const { relations } = get();
            const ret = relations?.get(`${payload.id}-${payload.type}-Relation`)
            if(!ret && payload.type) set({newlyAddedId: payload.id})


            // if(!payload.type){
            //     const { relations } = get();
            //     const newRelations = new Map(relations); // Creating a new Map to ensure reference change
            //     const relation = newRelations.get("3-Iterator-Relation") || { nodeId: "nodeId-2", contentForIter: [] };
            //     relation.contentForIter = payload;
            //     newRelations.set("3-Iterator-Relation", relation);
            //     set({ relations: newRelations });
            //     console.log("payload typeless");
            // }else{
            //     const { relations } = get();
            //     const newRelationsTest = new Map(relations); // Creating a new Map to ensure reference change
            //     const relationTest = newRelationsTest.get(`${payload.id}-${payload.type}-Relation`) || { nodeId: "nodeId-2", contentForIter: [] };
            //     relationTest.contentForIter = payload.data;
            //     newRelationsTest.set(`${payload.id}-${payload.type}-Relation`, relationTest);
            //     set({ relations: newRelationsTest });
            //     console.log("payload typed");
            // }

            if(payload.type){
            
                const { relations } = get();
                const newRelationsTest = new Map(relations); // Creating a new Map to ensure reference change
                const relationTest = newRelationsTest.get(`${payload.id}-${payload.type}-Relation`) || { nodeId: "nodeId-2", contentForIter: [], timeFrameId: 0 };
                relationTest.contentForIter = payload.data;
                relationTest.timeFrameId = payload.timeFrameId;
                newRelationsTest.set(`${payload.id}-${payload.type}-Relation`, relationTest);
                set({ relations: newRelationsTest });
                console.log("payload typed");
         
            }
    
        },
        setUpdate: (frame: IteratorTimeFrame[]) => {
            const update = new Map(get().update); // Clone the current Map
            frame.forEach((item) => {
                update.set(item.nodeId, item.nodeTimeFrameIndex);
            });
            set({ update });
        },

    }),
    Object.is
   );
   
}
export { createRStore };