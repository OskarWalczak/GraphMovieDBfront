import axios from "axios";

const getMovie = async (title: string) => {
    return await axios.get('http://localhost:8000/movie', {params: {title: title}})
}

export default getMovie