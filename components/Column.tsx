'use client'
import { Todo, TypedColumns } from '@/typings'
import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import TodoCard from './TodoCard'
import { PlusCircleIcon } from '@heroicons/react/20/solid'
import { useBoardStore } from '@/store/BoardStore'
import { useModalStore } from '@/store/ModalStore'

type Props = {
    id: TypedColumns,
    index: number,
    todos: Todo[]
}

const idToColumText: {
    [key in TypedColumns]: string
} = {
    'todo' : 'To Do',
    'inprogress': 'In Progress',
    'done' : 'Done'
}

const Column = ({id, todos, index}: Props) => {
    const [searchString, setNewTaskType] = useBoardStore(state => [state.searchString, state.setNewTaskType])
    const openModal = useModalStore(state => state.openModal)

    
    
    const handleAddTodo = () => {
        setNewTaskType(id)

        openModal();
    }
    
  return (
    <Draggable 
    draggableId={id}
    index={index}
    >
        {(provided) => (
            <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            >
                {/* render droppable element */}
                <Droppable droppableId={index.toString()} type='card'>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`shadow-sm p-2 rounded-2xl ${snapshot.isDraggingOver ? 'bg-green-200' : 'bg-white/50'}`}
                        >
                            <h2 className='flex justify-between p-2 text-xl'>{idToColumText[id]}
                            <span className='text-gray-500 bg-gray-200 rounded-full text-sm font-normal px-2 py-1'>
                                { !searchString ?  todos.length : todos.filter((todo) => todo.title.toLowerCase().includes(searchString)).length}
                                </span>
                            </h2>

                            <div className='spax-y-5'>
                                {todos.map((todo, index) => {
                                    if(searchString && !todo.title.toLocaleLowerCase().includes(searchString)){
                                        return null
                                    }

                                    return(
                                    <Draggable
                                    key={todo.$id}
                                    index={index}
                                    draggableId={todo.$id}
                                    >
                                        {(provided) => (
                                            <TodoCard
                                                todo={todo}
                                                index={index}
                                                id={id}
                                                innerRef={provided.innerRef}
                                                draggableProps={provided.draggableProps}
                                                dragHandleProps={provided.dragHandleProps}
                                            />
                                        )}
                                    </Draggable>
                                )})}

                                {provided.placeholder}

                                <div className='flex items-center justify-end p-2'>
                                    <button onClick={handleAddTodo} type='button' className='text-green-500 hover:text-green-600'><PlusCircleIcon className='h-10 w-10' /> <span className='hidden'>click</span></button>
                                </div>
                            </div>
                        </div>
                    )}
                </Droppable>
            </div>
        )}

    </Draggable>
  )
}

export default Column