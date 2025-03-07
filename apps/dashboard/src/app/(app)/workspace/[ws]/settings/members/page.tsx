import { getTenant } from "@/lib/getTenant";
import MemberManagement from "./member-management";

export default async function HelloWorld() {
    const tenantId = await getTenant()
    console.log(tenantId)
    return (
      <div>
        <MemberManagement />
      </div>
    );
  }
  