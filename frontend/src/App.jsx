import './App.css';
import { useUser } from "./contexts/UserContext";
import { signInWithGoogle, signOutUser } from "./controllers/AuthController";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter, Link } from "react-router-dom";

function Layout({ user, onSignOut }) {
  return (
    <>
      <header className="w-full flex flex-col items-center bg-green-100 py-4 mb-4 shadow">
        <nav className="w-full max-w-4xl flex justify-between items-center px-4">
          <div className="text-2xl font-bold text-green-700">Agrocare AI</div>
          <div className="flex gap-4 items-center">
            <Link to="/" className="underline">Home</Link>
            {user && <Link to="/history" className="underline">Results History</Link>}
            {user && (
              <button onClick={onSignOut} className="ml-4 bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-600">Sign out</button>
            )}
          </div>
        </nav>
        {user && (
          <div className="flex items-center gap-2 mt-2">
            <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full" />
            <span className="text-gray-700">{user.displayName}</span>
          </div>
        )}
      </header>
    </>
  );
}

function App() {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Layout user={user} onSignOut={signOutUser} />
        <main className="flex-1 flex flex-col items-center justify-center w-full px-2">
          {!user ? (
            <button
              onClick={signInWithGoogle}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
            >
              Sign in with Google
            </button>
          ) : (
            <AppRoutes user={user} />
          )}
          {!user && <div className="text-gray-600 mt-4">Sign in to use Agrocare AI features.</div>}
        </main>
        <footer className="w-full text-center py-4 bg-green-100 text-green-700 mt-8">
          &copy; {new Date().getFullYear()} Agrocare AI. All rights reserved.
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
