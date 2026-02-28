export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Restaurant System</h1>
        <p className="text-lg text-gray-600 mb-8">
          Order Management Platform
        </p>
        <a
          href="/login"
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}
