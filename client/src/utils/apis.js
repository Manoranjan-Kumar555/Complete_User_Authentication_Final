const apis = () =>{
    const local = "http://localhost:5050/";

    const list = {
        registerUser :`${local}user/register`
    }
    return list;
}

export default apis;