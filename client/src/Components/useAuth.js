import {useState, useEffect} from 'react';
import axios from 'axios';

export default function useAuth(code) {
    const [accessTk, setAccessTk] = useState();
    const [refreshTk, setRefreshTk] = useState();
    const [expiresIn, setExpiresIn] = useState();
    

    useEffect(() => {
        
        axios.post('http://localhost:8888/login',{
            code,
        })
        .then(res => {
            console.log(res.data)
            setAccessTk(res.data.access_token)
            setRefreshTk(res.data.refresh_token)
            setExpiresIn(res.data.expires_in)
            window.history.pushState({}, null, "/")
        }).catch(() => {window.location = "/"})
    }, [code])

    useEffect(() => {
        const timeout = setInterval(() => {

            if (!refreshTk || !expiresIn) return;
            axios.post('http://localhost:8888/refresh', {
                refreshTk
            }).then(res => {
                setAccessTk(res.data.access_token);
                setExpiresIn(res.data.expires_in);
            })
            
        }, (expiresIn - 60) * 1000)
        
        //prevents incorrect refresh if there is an error
        return () => clearInterval(timeout)
    }, [refreshTk, expiresIn])

    return accessTk;
}
