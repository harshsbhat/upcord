
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MyApp() {
	return (
    <main>
      <div className="flex items-center justify-center min-screen-h">
      <h1>
        Hi there
      </h1>
      </div>
    <div className="flex items-center justify-center min-screen-h">
      <Link href="/signup"><Button>Login</Button></Link>
    </div>
    </main>
	);
}
