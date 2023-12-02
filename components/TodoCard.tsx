'use client'
import { getUrl } from '@/lib/getUrl';
import { useBoardStore } from '@/store/BoardStore';
import { Todo, TypedColumns } from '@/typings'
import { XCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd';

type Props = {
    todo: Todo;
    id: TypedColumns;
    index: number;
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: DraggableProvidedDraggableProps;
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

const TodoCard = ({todo, id, index, innerRef, draggableProps, dragHandleProps}: Props) => {
    const deleteTask = useBoardStore(state => state.deleteTask)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    

    useEffect(() => {
        if (todo.image) {
            const fetchImage = async () => {
                try {
                    // Assuming getUrl is an asynchronous function
                    const url = await getUrl(todo.image!);

                    console.log(url.toString());
                    

                    if (url) {
                        setImageUrl(url?.toString());
                    }
                } catch (error) {
                    console.error('Error fetching image:', error);
                }
            };

            fetchImage();
        }
    }, [todo]);

    
  return (
    <div
    className='bg-white rounded-md space-y-2 my-2 drop-shadow-md p-5'
        {...dragHandleProps} {...draggableProps} ref={innerRef}
    >
        <div className='flex justify-between items-center'>
            <p>{todo.title}</p>
            <button type='button' className='text-red-500 hover:text-red-600'>
                <XCircleIcon className='ml-5 h-8 w-8' onClick={() => deleteTask(index, todo, id)} />
                <span className='hidden'>cancle</span>
            </button>
        </div>

        {/* {imageUrl &&} */}
        {imageUrl && (
            <div className='h-full w-full rounded-b-md'>
                <Image src={imageUrl} alt='Task Image' width={400} height={200} className='w-full h-full object-contain rounded-b-md' />
            </div>
        )}
    </div>
  )
}

export default TodoCard