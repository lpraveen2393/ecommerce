import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios'

const Orders = () => {
    const { backendUrl, token, currency } = useContext(ShopContext);
    const [orderData, setorderData] = useState([])

    const loadOrderData = async () => {
        try {
            if (!token) {
                return null
            }

            const response = await axios.post(backendUrl + 'api/order/userorders', {}, { headers: { token } })
            if (response.data.success) {
                let allOrdersItem = []
                response.data.orders.map((order) => {
                    order.items.map((item) => {
                        item['status'] = order.status
                        item['payment'] = order.payment
                        item['paymentMethod'] = order.paymentMethod
                        item['date'] = order.date

                        allOrdersItem.push(item)
                    })
                })
                setorderData(allOrdersItem.reverse());
            }
        } catch (error) {
            console.error("Error loading order data:", error);
        }
    }

    useEffect(() => {
        loadOrderData()
    }, [token])

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 text-center">
                <Title text1={'MY'} text2={'ORDERS'} />
            </div>

            {orderData.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    No orders found
                </div>
            ) : (
                <div className="space-y-4">
                    {orderData.map((item, index) => (
                        <div
                            key={index}
                            className="border rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4"
                        >
                            {/* Product Details */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-x-0 sm:space-x-4 w-full">
                                <img
                                    className="w-24 h-24 object-cover rounded-md mb-4 sm:mb-0"
                                    src={item.image[0]}
                                    alt={item.name}
                                />
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold mb-2">
                                        {item.name}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                                        <span>{currency}{item.price}</span>
                                        <span className="mx-2 hidden sm:inline">•</span>
                                        <span>Quantity: {item.quantity}</span>
                                        <span className="mx-2 hidden sm:inline">•</span>
                                        <span>Size: {item.size}</span>
                                    </div>
                                    <div className="text-sm text-gray-500 space-y-1">
                                        <p>Date: {new Date(item.date).toDateString()}</p>
                                        <p>Payment: {item.paymentMethod}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Status and Track Button */}
                            <div className="w-full sm:w-auto flex flex-row-reverse sm:flex-col items-center sm:items-end space-x-reverse space-x-4 sm:space-x-0 sm:space-y-2">
                                <div className="flex items-center space-x-2">
                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                    <p className="text-sm text-green-500 font-medium">
                                        {item.status}
                                    </p>
                                </div>
                                <button
                                    onClick={loadOrderData}
                                    className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-100 transition"
                                >
                                    Track Order
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;