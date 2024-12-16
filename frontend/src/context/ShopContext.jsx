import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { products } from '../assets/assets'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import dotenv from 'dotenv'


export const ShopContext = createContext();
const ShopContextProvider = (props) => {


  const currency = '$'
  const delivery_fee = 15;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://ecommerce-backend-jet-phi.vercel.app/';
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("select product size before adding to the cart")
      return;
    }
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      }
      else {
        cartData[itemId][size] = 1;
      }
    }
    else {

      cartData[itemId] = {}
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(backendUrl + 'api/cart/add', { itemId, size }, { headers: { token } })


      } catch (error) {
        console.log(error);
        toast.error(error.message)

      }
    }
  }


  const addOrder = () => {
    let tempOrders = structuredClone(orders);
    let newOrder = [];

    for (const item in cartItems) {
      for (const size in cartItems[item]) {
        if (cartItems[item][size] > 0) {
          newOrder.push({
            _id: item,
            size,
            quantity: cartItems[item][size],
          });
        }
      }
    }
    setOrders([...tempOrders, ...newOrder]);
    //setCartItems({}); // Clear cart after placing the order
  };

  const getCartCount = () => {
    let totalcount = 0;
    for (const items in cartItems) {
      for (const size in cartItems[items]) {
        try {
          if (cartItems[items][size] > 0) {
            totalcount += cartItems[items][size]
          }


        } catch (error) {

        }
      }
    }
    return totalcount;
  }

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(backendUrl + 'api/cart/update', { itemId, size, quantity }, { headers: { token } })
      } catch (error) {
        console.log(error);
        toast.error(error.message)
      }
    }
  }

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {

            totalAmount += itemInfo.price * cartItems[items][item]
          }
        } catch (error) {

        }
      }
    }
    return totalAmount;
  }

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + 'api/product/list');
      if (response.data.success) {
        setProducts(response.data.products)
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)

    }
  }

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(backendUrl + 'api/cart/get', {}, { headers: { token } })

      if (response.data.success) {
        setCartItems(response.data.cartData)
      }


    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }



  useEffect(() => {
    getProductsData();
  }, [])


  useEffect(() => {
    if (!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'))
      getUserCart(localStorage.getItem('token'))
    }
  }, [])

  const value = {
    products, currency, delivery_fee, search, setSearch,
    showSearch, setShowSearch, cartItems, addToCart, getCartCount,
    updateQuantity, getCartAmount, navigate, backendUrl, getProductsData,
    token, setToken, addOrder, setCartItems
  }

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  )

}
export default ShopContextProvider