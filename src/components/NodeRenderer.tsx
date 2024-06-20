import type { Node } from "../types/general";
import NodeWrapper from "./Node";

const NodeRenderer = () =>{

    const initialNodes:Node[] = [
        { id: '1', data: { label: '1' } },
        { id: '2', data: { label: '2' } },
        { id: '3', data: { label: '3' }, type: 'ArrayListNode'},
        { id: '5',data: { label: 'iterator' }, type: 'IteratorNode'},
        {
          id: '4',
          data: { label: 'Group A' },
        }
    ]

   

    return(
        initialNodes.map(node=>{
            return(
                <NodeWrapper
                  id={node.id}
                  data={node.data}
                  type={node.type}
                >
                </NodeWrapper>
            )
        })
    )
}

export default NodeRenderer;