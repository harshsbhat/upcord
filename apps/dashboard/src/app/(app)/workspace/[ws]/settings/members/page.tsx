import { getTenant } from "@/lib/getTenant";
import MemberManagement from "./member-management";
import { db } from "@upcord/db";

export default async function HelloWorld() {
    const tenantId = await getTenant()
    const invitations = await db.query.invitation.findMany({
      where: (table, { eq, ne }) => 
        eq(table.organizationId, tenantId) && ne(table.status, "canceled")
    });
    
    console.log(invitations)
    return (
      <div>
        <MemberManagement />
      </div>
    );
  }
  