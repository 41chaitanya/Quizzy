import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { loginApi, registerApi } from "../services/auth.api";
import { setUser } from "../auth.slice";

export const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (data) => {
        try {
            const response = await loginApi(data);
            dispatch(setUser(response.user));
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    const handleRegister = async (data) => {
        try {
            const response = await registerApi(data);
            dispatch(setUser(response.user));
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    return { handleLogin, handleRegister };
}