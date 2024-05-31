import { createContext, useCallback, useEffect, useState } from "react";
import { postRequest, getRequest } from "../utils/services";
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
        e.preventDefault();
        setIsLoginLoading(true);
        setLoginError(null);

        const response = await postRequest(`${baseUrl}/login/`, JSON.stringify(loginInfo));

        setIsLoginLoading(false);
        if (response.error) return setLoginError(response);

        localStorage.setItem("User", JSON.stringify(response['user']));
        setUser(response['user']);
    }, [loginInfo])

    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info);
    }, []);

    const registerUser = useCallback( async(e) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);

        const response = await postRequest(`${baseUrl}/register/`, JSON.stringify(registerInfo));

        setIsRegisterLoading(false);
        if (response.error) return setRegisterError(response);

        localStorage.setItem("User", JSON.stringify(response['user']));
        setUser(response['user']);
    }, [registerInfo]);

    const logoutUser = useCallback( async(e) => {
        localStorage.removeItem("User");
        setUser(null);
        const response = await getRequest(`${baseUrl}/logout/`)
    }, []);

    return <AuthContext.Provider value = {{user, 
                registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading,
                loginInfo, updateLoginInfo, loginError, loginUser, isLoginLoading,
                logoutUser}} >
        {children}
    </AuthContext.Provider>
};
