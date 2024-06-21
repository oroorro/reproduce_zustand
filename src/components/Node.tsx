
import { useStore, useStoreApi } from "../store/useStore"
import { useState, useRef, useEffect } from "react"
import { ReactFlowState } from "../types/store"
import { shallow } from 'zustand/shallow';

type NodeProps = {
    id: string;
    data: any;
    type?: string;
}

type ArrayElement = {
    behavior: string,
    value: string
}

type ArrayListManager = {
    currentTimeFrameIndex: number,
    TimeFrameMap: Map<string, ArrayElement>,
    TimeFrameArray: string[][],
}

type IteratorManager = {
    relationCount: number,
    managingRelations: string[],
}

const NodeWrapper = ({ 
    id,
    data,
    type
  }:NodeProps) =>{
    
    console.log(`<Node ${id}-${type}> rendered`);
    const store = useStoreApi();
    
    if ( type === 'ArrayListNode') {
        const {setRelation} = store.getState();
      
        
       const initArrayListManager = {
        currentTimeFrameIndex: -1,
        TimeFrameMap: new Map<string, ArrayElement>(),
        TimeFrameArray: []
       } 

       const [ArrayListManager, setArrayListManager] = useState<ArrayListManager>(initArrayListManager);


       const contentRef = useRef<HTMLDivElement>(null);
         
        useEffect(()=>{

          console.log("ArrayListManager updated in useEffect", ArrayListManager)
          if(ArrayListManager?.currentTimeFrameIndex === 0){
            const payload = {
                id: id,
                type: type,
                data: ArrayListManager.TimeFrameArray[0]
            }
            setRelation(payload);
          }else if(ArrayListManager?.currentTimeFrameIndex > 0){
            //const input = contentRef.current?.innerHTML.split(" ") || [];

            const payload = {
                id: id,
                type: type,
                data: ArrayListManager.TimeFrameArray
            }


            setRelation(payload);
          }

        },[ArrayListManager?.currentTimeFrameIndex])
 


        const onSubmitHandler = () =>{


            const {setRelation} = store.getState();
            const input = contentRef.current?.innerHTML.split(" ") || [];

            setArrayListManager(prev => {
                const newIndex = prev.currentTimeFrameIndex + 1;
                const newArray = [...prev.TimeFrameArray];
                if (newIndex < newArray.length) {
                    newArray[newIndex] = input;
                } else {
                    newArray.push(input);
                }
                return {
                    ...prev,
                    currentTimeFrameIndex: newIndex,
                    TimeFrameArray: newArray
                };
            });

           setRelation(input);


        }


        ArrayListManager.TimeFrameArray.map((ele)=>{
            return(
                <span>
                    
                </span>
            )
        })

        return(
            <div className={`node_${id} ArrayListNode Node`}>
                <div contentEditable ref={contentRef}>

                </div>
                
                <button onClick={onSubmitHandler}>submit</button>
            </div>
        )

    }
    else if(type === 'IteratorNode'){


        //relationCount 
        

        const initIteratorManager:IteratorManager  = {
            relationCount: 0,
            managingRelations: []
        }

        const [iteratorManager, setIteratorManager] = useState<IteratorManager>(initIteratorManager);



        // const selector = (s: ReactFlowState) => {
        //     console.log('Current relations:', s.relations);
        //     const relation = s.relations?.get("3-Iterator-Relation");
        //     return { Relation: relation ? relation.contentForIter.length : 0 };
        // };

        // const {Relation} = useStore(selector, shallow);


        const selectorTest = (s: ReactFlowState) => {
           
            const relationTest = s.relations?.get("3-ArrayListNode-Relation");
            return { Relation: relationTest ? relationTest.contentForIter.length : 0 };
        };

        //const {Relation} = useStore(selectorTest, shallow);

        const selector = (s: ReactFlowState) => {
            console.log(`<ItertorNode id:${id}>  Current relations is`, s.relations);
            return { relationsCount: s.relations?.size || 0 };
        };


        const {relationsCount} = useStore(selector, shallow);
       

        useEffect(()=>{

            console.log(`<Iterator ${id}> listening to number of relations`, relationsCount);
            if(relationsCount != iteratorManager.relationCount){

                const newlyAddedId = store.getState().newlyAddedId;

                const newlyAddedRelation = store.getState().relations?.get(newlyAddedId as string);

                

                setIteratorManager(prev=>({
                    ...prev,
                    managingRelations: prev.managingRelations.push(newlyAddedId as string),
                    relationCount: prev.relationCount++,
                }))
            }

        },[relationsCount])

        const lengthEqualityFn = (prevLength: number, nextLength: number) => {
            console.log("Relation", prevLength, nextLength)
            return prevLength === nextLength;
        }
    
        const contentForIterLength = useStore(
            (state) => (state.relations?.get("3-Iterator-Relation")?.contentForIter.length as number),
            
        );


        useEffect(()=>{

            console.log(`<Iterator ${id}> Listening to 3-Iterator-Relation Length :`, contentForIterLength);
        },[contentForIterLength])


        return(
            <div className={`node_${id} IteratorNode Node`}>
                <div>
                    <button>-</button>
                    <button>=</button>
                    <button>+</button>
                </div>
            </div>
        )
    }
    else{

       const {setRelation} = store.getState();


        const contentForIterTest = useStore(
            (state) => (state.relations?.get(id)),
            
        );

        useEffect(()=>{

            console.log(`<Default ${id}> using Selector `, contentForIterTest);
        },[contentForIterTest])

        return(
            <div className={`node_${id} defaultNode Node`}>
                {id}
                <button></button>
            </div>
        )
    }

}

export default NodeWrapper;