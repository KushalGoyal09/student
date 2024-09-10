import { Link } from 'react-router-dom';

const Home = () => {
  const links = [
    { path: '/', label: 'Home' },
    { path: '/login', label: 'Login' },
    { path: '/admin/login', label: 'Admin Login' },
    { path: '/admin/add-mentor', label: 'Add Mentor' },
    { path: '/add-student', label: 'Add Student' },
    { path: '/admin/mentors', label: 'Mentors' },
    { path: '/target', label: 'Add Target' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to Our App</h1>
      <nav className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className="block w-full py-2 px-4 text-left text-gray-700 hover:bg-blue-500 hover:text-white rounded transition duration-150 ease-in-out"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Home;