import Sidebar from "../Components/Sidebar";

export default function Risk() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 p-10 w-full text-white">
        <h1 className="text-3xl font-bold mb-6">Risk Alerts</h1>

        <div className="bg-gray-900 p-6 rounded-lg">
          <p>No alerts right now.</p>
        </div>
      </div>
    </div>
  );
}