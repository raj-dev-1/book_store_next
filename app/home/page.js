"use client"

import axios from 'axios'
import Navbar from '@/components/Navbar'
import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Model from '@/components/Model'
import FilterModel from '@/components/FilterModel'
import DeleteModel from '@/components/DeleteModel'
// import {useDispatch ,useSelector } from 'react-redux'
// import { fetchData } from '@/redux/actions/actionCounter'

const page = () => {
    const [apiData, setApiData] = useState(null);
    const [searchById, setSearchById] = useState("");
    const [loading, setLoading] = useState(true);
    const [model, setModel] = useState(false);
    const [deleteModels, setDeleteModels] = useState(false);
    const [filterModels, setFilterModels] = useState(false);
    const [isAscending, setIsAscending] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    // pagination 
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = apiData?.slice(firstIndex, lastIndex);
    const npage = apiData ? Math.ceil(apiData.length / recordsPerPage) : 0;
    const numbers = [...Array(npage + 1).keys()].slice(1);
    const getApi = async () => {
        try {
            const res = await axios.get("http://localhost:5000/books");
            const data = res.data;
            setApiData(data);
            setLoading(false);
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        setTimeout(() => {
            getApi();
        }, 3000)
    }, []);

    const numFilter = async (searchItemType) => {
        const data = await getApi();
        let filter = [];
        if (searchItemType == "bookPage100") {
            filter = [...data].filter((book) => book.noOfPages > 100)
        } else if (searchItemType == "bookPage0") {
            filter = [...data].filter((book) => book.noOfPages == 0)
        } else if (searchItemType == "bookPage25To90") {
            filter = [...data].filter((book) => book.noOfPages <= 90 && book.noOfPages >= 25);
        } else if (searchItemType == "bookYears2015And2001") {
            filter = [...data].filter((book) => book.releasedYear == 2015 || book.releasedYear == 2001);
        } else if (searchItemType == "not80") {
            filter = [...data].filter((book) => (book.noOfPages >= 25 && book.noOfPages < 90) && book.noOfPages != 80);
        }
        if (filter.length > -1) {
            setApiData(filter);
        }
    }

    const nextPage = () => {
        if (currentPage < numbers.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prePage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const changeCPage = (number) => {
        setCurrentPage(number);
    };

    const sortBy = async (key) => {
        const data = await getApi();
        let sortedData;
        switch (key) {
            case 'id':
                sortedData = [...data].sort((a, b) => parseInt(a[key]) - parseInt(b[key]));
                break;
            case 'noOfPages':
                sortedData = [...data].sort((a, b) => parseInt(a[key]) - parseInt(b[key]));
                break;
            case 'bookName':
                sortedData = [...data].sort((a, b) => a[key].localeCompare(b[key]));
                break;
            case 'bookDesc':
                sortedData = [...data].sort((a, b) => a[key].localeCompare(b[key]));
                break;
            case 'bookPrice':
                sortedData = [...data].sort((a, b) => parseInt(a[key]) - parseInt(b[key]));
                break;
            case 'releasedYear':
                sortedData = [...data].sort((a, b) => parseInt(a[key]) - parseInt(b[key]));
                break;
            case 'bookCategory':
                sortedData = [...data].sort((a, b) => a[key].localeCompare(b[key]));
                break;
            case 'bookAuthor':
                sortedData = [...data].sort((a, b) => a[key].localeCompare(b[key]));
                break;
            default:
                sortedData = data;
                break;
        }
        if (isAscending) {
            sortedData.reverse();
        }
        setApiData(sortedData);
        setIsAscending(!isAscending);
        setCurrentPage(1);
    };

    return (
        <>
            <Navbar />
            <div className=' w-full bg-white border-gray-200 px-4 pt-[70px] lg:px-6 py-2.5 dark:bg-gray-800'>
                <div className="relative max-w-screen-xl mx-auto">
                    <p className='text-xl font-semibold text-gray-700 dark:text-white'>Update :</p>
                    <div className='py-4 '>
                        <div className='p-2 inline-block'>
                            <button onClick={() => setModel(true)} className='px-4 py-2 rounded-md text-gray-700 bg-gray-200 transition hover:bg-gray-300 dark:hover:bg-gray-600 dark:bg-gray-700 dark:text-white font-semibold'>Update By Name</button>
                        </div>
                        <div className='p-2 inline-block'>
                            <button
                                onClick={() => {
                                    setModel(true)
                                    setTwoFactor(true)
                                }}
                                className='px-4 py-2 rounded-md text-gray-700 bg-gray-200 transition hover:bg-gray-300 dark:hover:bg-gray-600 dark:bg-gray-700 dark:text-white font-semibold'>Update By Name and Author</button>
                        </div>
                    </div>
                    <p className='text-xl font-semibold text-gray-700 dark:text-white'>Delete :</p>
                    <div className='py-4 '>
                        <div className='p-2 inline-block'>
                            <button onClick={() => {
                                setDeleteModels(true);
                                setSearchById("deleteById");
                            }}
                                className='px-4 py-2 rounded-md text-gray-700 bg-gray-200 transition hover:bg-gray-300 dark:hover:bg-gray-600 dark:bg-gray-700 dark:text-white font-semibold'>Delete By Book Id</button>
                        </div>
                        <div className='p-2 inline-block'>
                            <button onClick={() => {
                                setDeleteModels(true);
                                setSearchById("deleteByBookName");
                            }} className='px-4 py-2 rounded-md text-gray-700 bg-gray-200 transition hover:bg-gray-300 dark:hover:bg-gray-600 dark:bg-gray-700 dark:text-white font-semibold'>Delete By Book Name</button>
                        </div>
                        <div className='p-2 inline-block'>
                            <button onClick={() => {
                                setDeleteModels(true);
                                setSearchById("deleteByBookDescAndAuthor");
                            }} className='px-4 py-2 rounded-md text-gray-700 bg-gray-200 transition hover:bg-gray-300 dark:hover:bg-gray-600 dark:bg-gray-700 dark:text-white font-semibold'>Delete By Book Desc And Author</button>
                        </div>
                        <div className='p-2 inline-block'>
                            <button onClick={() => {
                                setDeleteModels(true);
                                setSearchById("deleteByBookNameAndCategory");
                            }} className='px-4 py-2 rounded-md text-gray-700 bg-gray-200 transition hover:bg-gray-300 dark:hover:bg-gray-600 dark:bg-gray-700 dark:text-white font-semibold'>Delete By Book Name And Category</button>
                        </div>
                    </div>
                    <p className='text-xl font-semibold text-gray-700 dark:text-white'>Filter :</p>
                    <div className='py-4 '>
                        <div className='p-2 inline-block'>
                            <button onClick={() => getApi()} className='px-4 py-2 rounded-md text-gray-700 bg-gray-200 transition hover:bg-gray-300 dark:hover:bg-gray-600 dark:bg-gray-700 dark:text-white font-semibold'>Show All</button>
                        </div>
                        <div className='p-2 inline-block'>
                            <button onClick={() => {
                                setFilterModels(true);
                                setSearchById("");
                            }} className='px-4 py-2 rounded-md text-gray-700 bg-gray-200 transition hover:bg-gray-300 dark:hover:bg-gray-600 dark:bg-gray-700 dark:text-white font-semibold'>Show Book By Name</button>
                        </div>
                        <div className='p-2 inline-block'>
                            <button onClick={() => {
                                setFilterModels(true)
                                setSearchById("searchById");
                            }} className='px-4 py-2 rounded-md text-gray-700 bg-gray-200 transition hover:bg-gray-300 dark:hover:bg-gray-600 dark:bg-gray-700 dark:text-white font-semibold'>Show Book By Id</button>
                        </div>
                        <div onClick={() => {
                            setFilterModels(true)
                            setSearchById("searchByNameAndAuthore");
                        }} className='p-2 inline-block'>
                            <button className='px-4 py-2 rounded-md text-gray-700 bg-gray-200 transition hover:bg-gray-300 dark:hover:bg-gray-600 dark:bg-gray-700 dark:text-white font-semibold'>Show Book By Name and Author</button>
                        </div>
                        <div className='p-2 inline-block'>
                            <button onClick={() => numFilter("bookPage100")} className='px-4 py-2 rounded-md text-gray-700 bg-gray-200 transition hover:bg-gray-300 dark:hover:bg-gray-600 dark:bg-gray-700 dark:text-white font-semibold'>Show Book Pages More than 100</button>
                        </div>
                        <div className='p-2 inline-block'>
                            <button onClick={() => numFilter("bookPage25To90")} className='px-4 py-2 rounded-md text-gray-700 bg-gray-200 transition hover:bg-gray-300 dark:hover:bg-gray-600 dark:bg-gray-700 dark:text-white font-semibold'>Show Book Pages Less than 90 More than 25 </button>
                        </div>
                        <div className='p-2 inline-block'>
                            <button onClick={() => numFilter("not80")} className='px-4 py-2 rounded-md text-gray-700 bg-gray-200 transition hover:bg-gray-300 dark:hover:bg-gray-600 dark:bg-gray-700 dark:text-white font-semibold'>Show Book Pages Less than 90 More than 25 But Not 80</button>
                        </div>
                        <div className='p-2 inline-block'>
                            <button onClick={() => numFilter("bookPage0")} className='px-4 py-2 rounded-md text-gray-700 bg-gray-200 transition hover:bg-gray-300 dark:hover:bg-gray-600 dark:bg-gray-700 dark:text-white font-semibold'>Show Book Pages Zero</button>
                        </div>
                        <div className='p-2 inline-block'>
                            <button onClick={() => numFilter("bookYears2015And2001")} className='px-4 py-2 rounded-md text-gray-700 bg-gray-200 transition hover:bg-gray-300 dark:hover:bg-gray-600 dark:bg-gray-700 dark:text-white font-semibold'>Show Book Released Year 2015 And 2001</button>
                        </div>
                    </div>
                    <div className='overflow-x-auto mb-10'>
                        <table className="w-full mb-3 border dark:border-gray-600 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        <div onClick={() => sortBy("id")} className='flex items-center justify-between cursor-pointer'>
                                            <span>
                                                Book ID
                                            </span>
                                            <span className='flex  flex-col after:content-["<"] after:inline-block after:rotate-[270deg] before:content-[">"] before:rotate-[270deg] '>
                                            </span>
                                        </div>
                                    </th>
                                    <th scope="col" className=" px-6 py-3">
                                        <div onClick={() => sortBy("bookName")} className='flex items-center justify-between cursor-pointer'>
                                            <span>
                                                Book Name
                                            </span>
                                            <span className='flex  flex-col after:content-["<"] after:inline-block after:rotate-[270deg] before:content-[">"] before:rotate-[270deg] '>
                                            </span>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <div onClick={() => sortBy("bookDesc")} className='flex items-center justify-between cursor-pointer'>
                                            <span>
                                                Book desc
                                            </span>
                                            <span className='flex  flex-col after:content-["<"] after:inline-block after:rotate-[270deg] before:content-[">"] before:rotate-[270deg] '>
                                            </span>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <div onClick={() => sortBy("bookAuthor")} className='flex items-center justify-between cursor-pointer'>
                                            <span>
                                                Book Authors
                                            </span>
                                            <span className='flex w-4  flex-col after:content-["<"] after:inline-block after:rotate-[270deg] before:content-[">"] before:rotate-[270deg] '>
                                            </span>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <div onClick={() => sortBy("noOfPages")} className='flex items-center justify-between cursor-pointer'>
                                            <span>
                                                No of Page
                                            </span>
                                            <span className='flex  flex-col after:content-["<"] after:inline-block after:rotate-[270deg] before:content-[">"] before:rotate-[270deg] '>
                                            </span>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <div onClick={() => sortBy("bookCategory")} className='flex items-center justify-between cursor-pointer'>
                                            <span>
                                                Book Category
                                            </span>
                                            <span className='flex  flex-col after:content-["<"] after:inline-block after:rotate-[270deg] before:content-[">"] before:rotate-[270deg] '>
                                            </span>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <div onClick={() => sortBy("bookPrice")} className='flex items-center justify-between cursor-pointer'>
                                            <span>
                                                Book Price
                                            </span>
                                            <span className='flex  flex-col after:content-["<"] after:inline-block after:rotate-[270deg] before:content-[">"] before:rotate-[270deg] '>
                                            </span>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <div onClick={() => sortBy("releasedYear")} className='flex items-center justify-between cursor-pointer'>
                                            <span>
                                                Released Year
                                            </span>
                                            <span className='flex  flex-col after:content-["<"] after:inline-block after:rotate-[270deg] before:content-[">"] before:rotate-[270deg] '>
                                            </span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    loading && (
                                        <>
                                            {[...Array(10)].map((_, index) => (
                                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                    <td className='px-6 py-4'> <Skeleton /> </td>
                                                    <td className='px-6 py-4'> <Skeleton /> </td>
                                                    <td className='px-6 py-4'> <Skeleton /> </td>
                                                    <td className='px-6 py-4'> <Skeleton /> </td>
                                                    <td className='px-6 py-4'> <Skeleton /> </td>
                                                    <td className='px-6 py-4'> <Skeleton /> </td>
                                                    <td className='px-6 py-4'> <Skeleton /> </td>
                                                    <td className='px-6 py-4'> <Skeleton /> </td>
                                                </tr>
                                            ))}
                                        </>
                                    )
                                }

                                {Array.isArray(apiData) && apiData.length > 0 ? (
                                    records?.map((item, index) => (
                                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.id}
                                            </th>
                                            <td className="px-6 py-4">
                                                {item.bookName}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.bookDesc}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.bookAuthor}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.noOfPages}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.bookCategory}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.bookPrice}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.releasedYear}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td colSpan="8" className='px-6 text-center py-4'> Data Not Found </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {
                            apiData && (
                                <nav>
                                    <ul className="flex items-center justify-end -space-x-px h-10 text-base">
                                        <li>
                                            <a
                                                href="js:"
                                                onClick={prePage}
                                                className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === 1 ? ' hover:bg-white dark:hover:bg-gray-800 dark:hover:text-gray-400 hover:text-gray-500 cursor-not-allowed' : ''}`}
                                            >
                                                <span className="sr-only">Previous</span>
                                                <svg
                                                    className="w-3 h-3 rtl:rotate-180"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 6 10"
                                                >
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                                                </svg>
                                            </a>

                                        </li>
                                        {
                                            numbers?.map((number, index) => (
                                                <li key={index}>
                                                    <a href="js:" onClick={() => changeCPage(number)} className={`flex items-center justify-center px-4 h-10 leading-tight ${currentPage === number ? 'text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}`}>{number}</a>
                                                </li>
                                            ))
                                        }
                                        <li>
                                            <a href="js:" onClick={nextPage} className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === numbers.length ? ' hover:bg-white dark:hover:bg-gray-800 dark:hover:text-gray-400 hover:text-gray-500 cursor-not-allowed' : ''}`}>
                                                <span className="sr-only">Next</span>
                                                <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                                </svg>
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            )
                        }
                    </div>
                </div>
            </div>
            <Model model={model} setModel={setModel} twoFactor={twoFactor} setTwoFactor={setTwoFactor} getApi={getApi} />
            <FilterModel model={filterModels} setModel={setFilterModels} setApiShow={setApiData} searchById={searchById} setSearchById={setSearchById} apiData={apiData} />
            <DeleteModel model={deleteModels} setModel={setDeleteModels} searchById={searchById} setApiShow={setApiData} getApi={getApi} apiData={apiData} setSearchById={setSearchById} />
        </>
    )
}

export default page;