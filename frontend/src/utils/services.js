import {jwtDecode} from "jwt-decode"

export const baseUrl = "http://127.0.0.1:8000/api";
export const refreshUrl = "http://127.0.0.1:8000/api/token/refresh/";

export const postLoginOrRegister = async (url, body) => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
        body
    });
    const data = await response.json();

    if (!response.ok) {
        let message;
        if (data?.detail) // check xem co message nao hay ko
            message = data.detail;
        else
            message = data;

        return { error: true, message };
    }
    return data;
}

export const postRequest = async(url, body) => {
    let date = new Date();
    const decodedToken = jwtDecode(localStorage.token);
    if (decodedToken.exp < date.getTime() / 1000) {
        const res = await axios.get(refreshUrl, {
            withCredentials: true,
        })

        if (!res.ok) {
            let message;
            if (data?.detail)
                message = data.detail;
            else
                message = data;
    
            return { error: true, message };
        }

        localStorage.removeItem('token');
        localStorage.setItem('token', res['accessToken']);
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Token": `Bearer ${localStorage.token}` 
        },
        credentials: "include",
        body
    });
    const data = await response.json();

    if (!response.ok) {
        let message;
        if (data?.detail)
            message = data.detail;
        else
            message = data;

        return { error: true, message };
    }

    return data;
};

export const getRequest = async (url) => {
    let date = new Date();
    const decodedToken = jwtDecode(localStorage.token);
    if (decodedToken.exp < date.getTime() / 1000) {
        const res = await fetch(refreshUrl, {
            credentials: 'include'
        })

        localStorage.removeItem('token');
        localStorage.setItem('token', res['accessToken']);

        if (!res.ok) {
            let message;
            if (data?.detail)
                message = data.detail;
            else
                message = data;
    
            return { error: true, message };
        }
    };

    const response = await fetch(url, {
        credentials: 'include',
        headers: {
            "Token": `Bearer ${localStorage.token}` 
        }
    });

    const data = await response.json();

    if (!response.ok) {
        let message = "An error occured!";
        if (data?.detail) // check xem co message nao hay ko
            message = data.detail;
        else
            message = data;

        return { error: true, message };
    }

    return data;
}