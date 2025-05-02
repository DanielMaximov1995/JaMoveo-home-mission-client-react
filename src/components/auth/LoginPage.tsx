import { ChangeEvent, FormEvent, useState } from "react";
import { User } from "../../lib/types";
import Logo from "../logo";

type LoginPageProps = {
    onLogin : (userData : User) => void;
    navigateTo : (page : string) => void;
}

const LoginPage = (props : LoginPageProps) => {
    const { onLogin , navigateTo } = props
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handleAdminLogin = () => {
        setFormData({
            username: 'admin',
            password: 'admin123'
        });
    };
    
    const handleSubmit = async (e : FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            const isAdmin = formData.username.toLowerCase().includes('admin');
            
            setTimeout(() => {
                const mockUser = {
                    id: Math.floor(Math.random() * 10000),
                    username: formData.username,
                    role: isAdmin ? 'admin' : 'player',
                    instrument: isAdmin ? null : 'guitar'
                } as User
                
                onLogin(mockUser);
                setIsLoading(false);
            }, 1000);
        } catch (err) {
            setError('שם משתמש או סיסמה שגויים');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="">
                        <h1 className="text-[#6E6D6D] text-xl font-light">Welcome to JaMoveo</h1>
                        <h2 className="text-4xl font-bold pl-1 text-[#937100]">Log in</h2>
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
                                Enter your Username*
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="mt-1 block w-full px-4 py-3 bg-jamoveo-input-bg border border-jamoveo-input-border rounded-jamoveo text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-jamoveo-primary focus:border-transparent"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Enter your Password*
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="mt-1 block w-full px-4 py-3 bg-jamoveo-input-bg border border-jamoveo-input-border rounded-jamoveo text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-jamoveo-primary focus:border-transparent"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 text-black border border-transparent rounded-jamoveo font-semibold bg-jamoveo-primary hover:bg-jamoveo-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jamoveo-primary shadow-jamoveo"
                            >
                                {isLoading ? 'Connecting...' : 'Log in'}
                            </button>
                        </div>

                        <div className="text-center space-y-3">
                            <p className="text-gray-600">
                            Don’t have an account?{' '}
                                <button
                                    type="button"
                                    className="text-jamoveo-primary font-medium hover:text-jamoveo-accent"
                                    onClick={() => navigateTo('register')}
                                >
                                    <span className="font-semibold">Register</span>
                                </button>
                            </p>
                            
                            <button
                                type="button"
                                className="text-sm text-gray-500 hover:text-gray-700"
                                onClick={handleAdminLogin}
                            >
                                התחבר כאדמין (הדגמה)
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="hidden lg:block lg:w-1/2">
                <img
                    src="/bg-login.webp"
                    alt="Musicians playing together"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default LoginPage;