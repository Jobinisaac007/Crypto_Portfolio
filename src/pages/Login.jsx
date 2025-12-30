export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
        
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back 👋
        </h1>

        <p className="text-gray-300 text-center mb-8">
          Login to manage your Crypto Portfolio
        </p>

        {/* Email */}
        <label className="text-gray-300 text-sm">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full p-3 mt-1 mb-4 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {/* Password */}
        <label className="text-gray-300 text-sm">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full p-3 mt-1 mb-6 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {/* Button */}
        <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold p-3 rounded-lg transition">
          Sign In
        </button>

        {/* Link */}
        <p className="text-center text-gray-400 text-sm mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-yellow-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}