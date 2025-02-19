
"use client"
import { redirect } from "next/navigation";
import { useListOrganizations } from "@/lib/auth-client"

export default function MyApp() {
  const { data: organizations } = useListOrganizations()
	return (
    <div>
      {JSON.stringify(organizations)}
    </div>
	);
}
