import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {
    const [list, setList] = useState([])

    const fetchList = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/product/list", { headers: { token } })
            if (response.data.success) {
                setList(response.data.products)
            }
            else {
                toast.error(response.data.message)
            }
        }
        catch (error) {
            console.log(error);
            toast.error(error.message);

        }
    }
    const removeProduct = async (id) => {
        try {
            const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
            if (response.data.success) {
                toast.success(response.data.message)
                await fetchList();
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);

        }

    }
    useEffect(() => {
        fetchList()
    }, []);
    return (
        <>
            <p className='mb-4 text-lg font-semibold'>ALL PRODUCTS</p>
            <div className='flex flex-col gap-2'>
                { /* table title (header for the table to display content) */}
                <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-4 border bg-gray-100 text-sm font-semibold'>
                    <span>Image</span>
                    <span>Name</span>
                    <span>Category</span>
                    <span>Price</span>
                    <span className='text-center'>Action</span>
                </div>

                { /* product list */}
                {
                    list.map((item, index) => (
                        <div
                            key={index}
                            className='grid grid-cols-2 md:grid-cols-[1fr_3fr_1fr_1fr_1fr] 
                                        items-center 
                                        gap-2 
                                        p-4 
                                        border 
                                        text-sm
                                        rounded'
                        >
                            <img
                                src={item.image[0]}
                                alt={item.name}
                                className='w-20 h-20 object-cover rounded'
                            />
                            <p className='font-medium'>{item.name}</p>
                            <p className='text-gray-600'>{item.category}</p>
                            <p className='font-semibold'>{currency}{item.price}</p>
                            <p onClick={() => removeProduct(item._id)} className='text-right md:text-center text-lg text-red-500 cursor-pointer'>X</p>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default List