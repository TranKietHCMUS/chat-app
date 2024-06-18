import { createContext, useCallback, useEffect, useState } from "react";
import { postRequest, getRequest, postLoginOrRegister } from "../utils/services";
import { baseUrl } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem("User")
        setUser(JSON.parse(user))
    }, [])

    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [loginInfo, setLoginInfo] = useState({
        username: "",
        password: ""
    });
    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        email: "",
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        gender: "",
        phone_number: "",
        birthday: ""
    });

    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info);
    }, []);

    const loginUser = useCallback( async(e) => {
        e.preventDefault(); // khi ham nay dc goi thi trang web ko duoc load lai, van dung yen
        setIsLoginLoading(true);
        setLoginError(null);

        const response = await postLoginOrRegister(`${baseUrl}/auth/login/`, JSON.stringify(loginInfo));

        setIsLoginLoading(false);
        if (response.error) return setLoginError(response);

        localStorage.setItem("User", JSON.stringify(response['user']));
        localStorage.setItem('token', response['accessToken']);
        setUser(response['user']);
    }, [loginInfo])

    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info);
    }, []);

    const registerUser = useCallback( async(e) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);

        const response = await postLoginOrRegister(`${baseUrl}/auth/register/`, JSON.stringify(registerInfo));

        setIsRegisterLoading(false);
        if (response.error) return setRegisterError(response);

    }, [registerInfo]);

    const logoutUser = useCallback( async(e) => {
        const response = await getRequest(`${baseUrl}/auth/logout?user_id=${user?.id}`);
        if (response?.error) {
            console.log(response?.error);
            return;
        }
        localStorage.removeItem("User");
        localStorage.removeItem("token");
        setUser(null);
    }, [user]);

    return <AuthContext.Provider value = {{user, 
                registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading,
                loginInfo, updateLoginInfo, loginError, loginUser, isLoginLoading,
                logoutUser}} >
        {children}
    </AuthContext.Provider>
};