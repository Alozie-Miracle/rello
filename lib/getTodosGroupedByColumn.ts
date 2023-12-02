import { database } from "@/appwrite"
import { Board, Colummn, TypedColumns } from "@/typings"

export const getTodosGroupedByColumn  = async () => {
    const data = await database.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID!, process.env.NEXT_PUBLIC_TODOS_ID!)

   const todos = data.documents
   
    
   const columns = todos.reduce((acc, todo ) => {

    if (!acc.get(todo.status)) {
        acc.set(todo.status, {
            id: todo.status,
            todos: []
        })
    }

    acc.get(todo.status)!.todos.push({
        $id: todo.$id,
        $createdAt: todo.$createdAt,
        title: todo.title,
        status: todo.status,
        // get the image if it exist on the todo
        ...(todo.image && { image: JSON.stringify(todo.image) })
    })

    return acc

   }, new Map<TypedColumns, Colummn>)

   //if the columns doesn't have inprogress, todo or done add them with empty todos

   const columnTypes: TypedColumns[] = ['todo', 'inprogress', 'done']   
   for(const columnType of columnTypes){
        if(!columns.get(columnType)) {
            columns.set(columnType, {
                id: columnType,
                todos: [],
            })
        }
   }

   //sort columns by the column type

   const sortedColumn = new Map(
    Array.from(columns.entries()).sort((a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    )
   )

   const board : Board = {
    columns: sortedColumn
   }

   return board
   
}