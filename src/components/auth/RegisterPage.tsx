import { ChangeEvent, FormEvent, useState } from "react";
import Logo from "../logo";
import { User } from "../../lib/types";

const INSTRUMENTS = [
  'vocals',
  'guitar',
  'bass',
  'drums',
  'keyboard',
  'saxophone',
  'other'
];

type RegisterPageProps = {
  navigateTo: (page: string) => void;
  onRegister: (userData: User) => void;
}

const RegisterPage = (props: RegisterPageProps) => {
  const { onRegister, navigateTo } = props;
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    instrument: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const mockUser = {
        id: Math.floor(Math.random() * 10000),
        username: formData.username,
        instrument: formData.instrument,
        role: 'player'
      } as User;
      setTimeout(() => {
        onRegister(mockUser);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Registration error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="">
            <h1 className="text-[#6E6D6D] text-xl font-light">Welcome to JaMoveo</h1>
            <h2 className="text-4xl font-bold pl-1 text-[#937100]">Register</h2>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 px-4 py-3 rounded-jamoveo text-center" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="mt-1 block w-full px-4 py-3 bg-jamoveo-input-bg border border-jamoveo-input-border rounded-jamoveo text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-jamoveo-primary focus:border-transparent"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="instrument" className="block text-sm font-medium text-gray-700">
                  Your instrument*
                </label>
                <select
                  id="instrument"
                  name="instrument"
                  required
                  className="mt-1 block w-full px-4 py-3 bg-jamoveo-input-bg border border-jamoveo-input-border rounded-jamoveo text-gray-900 focus:outline-none focus:ring-2 focus:ring-jamoveo-primary focus:border-transparent"
                  value={formData.instrument}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select your instrument</option>
                  {INSTRUMENTS.map(instrument => (
                    <option key={instrument} value={instrument}>
                      {instrument.charAt(0).toUpperCase() + instrument.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-4 py-3 bg-jamoveo-input-bg border border-jamoveo-input-border rounded-jamoveo text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-jamoveo-primary focus:border-transparent"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-jamoveo text-white font-medium bg-jamoveo-primary hover:bg-jamoveo-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jamoveo-primary shadow-jamoveo"
              >
                {isLoading ? 'Creating account...' : 'Register'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-jamoveo-primary font-medium hover:text-jamoveo-accent"
                  onClick={() => navigateTo('login')}
                >
                  Login here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden lg:block lg:w-1/2">
        <img
          src="/bg-register.webp"
          alt="Musicians playing together"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default RegisterPage;