import axios from 'axios';
import { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';

const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000'
});

const useAxiosSecure = () => {
    const { logOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Request Interceptor
        const reqInterceptor = axiosSecure.interceptors.request.use((config) => {
            const token = localStorage.getItem('access-token'); // Or use user?.accessToken
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        // 2. Response Interceptor
        const resInterceptor = axiosSecure.interceptors.response.use(
            (response) => response, 
            async (error) => {
                const status = error.response ? error.response.status : null;

                if (status === 401 || status === 403) {
                    await logOut();
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );

        // 3. Cleanup
        return () => {
            axiosSecure.interceptors.request.eject(reqInterceptor);
            axiosSecure.interceptors.response.eject(resInterceptor);
        };
    }, [logOut, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;