import { getTennant } from "@/lib/getTennant"
 
export default async function ServerComponent() {
    const user =  await getTennant()
    return (
        <div>
            <h1>Welcome {JSON.stringify(user)}</h1>
        </div>
    )
}