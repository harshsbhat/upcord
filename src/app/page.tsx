
import { redirect } from "next/navigation";

export default function MyApp() {
	return (
    redirect("/auth/signup")
	);
}
