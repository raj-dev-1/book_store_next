"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Model = ({ model, setModel, twoFactor, setTwoFactor, getApi }) => {
    const [showForm, setShowForm] = useState(false);
    const [apiUserData, setApiUserData] = useState([]);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});
    const [userData, setUserData] = useState({
        id: "",
        bookName: '',
        bookDesc: '',
        bookAuthor: '',
        noOfPages: '',
        bookCategory: '',
        bookPrice: '',
        releasedYear: '',
    });
    useEffect(() => {
        if (apiUserData.length > 0) {
            const {
                id,
                bookName,
                bookDesc,
                bookAuthor,
                noOfPages,
                bookCategory,
                bookPrice,
                releasedYear
            } = apiUserData[0];
            setUserData({
                id: id,
                bookName: bookName || '',
                bookDesc: bookDesc || '',
                bookAuthor: bookAuthor || '',
                noOfPages: noOfPages || '',
                bookCategory: bookCategory || '',
                bookPrice: bookPrice || '',
                releasedYear: releasedYear || ''
            });
        }
    }, [apiUserData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formIsValid = true;

        if (twoFactor) {
            formIsValid = userData.bookName !== "" && userData.bookAuthor !== "" ? true : false;
            setErrors({
              bookName: userData.bookName === "" ? 'Please enter book name' : '',
              bookAuthor: userData.bookAuthor === "" ? 'Please enter book author' : ''
            });
        } else {
            formIsValid = userData.bookName !== "" ? true : false;
            setErrors({
              bookName: userData.bookName === "" ? 'Please enter book name' : '',
              bookAuthor: ''
            });
        }
        console.log(formIsValid);
        let res;
        if (formIsValid) {
            if (!twoFactor) {
                res = await axios.get(`http://localhost:5000/books/?bookName=${userData.bookName}`);
            } else {
                res = await axios.get(`http://localhost:5000/books/?bookName=${userData.bookName}&bookAuthor=${userData.bookAuthor}`);
            }
            // const responseData = Array.isArray(res.data) ? res.data : [res.data];
            if (res.data.length == 1) {
                setShowForm(true);
                setApiUserData(res.data);
                setUserData({});
            } else {
                setError(`${twoFactor ? "book and author not found" : "book not found"}`);
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
            bookName: 'Please enter book name',
            bookDesc: 'Please enter book description',
            bookAuthor: 'Please enter book author',
            noOfPages: 'Please enter book no of pages',
            bookCategory: 'Please enter book categories',
            bookPrice: 'Please enter book price',
            releasedYear: 'Please enter book release year'
        };
        const errorMessage = value === '' ? errorMessages[name] : '';
        setErrors(prevErrors => ({ ...prevErrors, [name]: errorMessage }));
    }

    const updateData = async () => {
        console.log("upafted");
        try {
            const res = await axios.patch(`http://localhost:5000/books/${userData.id}`, userData);
            if (res.data) {
                setModel(false);
                setTwoFactor(false);
                setShowForm(false);
                setApiUserData(res.data);
                getApi();
            }
        } catch (error) {
            console.error("Error updating data:", error);
        }
    }

    const handleFinalChange = (e) => {
        e.preventDefault();
        const newErrors = {};

        Object.keys(userData).forEach((key) => {
            if (userData[key] === '' || (Array.isArray(userData[key]) && userData[key].length === 0)) {
                newErrors[key] = `Please enter ${key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()}`;
            }
        });

        // Check if form is valid
        const formIsValid = Object.keys(newErrors).length === 0;

        if (formIsValid) {
            updateData();
            setUserData({
                id: "",
                bookName: '',
                bookDesc: '',
                bookAuthor: '',
                noOfPages: '',
                bookCategory: '',
                bookPrice: '',
                releasedYear: '',
            });
        } else {
            setErrors(newErrors);
        }
    }

    return (
        <>
            <div id="authentication-modal" aria-hidden="true" className={`${model ? "flex" : "hidden"} flex overflow-x-hidden overflow-y-auto bg-gradient-to-r from-gray-500/50 to-gray-500/50 fixed h-modal md:h-full top-4 left-0 right-0 md:inset-0 z-50 justify-center items-center`}>
                <div className="relative w-full max-w-md px-4 h-full md:h-auto">
                    <div className="  bg-white rounded-lg shadow relative dark:bg-gray-700">
                        <div className="flex justify-end p-2">
                            <button
                                onClick={() => {
                                    setModel(false)
                                    setTwoFactor(false)
                                    setShowForm(false)
                                    setError("")
                                    setErrors({
                                        id: "",
                                        bookName: '',
                                        bookDesc: '',
                                        bookAuthor: '',
                                        noOfPages: '',
                                        bookCategory: '',
                                        bookPrice: '',
                                        releasedYear: '',
                                    })
                                    setUserData({
                                        id: "",
                                        bookName: '',
                                        bookDesc: '',
                                        bookAuthor: '',
                                        noOfPages: '',
                                        bookCategory: '',
                                        bookPrice: '',
                                        releasedYear: '',
                                    });
                                }}
                                type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 
                                rounded-lg text-sm p-1.5 ml-auto inline-flex items-center
                                 dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </button>
                        </div>
                        {
                            !showForm && (
                                <form onSubmit={handleSubmit} className="space-y-6 px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8">
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">Update by name {twoFactor ? "and author" : ""}</h3>
                                    <div className='relative'>
                                        <label htmlFor="name" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Book Name</label>
                                        <input type="text" name='bookName' onBlur={handleBlur} onChange={handleChange} value={userData.bookName} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter book name" required="" />
                                        {errors.bookName && <span className='absolute bottom-[-20px] left-0 text-red-500 text-sm dark:text-red-400'>{errors.bookName}</span>}
                                    </div>
                                    {
                                        twoFactor && (
                                            <div className='relative'>
                                                <label htmlFor="bookAuthor" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Book Author</label>
                                                <input type="text" name="bookAuthor" onBlur={handleBlur} onChange={handleChange} value={userData.bookAuthor} id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter book name" required="" />
                                                {errors.bookAuthor && <span className='absolute bottom-[-20px] left-0 text-red-500 text-sm dark:text-red-400'>{errors.bookAuthor}</span>}
                                            </div>
                                        )
                                    }
                                    {
                                        error && (
                                            <p className="text-red-500 text-sm dark:text-red-400">
                                                {error}
                                            </p>
                                        )
                                    }
                                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700">Submit</button>
                                </form>
                            )
                        }
                        {
                            showForm && (
                                <form onSubmit={handleFinalChange} className="space-y-6 px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8">
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">Update By name {twoFactor ? "and author" : ""}</h3>
                                    <div className='relative'>
                                        <label htmlFor="bookName" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Book Name</label>
                                        <input type="text" onChange={handleChange} onBlur={handleBlur} value={userData.bookName} name="bookName" id="bookName" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter book name" required="" />
                                        {errors.bookName && <span className='absolute bottom-[-20px] left-0 text-red-500 text-sm dark:text-red-400'>{errors.bookName}</span>}
                                    </div>
                                    <div className='relative'>
                                        <label htmlFor="bookDesc" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Book Desc</label>
                                        <input type="text" onChange={handleChange} onBlur={handleBlur} value={userData.bookDesc} name="bookDesc" id="bookDesc" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter book name" required="" />
                                        {errors.bookDesc && <span className='absolute bottom-[-20px] left-0 text-red-500 text-sm dark:text-red-400'>{errors.bookDesc}</span>}
                                    </div>
                                    <div className='relative'>
                                        <label htmlFor="bookAuthor" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Book Author</label>
                                        <input type="text" onChange={handleChange} onBlur={handleBlur} value={userData.bookAuthor} name="bookAuthor" id="bookAuthor" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter book name" required="" />
                                        {errors.bookAuthor && <span className='absolute bottom-[-20px] left-0 text-red-500 text-sm dark:text-red-400'>{errors.bookAuthor}</span>}
                                    </div>
                                    <div className='relative'>
                                        <label htmlFor="noOfPages" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">No og Page</label>
                                        <input type="text" onChange={handleChange} onBlur={handleBlur} value={userData.noOfPages} name="noOfPages" id="noOfPages" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter book name" required="" />
                                        {errors.noOfPages && <span className='absolute bottom-[-20px] left-0 text-red-500 text-sm dark:text-red-400'>{errors.noOfPages}</span>}
                                    </div>
                                    <div className='relative'>
                                        <label htmlFor="bookCategory" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Book Category</label>
                                        <input type="text" onChange={handleChange} onBlur={handleBlur} value={userData.bookCategory} name="bookCategory" id="bookCategory" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter book name" required="" />
                                        {errors.bookCategory && <span className='absolute bottom-[-20px] left-0 text-red-500 text-sm dark:text-red-400'>{errors.bookCategory}</span>}
                                    </div>
                                    <div className='relative'>
                                        <label htmlFor="bookPrice" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Book Price</label>
                                        <input type="number" onChange={handleChange} onBlur={handleBlur} value={userData.bookPrice} name="bookPrice" id="bookPrice" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter book name" required="" />
                                        {errors.bookPrice && <span className='absolute bottom-[-20px] left-0 text-red-500 text-sm dark:text-red-400'>{errors.bookPrice}</span>}
                                    </div>
                                    <div className='relative'>
                                        <label htmlFor="releasedYear" className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Book Released Year</label>
                                        <input type="number" onChange={handleChange} onBlur={handleBlur} value={userData.releasedYear} name="releasedYear" id="releasedYear" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter book name" required="" />
                                        {errors.releasedYear && <span className='absolute bottom-[-20px] left-0 text-red-500 text-sm dark:text-red-400'>{errors.releasedYear}</span>}
                                    </div>
                                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 ">Submit</button>
                                </form>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Model