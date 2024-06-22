
import { useStore, useStoreApi } from "../store/useStore"
import { useState, useRef, useEffect, memo } from "react"
import { ReactFlowState, Relation } from "../types/store"
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

type IteratorTimeFrame = {
    nodeId: string,
    nodeTimeFrameIndex: number
}

type IteratorManager = {
    relationCount: number,
    managingRelations: string[],
    currentTimeFrame: number,
    timeFrame: IteratorTimeFrame[][]
}

interface ContentLengths {
    [key: string]: number; 
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


       const selector = (s: ReactFlowState) => {
            //console.log('Current update debug:', s.update);
            const update = s.update?.get(`${id}`);
            return { update: update ? update : 0 };
        };

        const {update} = useStore(selector);

        useEffect(()=>{

            console.log(`update in ${id}`, update)
        },[update])
         
        useEffect(()=>{

          console.log("ArrayListManager updated in useEffect", ArrayListManager)
        //   if(ArrayListManager?.currentTimeFrameIndex === 0){
        //     const payload = {
        //         id: id,
        //         type: type,
        //         data: ArrayListManager.TimeFrameArray[0]
        //     }
        //     setRelation(payload);
        //   }else if(ArrayListManager?.currentTimeFrameIndex > 0){
        //     //const input = contentRef.current?.innerHTML.split(" ") || [];
        //     const payload = {
        //         id: id,
        //         type: type,
        //         data: ArrayListManager.TimeFrameArray[ArrayListManager.currentTimeFrameIndex]
        //     }
        //     setRelation(payload);
        //   }

          if(ArrayListManager?.currentTimeFrameIndex !== -1){
            const payload = {
                id: id,
                type: type,
                data: ArrayListManager.TimeFrameArray[ArrayListManager.currentTimeFrameIndex],
                timeFrameId: ArrayListManager.currentTimeFrameIndex
            }
            setRelation(payload);
          }

          console.log(`<ArrayListManager ${id}> ArrayListManager debug`, ArrayListManager)

        },[ArrayListManager?.currentTimeFrameIndex])
 


        const onSubmitHandler = (event: React.MouseEvent<HTMLButtonElement>) =>{


            const {setRelation} = store.getState();
            const input = contentRef.current?.innerHTML.split(" ") || [];

            const wasFromCurrentNode = event.currentTarget.parentElement?.getAttribute('data-id') === id 

            //input wasn't empty and different from last time? and was from current Array 
            if(input.length > 0 && wasFromCurrentNode)
            { setArrayListManager(prev => {
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

           setRelation(input);}


        }


        ArrayListManager.TimeFrameArray.map((ele)=>{
            return(
                <span>
                    
                </span>
            )
        })

        return(
            <div className={`node_${id} ArrayListNode Node`}
            data-id={id}
            >
                <div contentEditable ref={contentRef}>

                </div>
                
                <button onClick={onSubmitHandler}>submit</button>
            </div>
        )

    }
    else if(type === 'IteratorNode'){


        //relationCount 
        console.log(`<Iterator ${id}> rendered`);

        const initIteratorManager:IteratorManager  = {
            relationCount: 0,
            //managingRelations: [],
            managingRelations: [],
            currentTimeFrame: -1,
            timeFrame: [[]],
        }

        const [iteratorManager, setIteratorManager] = useState<IteratorManager>(initIteratorManager);



        // const selector = (s: ReactFlowState) => {
        //     console.log('Current relations:', s.relations);
        //     const relation = s.relations?.get("3-Iterator-Relation");
        //     return { Relation: relation ? relation.contentForIter.length : 0 };
        // };

        // const {Relation} = useStore(selector, shallow);


        // const selectorTest = (s: ReactFlowState) => {
           
        //     let res:Relation[] = [];
        //     iteratorManager.managingRelations.forEach((rel)=>{
        //         res.push((s.relations?.get(`${id}-${type}-Relation`) as Relation))
        //     })

        //     //const relationTest = s.relations?.get("3-ArrayListNode-Relation");
        //     return { Relation: relationTest ? relationTest.contentForIter.length : 0 };
        // };

        //const {Relation} = useStore(selectorTest, shallow);


        // const selectorDynamic = (s: ReactFlowState) => {
        //     // Creating an object that holds the length of contentForIter for each relation
        //     const contentLengths:ContentLengths = {};
        //     s.relations?.forEach((relation, key) => {
        //         contentLengths[key] = relation.contentForIter.length;
        //         console.log("contentLengths", contentLengths[key], key)
        //     });
        //     console.log("contentLengths", contentLengths, id)
        //     return contentLengths;
        // };

        const selectorDynamic = (s: ReactFlowState) => {
            const keys = Array.from(s.relations?.keys() || []);
            const lengths = keys.map(key =>  s.relations?.get(key)?.contentForIter.length);
            return lengths; // Returns an array of lengths
        };


        const selector = (s: ReactFlowState) => {
            console.log(`<ItertorNode id:${id}>  Current relations is`, s.relations);
            return { relationsCount: s.relations?.size || 0 };
        };


        const {relationsCount} = useStore(selector, shallow);
        const contentLengths = useStore(selectorDynamic,shallow);

        useEffect(()=>{

            console.log(`<Iterator ${id}> listening to number of relations`, relationsCount);
            if(relationsCount != iteratorManager.relationCount){
                const newlyAddedId = store.getState().newlyAddedId;


                setIteratorManager(prev=>({
                    ...prev,
                    managingRelations: [...prev.managingRelations , newlyAddedId as string],
                    relationCount: prev.relationCount + 1,
                    //currentTimeFrame: prev.currentTimeFrame + 1,
                    // timeFrame: [...prev.timeFrame, ]
                }))
            }

        },[relationsCount])


        // useEffect(()=>{

        //     console.log("iteratorManager count has changed", iteratorManager);

        // },[iteratorManager.relationCount])


        useEffect(()=>{

            const {relations} = store.getState()
            //when each contentLength differs from iteratorManager 
            // const filteredItems;

            // relations

            // iteratorManager.managingRelations.forEach((nodeID)=>{
            //     const relation = relations?.get(`${nodeID}-ArrayListNode-Relation`);

            //     relation?.contentForIter
               
            // })


             //change managingRelations into key[nodeId]: contentLengths

             //this if statement gets run when iteratorManager.relationCount == 0 
            if(contentLengths && contentLengths.length > 0 && iteratorManager.managingRelations.length > 0){
                //get Relations by key of iteratorManager.managingRelations   >> contentLengths
                

                const res:IteratorTimeFrame[] = [];

                iteratorManager.managingRelations.forEach((nodeID)=>{
                    const relation = relations?.get(`${nodeID}-ArrayListNode-Relation`);

                    const obj:IteratorTimeFrame = {
                          nodeId: nodeID,
                          nodeTimeFrameIndex: relation?.timeFrameId as number
                    }
                    res.push(obj);
                })

                for (let index = 0; index < contentLengths.length; index++) {
                    
                    
                }

                

                //get those Relations value which consists timeFrameId  
               
                //make an object:IteratorTimeFrame  nodeId, timeFrameId 
                  //store those into iteratorManager.timeFrame   IteratorTimeFrame
                  //increase iteratorManager.currentTimeFrame by 1 
                
                // if(iteratorManager.relationCount > 0)  {
                    setIteratorManager(prev=>{
                        const newTimeFrames = [...prev.timeFrame];
    
                        if (!newTimeFrames[prev.currentTimeFrame]) {
                            newTimeFrames[prev.currentTimeFrame] = [];
                        }
    
                        newTimeFrames[prev.currentTimeFrame] = [...newTimeFrames[prev.currentTimeFrame], ...res];
    
                        return{
                            ...prev,
                            currentTimeFrame: prev.currentTimeFrame + 1,
                            timeFrame: newTimeFrames
                        }
                        
                    })
                //}
                
                
            }
            

            
        },[contentLengths, iteratorManager.relationCount])


        useEffect(()=>{

            // if(iteratorManager.currentTimeFrame )
            console.log(`<Iterator ${id}> iteratorManager debug`, iteratorManager)

        },[iteratorManager])

        //This selector and useEffect was for testing if this iterator could listen to 
        //3-Iterator-Relation or not 

        // const lengthEqualityFn = (prevLength: number, nextLength: number) => {
        //     console.log("Relation", prevLength, nextLength)
        //     return prevLength === nextLength;
        // }
    
        // const contentForIterLength = useStore(
        //     (state) => (state.relations?.get("3-Iterator-Relation")?.contentForIter.length as number),
            
        // );


        // useEffect(()=>{

        //     console.log(`<Iterator ${id}> Listening to 3-Iterator-Relation Length :`, contentForIterLength);
        // },[contentForIterLength])


       const onMinusHandler = () =>{

        console.log("minus");
         const {setUpdate} = store.getState()

          const currentFrame = iteratorManager.timeFrame[iteratorManager.currentTimeFrame - 1];


          setUpdate(currentFrame);
        //   currentFrame.forEach((frame)=>{
        //     update.set(frame.nodeId, frame.nodeTimeFrameIndex);
        //   })

       }

        return(
            <div className={`node_${id} IteratorNode Node`}>
                <div>
                    <button onClick={onMinusHandler}>-</button>
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

export default memo(NodeWrapper);