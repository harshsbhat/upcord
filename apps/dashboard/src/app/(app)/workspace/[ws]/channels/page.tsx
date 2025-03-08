import { getTenant } from "@/lib/getTenant";

export default async function HelloWorld() {
    const tenantId = await getTenant()
    console.log(tenantId)
    return (
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Channels/page! 🌍</h1>
      </div>
    );
  }
  