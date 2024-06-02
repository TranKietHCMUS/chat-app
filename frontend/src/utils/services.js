export const baseUrl = "http://127.0.0.1:8000/api";
import Cookies from 'js-cookie';

export const postRequest = async(url, body) => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
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
};

export const getRequest = async (url) => {
    console.log(Cookies.get())
    const response = await fetch(url, {
        method: "GET",
        credentials: 'include',
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