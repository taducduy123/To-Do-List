import React, {useEffect} from 'react'
import {useState} from 'react'


function FetchData(){
    const [records, setRecords] = useState([])

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/task')
            .then(response => response.json())
            .then(data => setRecords(data))
            .catch(err => console.log(err))
    }, []);

    console.log(records)

    return (
        // continue here
    )
}

export default FetchData