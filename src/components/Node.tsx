
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

const NodeWrapper = (
  { id,
   data,
   type
  }
:NodeProps) =>{
    
    console.log(`Node ${id}-${type}`);
    
    if ( type === 'ArrayListNode') {

       const store = useStoreApi();
        
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

          }else if(ArrayListManager?.currentTimeFrameIndex > 0){

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

        const selector = (s: ReactFlowState) => {
            console.log('Current relations:', s.relations);
            const relation = s.relations?.get("3-Iterator-Relation");
            return { Relation: relation ? relation.contentForIter.length : 0 };
        };

        const {Relation} = useStore(selector, shallow);

        useEffect(()=>{

            console.log("Relation in Iterator", id, "  ", Relation);
    
        },[Relation])

        const lengthEqualityFn = (prevLength: number, nextLength: number) => {
            console.log("Relation", prevLength, nextLength)
            return prevLength === nextLength;
        }
    
        const contentForIterLength = useStore(
            (state) => (state.relations?.get("3-Iterator-Relation")?.contentForIter.length as number),
            
        );


        useEffect(()=>{

            console.log("Relation in Iterator Length using Selector", id, "  ", contentForIterLength);
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

        const contentForIterTest = useStore(
            (state) => (state.relations?.get(id)),
            
        );

        useEffect(()=>{

            console.log("Relation in Default using Selector", id, "  ", contentForIterTest);
        },[contentForIterTest])

        return(
            <div className={`node_${id} defaultNode Node`}>
                {id}
            </div>
        )
    }

}

export default NodeWrapper;