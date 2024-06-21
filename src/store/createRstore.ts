import { createWithEqualityFn } from 'zustand/traditional';
import initialState from './initialState';
import { ReactFlowState,Relation } from '../types/store';


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

            if(!payload.type){
                const { relations } = get();
                const newRelations = new Map(relations); // Creating a new Map to ensure reference change
                const relation = newRelations.get("3-Iterator-Relation") || { nodeId: "nodeId-2", contentForIter: [] };
                relation.contentForIter = payload;
                newRelations.set("3-Iterator-Relation", relation);
                set({ relations: newRelations });
                console.log("payload typeless");
            }else{
                const { relations } = get();
                const newRelationsTest = new Map(relations); // Creating a new Map to ensure reference change
                const relationTest = newRelationsTest.get(`${payload.id}-${payload.type}-Relation`) || { nodeId: "nodeId-2", contentForIter: [] };
                relationTest.contentForIter = payload;
                newRelationsTest.set(`${payload.id}-${payload.type}-Relation`, relationTest);
                set({ relations: newRelationsTest });
                console.log("payload typed");
            }
            
            
         
            
    
        },

    }),
    Object.is
   );
   
}
export { createRStore };