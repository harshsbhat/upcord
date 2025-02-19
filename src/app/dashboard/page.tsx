import { auth } from "@/lib/auth"
import { getTennant } from "@/lib/getTennant"
import { headers } from "next/headers"
 
export default async function ServerComponent() {
    const user =  await getTennant()
    return (
        <div>
            <h1>Welcome {JSON.stringify(user)}</h1>
        </div>
    )
}