import { ID, database, storage } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import { uploadImage } from '@/lib/uploadImage';
import { Board, Colummn, Image, Todo, TypedColumns } from '@/typings';
import { create } from 'zustand'

interface BoardState {
    board: Board;
    getBoard: () => void
    setBoardState: (board: Board)  => void
    updateTodoInDB: (todo: Todo, columnId: TypedColumns) => void

    searchString: string
    setSearchString: (searchString: string) => void

    deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumns ) => void;

    newTaskInput: string;
    setNewTaskInput: (newTaskInput: string) => void

    newTaskType: TypedColumns
    setNewTaskType: (columnId: TypedColumns) => void

    image: File | null;
    setImage: (image : File | null ) => void

    addTask: (todo: string, colummId: TypedColumns, image?: File | null ) => void
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumns, Colummn>()
  },
  getBoard: async() => {
    const board = await getTodosGroupedByColumn();
    set({ board })
  },
  setBoardState: (board) => set({ board }),
  updateTodoInDB: async (todo, columnId) => {
    await database.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    )
  },
  searchString: '',
  setSearchString: (searchString) => set({ searchString }),
  deleteTask: async (taskId: number, todo: Todo, id: TypedColumns) => {
    const newColumns = new Map(get().board.columns)

    //delete todoId from new Columns
    newColumns.get(id)?.todos.splice(taskId, 1)

    set({ board: { columns: newColumns }})

    if(todo.image){
      const data = JSON.parse(todo?.image)

      const properIds = JSON.parse(data)
      
      const {bucketId, fileId} = properIds
      await storage.deleteFile(bucketId, fileId)
    }

    await database.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!, 
      process.env.NEXT_PUBLIC_TODOS_ID!,
      todo.$id
    )

  },
  newTaskInput: '',
  setNewTaskInput: (newTaskInput) => set({ newTaskInput }),

  newTaskType: 'todo',
  setNewTaskType: (colummId: TypedColumns) => set({ newTaskType: colummId }),

  image: null,
  setImage: (image: File | null) =>  set({ image }),

  addTask: async (todo: string, colummId: TypedColumns, image?: File | null ) => {
    let file : Image | undefined

    if(image){
      const fileUpload = await uploadImage(image);

      if(fileUpload){
        file = {
          bucketId: fileUpload.bucketId,
          fileId: fileUpload.$id
        }
      }
    }

    const { $id } = await database.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!, 
      process.env.NEXT_PUBLIC_TODOS_ID!,
      ID.unique(),
      {
        title: todo,
        status: colummId,
        //include the image if it exist
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    set({ newTaskInput: '' });
    set(state => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: colummId,
        //include if it exist
        ...(file && { image: file }),
      }
      const column = newColumns.get(colummId)

      if(!column) {
        newColumns.set(colummId, {
          id: colummId,
          todos: [newTodo],
        })
      } else {
        newColumns.get(colummId)?.todos.push(newTodo)
      }

      return {
        board: {
          columns: newColumns,
        }
      }
    })

  }
}))


