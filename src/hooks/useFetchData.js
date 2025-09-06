import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const useFetchData = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await api.get(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.data.success) {
                setData(response.data.subcategories || response.data.categories || response.data.routes || response.data.appModules || []);
            }
        } catch (error) {
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };
//DB--PASS-YXe88nPfjoyClq14||YXe88nPfjoyClq14
//mongodb+srv://bajajsajal3369_db_user:<db_password>@cluster0.bpepcyt.mongodb.net/
//sajal@admin.com ||admin123
//bajajsajal3369_db_user
    useEffect(() => {
        fetchData();
    }, [url]);

    return { data, setData, loading, refetch: fetchData };
};

export default useFetchData;
