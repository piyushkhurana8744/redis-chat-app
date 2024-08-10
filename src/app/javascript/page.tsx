"use client"

import React, { useEffect, useState, useRef } from 'react';
import { debounce } from './utils';



const Page = () => {
    const [search, setSearch] = useState<string>('');
    const countRef = useRef(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    // Create a debounced version of the logging function outside of useEffect
    const debouncedLog = debounce((search: string) => {
        console.log(search, countRef.current++);
    }, 1000);

    useEffect(() => {
        // Call the debounced function
        debouncedLog(search);

        // No need to cleanup the debounced function

    }, [search, debouncedLog]); // Add debouncedLog to the dependency array

    return (
        <div>
            <input  placeholder='Enter ...' onChange={handleChange} />
        </div>
    );
};

export default Page;
