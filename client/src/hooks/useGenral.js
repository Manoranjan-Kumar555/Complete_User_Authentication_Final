import { useState } from "react";
import { useNavigate } from "react-router-dom"

const useGenral = () =>{
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    return{
        navigate,
        setLoading,
        loading
    }
}

export default useGenral;