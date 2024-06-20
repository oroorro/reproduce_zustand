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
        setRelation:(payload:any)=>{
            const {relations} = get();
    

            const relation = relations?.get("3-Iterator-Relation");
        
            if(!relation) {
                const relation:Relation = {
                    nodeId: "nodeId-2",
                    contentForIter: [],
                }
               
                relations?.set(`3-Iterator-Relation`,relation);

                relation!.contentForIter = (payload as string[]);
            }else{
                relation!.contentForIter = (payload as string[]);
            }

            
            console.log("Relation in store", relation , relation?.contentForIter);
    
        },

    }),
    Object.is
   );
   
}
export { createRStore };