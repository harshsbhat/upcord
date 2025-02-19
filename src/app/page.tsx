import { redirect } from "next/navigation"
import { getTennant } from "@/lib/getTennant"
 
export default async function ServerComponent() {
    const { organizationId } = await getTennant()
    if(organizationId){
        redirect("/threads")
    }
    else {
        redirect("/onboarding")
    }
}