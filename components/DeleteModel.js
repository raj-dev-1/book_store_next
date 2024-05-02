"use client"
import axios from 'axios'
import React, { useState } from 'react'

const DeleteModel = ({ model, setModel, setApiShow, searchById, apiData, setSearchById }) => {
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});
    const [userData, setUserData] = useState({
        id: '',
        bookName: '',
        bookDesc: '',
        bookAuthor: '',
        noOfPages: '',
        bookCategory: '',
        bookPrice: '',
        releasedYear: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        let res;
        let filteredData = [];

        if (searchById == "deleteById") {
            if (userData.id === "" || isNaN(userData.id)) {
                setErrors(prevErrors => ({ ...prevErrors, id: isNaN(userData.id) ? "Please enter a valid number id" : "Please enter id" }));
              } else {
                const filteredData = apiData.filter((item) => item.id != userData.id);
                if (apiData.length >= userData.id) {
                  await axios.delete(`http://localhost:5000/books/${userData.id}`);
                  setApiShow(filteredData);
                  setModel(false);
                  setUserData({});
                  setSearchById("");
                } else {
                  setError("book not found");
                }
              }              
        } else if (searchById == "deleteByBookName") {
            res = await axios.get(`http://localhost:5000/books/?bookName=${userData.bookName}`);
            if(userData.bookName){
                if (res.data.length == 1) {
                    const bookId = res.data[0].id;
                    await axios.delete(`http://localhost:5000/books/${bookId}`);
                    filteredData = apiData.filter((item) => item.id !== bookId);
                    if (filteredData.length > 0) {
                        setApiShow(filteredData);
                        setModel(false);
                        setUserData({});
                        setSearchById("");
                    } else {
                        setError("book not found");
                    }
                } else {
                    setError("book not found");
                }
            } else {
                setErrors(prevErrors => ({ ...prevErrors, bookName: "Please enter book name" }));
            }
        } else if (searchById == "deleteByBookDescAndAuthor") {
            res = await axios.get(`http://localhost:5000/books/?bookAuthor=${userData.bookAuthor}&bookDesc=${userData.bookDesc}`);
            if(!userData.bookAuthor){
                setErrors(prevErrors => ({ ...prevErrors, bookAuthor: "Please enter book author" }));
            }
            if(!userData.bookDesc){
                setErrors(prevErrors => ({ ...prevErrors, bookDesc: "Please enter book desc" }));
            }
            if(userData.bookAuthor && userData.bookDesc){
                if (res.data.length == 1) {
                    const bookId = res.data[0].id;
                    await axios.delete(`http://localhost:5000/books/${bookId}`);
                    filteredData = apiData.filter((item) => item.id !== bookId);
                    if (filteredData.length > 0) {
                        setApiShow(filteredData);
                        setModel(false);
                        setUserData({});
                        setSearchById("");
                    } else {
                        setError("book not found");
                    }
                } else {
                    setError("book not found");
                }
            }
        } else if (searchById == "deleteByBookNameAndCategory") {
            res = await axios.get(`http://localhost:5000/books/?bookName=${userData.bookName}&bookCategory=${userData.bookCategory}`);
            if(!userData.bookName){
                setErrors(prevErrors => ({ ...prevErrors, bookName: "Please enter book author" }));
            }
            if(!userData.bookCategory){
                setErrors(prevErrors => ({ ...prevErrors, bookCategory: "Please enter book desc" }));
            }
            if(userData.bookName && userData.bookCategory){
                if (res.data.length == 1) {
                    const bookId = res.data[0].id;
                    await axios.delete(`http://localhost:5000/books/${bookId}`);
                    filteredData = apiData.filter((item) => item.id !== bookId);
                    if (filteredData.length > 0) {
                        setApiShow(filteredData);
                        setModel(false);
                        setUserData({});
                        setSearchById("");
                    } else {
                        setError("book not found");
                    }
                } else {
                    setError("book not found");
                }
            }
        }
    }

    const handleChange = (e) => {
        let { name, value } = e.target;
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        setUserData(prevState => ({ ...prevState, [name]: value }));
    }
    const handleBlur = (e) => {
        const { name, value } = e.target;
        const errorMessages = {
            id: "Please enter id",
            bookName: 'Please enter book name',
            bookDesc: 'Please enter book description',
            bookAuthor: 'Please enter book author',
            bookCategory: 'Please enter book categories',
        };
        const errorMessage = value === '' ? errorMessages[name] : '';
        setErrors(prevErrors => ({ ...prevErrors, [name]: errorMessage }));
    }

    return (
        <>
            <div id="authentication-modal" aria-hidden="true" className={`${model ? "flex" : "hidden"} flex overflow-x-hidden overflow-y-auto bg-gradient-to-r from-gray-500/50 to-gray-500/50 fixed h-modal md:h-full top-4 left-0 right-0 md:inset-0 z-50 justify-center items-center`}>
                <div className="relative w-full max-w-md px-4 h-full md:h-auto">
                    <div className="bg-white rounded-lg shadow relative dark:bg-gray-700">
                        <div className="flex justify-end p-2">
                            <button
                                onClick={() => {
                                    setModel(false)
                                    setError("")
                                    setUserData({})
                                    setSearchById("")
                                    setUserData({})
                                    setErrors({
                                        id: '',
                                        bookName: '',
                                        bookDesc: '',
                                        bookAuthor: '',
                                        bookCategory: '',
                                    })
                                }}
                                type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </button>
                        </div>
                        <form className="space-y-6 px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8">
                            {
                                searchById == "deleteById" && (
                                    <>
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Delete By Id</h3>
                                        <div className='relative'>
                                            <label htmlFor="id" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Book Id</label>
                                            <input type="text" name="id" onBlur={handleBlur} onChange={handleChange} value={userData.id} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter book id" required="" />
                                            {errors.id && <span className='absolute bottom-[-20px] left-0 text-red-500 text-sm dark:text-red-400'>{errors.id}</span>}
                                        </div>
                                    </>
                                )
                            }
                            {
                                searchById == "deleteByBookDescAndAuthor" && (
                                    <>
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Delete by desc and author</h3>
                                        <div className='relative'>
                                            <label htmlFor="bookDesc" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Book Desc</label>
                                            <input type="text" name="bookDesc" onBlur={handleBlur} onChange={handleChange} value={userData.bookDesc} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter book name" required="" />
                                            {errors.bookDesc && <span className='absolute bottom-[-20px] left-0 text-red-500 text-sm dark:text-red-400'>{errors.bookDesc}</span>}
                                        </div>
                                        <div className='relative'>
                                            <label htmlFor="bookAuthor" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Book Author</label>
                                            <input type="text" name="bookAuthor" onBlur={handleBlur} onChange={handleChange} value={userData.bookAuthor} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter book author" required="" />
                                            {errors.bookAuthor && <span className='absolute bottom-[-20px] left-0 text-red-500 text-sm dark:text-red-400'>{errors.bookAuthor}</span>}
                                        </div>
                                    </>
                                )
                            }
                            {
                                searchById == "deleteByBookNameAndCategory" && (
                                    <>
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Delete by name and category</h3>
                                        <div className='relative'>
                                            <label htmlFor="bookName" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Book Name</label>
                                            <input type="text" name="bookName" onBlur={handleBlur} onChange={handleChange} value={userData.bookName} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter book name" required="" />
                                            {errors.bookName && <span className='absolute bottom-[-20px] left-0 text-red-500 text-sm dark:text-red-400'>{errors.bookName}</span>}
                                        </div>
                                        <div className='relative'>
                                            <label htmlFor="bookCategory" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Book Categories</label>
                                            <input type="text" name="bookCategory" onBlur={handleBlur} onChange={handleChange} value={userData.bookCategory} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter book categories" required="" />
                                            {errors.bookCategory && <span className='absolute bottom-[-20px] left-0 text-red-500 text-sm dark:text-red-400'>{errors.bookCategory}</span>}
                                        </div>
                                    </>
                                )
                            }
                            {
                                searchById == "deleteByBookName" && (
                                    <>
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Delete by book name</h3>
                                        <div className='relative'>
                                            <label htmlFor="bookName" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Book Name</label>
                                            <input type="text" name="bookName" onBlur={handleBlur} onChange={handleChange} value={userData.bookName} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter book name" required="" />
                                            {errors.bookName && <span className='absolute bottom-[-20px] left-0 text-red-500 text-sm dark:text-red-400'>{errors.bookName}</span>}
                                        </div>
                                    </>
                                )
                            }
                            {
                                error && (
                                    <p className="text-red-500 text-sm dark:text-red-400">
                                        Book not found
                                    </p>
                                )
                            }
                            <button onClick={handleSubmit} type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeleteModel