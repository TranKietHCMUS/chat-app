import { createContext, useCallback, useState } from "react";
import { postRequest, getRequest } from "../utils/services";
import { baseUrl } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
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

    const logoutUser = useCallback(() => {
        localStorage.removeItem("User");
        setUser(null);
    }, []);

    const [friendInfo, setFriendInfo] = useState({
        username1: "",
        username2: ""
    });
    const [findFriendError, setFindFriendError] = useState(null);
    const [isFriendLoading, setIsFriendLoading] = useState(false);

    const updateFriendInfo = useCallback((info) => {
        setFriendInfo(info);
    }, []);

    const findFriend = useCallback( async(e) => {
        e.preventDefault();
        setIsFriendLoading(true);
        setFindFriendError(null);

        console.log(friendInfo)

        const response = await getRequest(`${baseUrl}/chat/`, JSON.stringify(friendInfo));

        setIsFriendLoading(false);
        if (response.error) return setFindFriendError(response);
    }, [friendInfo])

    return <AuthContext.Provider value = {{user, 
                registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading,
                loginInfo, updateLoginInfo, loginError, loginUser, isLoginLoading,
                logoutUser,
                friendInfo, updateFriendInfo, findFriend, isFriendLoading, findFriendError}} >
        {children}
    </AuthContext.Provider>
};
