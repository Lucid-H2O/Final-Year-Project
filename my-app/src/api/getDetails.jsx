import axios from "axios";

const getDetails = async (app_id) => {
    try {
        const url = `http://127.0.0.1:5000/sentiment/${app_id}`;
        const { data: res } = await axios.get(url);
        console.log(res)

        return res;
        
    } catch (error) {
        console.log("api")
       console.log(error)
    }
  };
  
  export default getDetails;