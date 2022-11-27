import { json, useLoaderData } from "react-router-dom"

interface Data {
    hello: string
}

export const homeLoader: () => Promise<Data> = async () => {
    return {hello: "world"}
}

const HomePage = () => {
    const data = useLoaderData() as Data;
    
    return(
        <div>
            <h1>Hello {data.hello}</h1>
        </div>
    )
}

export default HomePage;