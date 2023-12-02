export interface Board {
    columns: Map<TypedColumns, Colummn>
}

type TypedColumns = 'todo' | 'inprogress' | 'done'

interface Colummn {
    id:     TypedColumns;
    todos: Todo[]
}

interface Todo {
    $id: string;
    $createdAt: string;
    title: string;
    status: TypedColumns;
    image?: any
}

interface Image {
    bucketId: string;
    fileId: string
}