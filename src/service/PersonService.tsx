import axios from "axios";

const getPerson = async (name: string) => {
    return await axios.get('http://localhost:8000/person', {params: {name: name}})
}

export default getPerson