export type ReactFlowState = ReactFlowStore & ReactFlowActions;




export type ReactFlowActions= {
    getRelationElement:(nodeId: string)=> Relation;
    getRelations:()=>Relations;
    setRelation:(payload:any) => void;
    createRelation:(payload:any) => void;
}

export type ReactFlowStore = {
    rfId: string;
    relations? : Relations;
    newlyAddedId: string | null;

}
export type Relations = Map<string, Relation>;
export type Relation = {
    nodeId: string,
    contentForIter: string[],
}
    
