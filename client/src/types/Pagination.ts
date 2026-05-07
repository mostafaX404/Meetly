export type Pagination = {
    
    currentPage : number,
    pageSize : number,
    totalPages : number,
    totalCount: number

}

export type PaginationResult<T> = {

    metaData : Pagination , 
    items : T[]

}