import { NextApiRequest, NextApiResponse } from "next";

export default (request: NextApiRequest, response: NextApiResponse) => {
    const  id = request.query; // http://localhost:3000/api/users/edit/1/bananas
    console.log(id);
    const users =
        [
            { id: 1, name: "Hemerson" },
            { id: 2, name: "Bruno" },
            { id: 3, name: "Maria" }
        ]
        return response.json(users)
}