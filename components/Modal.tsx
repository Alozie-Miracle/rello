'use client'
import { useState, Fragment, useRef, FormEvent } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useModalStore } from '@/store/ModalStore'
import { useBoardStore } from '@/store/BoardStore'
import MyRadioGroup from './TaskTypeRadioGroup'
import Image from 'next/image'
import { PhotoIcon } from '@heroicons/react/24/solid'

function Modal() {
const imagePickerRef = useRef<HTMLInputElement>(null)

    const [setNewTaskInput, newTaskInput, setImage, image, addTask, newTaskType ] = useBoardStore(state => [state.setNewTaskInput, state.newTaskInput, state.setImage, state.image, state.addTask, state.newTaskType])

  const [isOpen, closeModal] = useModalStore(state => [state.isOpen, state.closeModal])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!newTaskInput) return;

    //add task to database
    addTask(newTaskInput, newTaskType, image)


    setImage(null);
    closeModal();
  }

  return (
    // Use the `Transition` component at the root level
    <div className='relative -mt-96 bg-black'>
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog 
            as='form' 
            onSubmit={handleSubmit}
            className='relative z-10'
            onClose={closeModal}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                <div className="fixed inset-0 bg-black opacity-25" />

            </Transition.Child>
            <div className='-mt-40 inset-0 overflow-y-auto'>
                <div className='flex min-h-full items-center justify-center p-4 text-center'>
                    <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    >
                    <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                        <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900 pb-2'>
                            Add a Task
                        </Dialog.Title>

                        <div className='mt-2'>
                            <input type="text" value={newTaskInput} onChange={e => setNewTaskInput(e.target.value)} placeholder='Enter a Task here...' className='w-full border border-gray-300 rounded-md outline-none py-3 px-2' />
                        </div>

                        <MyRadioGroup />

                        <div className='mt-2'>

                            <div>

                                {!image && (
                                    <button onClick={() => { imagePickerRef?.current?.click()}} type='button' className='w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 flex items-center justify-center'><PhotoIcon className='h-6 w-6 mr-2' /> Upload Image</button>
                                )}

                                {image && (
                                    <Image src={URL.createObjectURL(image)} alt='your todo image' width={200} height={200} className='w-full h-[200px] object-contain mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed' onClick={() => { setImage(null)}} />
                                )}
                            </div>

                            <input type="file" hidden ref={imagePickerRef} 
                            onChange={e => {
                                if(!e?.target?.files![0].type.startsWith('image/')) return;

                                setImage(e?.target?.files![0]);
                            }}  />
                        </div>

                        <div>
                            <button disabled={!newTaskInput} type='submit' className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:text-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed mt-2'
                            >Add Task</button>
                        </div>
                    </Dialog.Panel>

                    </Transition.Child>
                </div>
            </div>

            </Dialog>
        </Transition>
    </div>
  )
}

export default Modal