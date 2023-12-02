import { Board, Todo, TypedColumns } from "@/typings";

export const formatTodoForAI = (board: Board) => {
    const todos = Array.from(board.columns.entries())

    const flatArray = todos.reduce((map, [key, value]) => {
        map[key] = value.todos;
        return map;
    }, {} as { [key in TypedColumns]: Todo[]})

    const flatArrayCounted = Object.entries(flatArray).reduce((map, [key, value]) => {
        map[key as TypedColumns] = value.length;
        return map
    }, {} as {[ key in TypedColumns]: number })

    return flatArrayCounted;
}