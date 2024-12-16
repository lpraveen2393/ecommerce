import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import '../index.css'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';


const Collection = () => {

    const { products, search, showSearch, backendUrl } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState('relavent');
    const toggleCategory = (e) => {

        if (category.includes(e.target.value)) {

            setCategory(prev => prev.filter(item => item !== e.target.value))

        }
        else {
            setCategory(prev => [...prev, e.target.value])
        }
    }

    const toggleSubCategory = (e) => {

        if (subCategory.includes(e.target.value)) {

            setSubCategory(prev => prev.filter(item => item !== e.target.value))

        }
        else {
            setSubCategory(prev => [...prev, e.target.value])
        }
    }

    const applyFilter = () => {
        let productsCopy = products.slice();

        if (showSearch && search) {
            productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
        }




        if (category.length > 0) {

            productsCopy = productsCopy.filter(item => category.includes(item.category))
        }
        if (subCategory.length > 0) {
            productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
        }
        setFilterProducts(productsCopy);
    }

    const sortProduct = () => {
        let fpCopy = filterProducts.slice();

        switch (sortType) {
            case 'low-high':
                setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
                break;
            case 'high-low':
                setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
                break;

            default:
                applyFilter();
                break;
        }

    }

    useEffect(() => {
        console.log("backendurl", backendUrl)
        applyFilter();
    }, [category, subCategory, search, showSearch, products])

    useEffect(() => {
        sortProduct();
    }, [sortType])


    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
            {/* Filter Option */}

            <div className="min-w-52">
                <p
                    onClick={() => {
                        setShowFilter(!showFilter);
                    }}
                    className="my-2 text-xl flex items-center cursor-pointer gap-2"
                >
                    {' '}
                    Filters
                    <img
                        src={assets.dropdown_icon}
                        alt=""
                        className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
                    />
                </p>

                {/* Category Filter */}
                <div
                    className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'
                        } 
            sm:block`}
                >
                    <p className="mb-3 text-sm font-medium">CATEGORIES</p>

                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3"
                                value={'Men'}
                                onChange={toggleCategory}
                            />
                            MEN
                        </p>
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3"
                                value={'Women'}
                                onChange={toggleCategory}
                            />
                            WOMEN
                        </p>
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3"
                                value={'Kids'}
                                onChange={toggleCategory}
                            />
                            KIDS
                        </p>
                    </div>
                </div>

                {/* Sub Catrgory Filter */}
                <div
                    className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'
                        } 
            sm:block`}
                >
                    <p className="mb-3 text-sm font-medium">TYPES</p>

                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3"
                                value={'Topwear'}
                                onChange={toggleSubCategory}
                            />
                            Topwear
                        </p>
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3"
                                value={'Bottomwear'}
                                onChange={toggleSubCategory}
                            />
                            Bottomwear
                        </p>
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3"
                                value={'Winterwear'}
                                onChange={toggleSubCategory}
                            />
                            Winterwear
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side --> Product List */}

            <div className="flex-1">
                {/* Title */}
                <div className="flex justify-between text-sm sm:text-xl lg:text-2xl mb-4">
                    <Title text1={'ALL'} text2={'COLLECTIONS'} />

                    {/* Product Sort */}
                    <select
                        onChange={(e) => {
                            setSortType(e.target.value);
                        }}
                        value={sortType}
                        className="border border-gray-300 text-sm px-2"
                    >
                        <option value="relevent">Sort by: Relavance</option>
                        <option value="low-high">Sort by: Low to High</option>
                        <option value="high-low">Sort by: High to Low</option>
                    </select>
                </div>

                {/* Product List */}

                <div className="grid grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6">
                    {filterProducts.map((product) => (
                        <ProductItem
                            key={product._id}
                            id={product._id}
                            image={product.image}
                            name={product.name}
                            price={product.price}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Collection