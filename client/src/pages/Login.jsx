import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Code2, Mail, Lock, AlertCircle, Eye, EyeOff, Sparkles } from "lucide-react";
import { ButtonLoader } from "../components/Loader";
import { motion } from "framer-motion";

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    // Track mouse movement for parallax effect
    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 20;
        const y = (clientY / innerHeight - 0.5) * 20;
        setMousePosition({ x, y });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative"
            onMouseMove={handleMouseMove}
        >
            {/* Animated Background Elements */}
            <motion.div
                className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
                animate={{
                    x: mousePosition.x * 2,
                    y: mousePosition.y * 2,
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    scale: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    },
                    x: { duration: 0.3 },
                    y: { duration: 0.3 }
                }}
            />
            <motion.div
                className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
                animate={{
                    x: mousePosition.x * -1.5,
                    y: mousePosition.y * -1.5,
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    scale: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    },
                    x: { duration: 0.3 },
                    y: { duration: 0.3 }
                }}
            />
            <motion.div
                className="absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
                animate={{
                    x: mousePosition.x * 1,
                    y: mousePosition.y * 1,
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    scale: {
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    },
                    x: { duration: 0.3 },
                    y: { duration: 0.3 }
                }}
            />

            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}

            <motion.div 
                className="max-w-md w-full relative z-10"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    transform: `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`,
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Header */}
                <motion.div 
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-6">
                        <motion.div
                            animate={{ 
                                rotate: 360,
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                            }}
                        >
                            <Code2 className="h-12 w-12 text-blue-600" />
                        </motion.div>
                        <motion.span 
                            className="text-2xl font-bold text-gray-900"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            ProDevHub
                        </motion.span>
                    </Link>
                    <motion.h2 
                        className="text-3xl font-bold text-gray-900 mb-2"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Sign in to your account
                    </motion.h2>
                    <motion.p 
                        className="text-gray-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Or{' '}
                        <Link 
                            to='/register' 
                            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                        >
                            create a new account
                        </Link>
                    </motion.p>
                </motion.div>

                {/* Form Card */}
                <motion.div 
                    className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/20"
                    initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
                    whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                    }}
                    style={{
                        transformStyle: "preserve-3d",
                    }}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Alert */}
                        {error && (
                            <motion.div 
                                className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start space-x-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium">Error</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Email Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <motion.div 
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </motion.div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </motion.div>

                        {/* Password Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <Link 
                                    to="/forgot-password" 
                                    className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <motion.div 
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </motion.div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                                    placeholder="Enter your password"
                                />
                                <motion.button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Remember Me */}
                        <motion.div 
                            className="flex items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me for 30 days
                            </label>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 overflow-hidden relative"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            whileHover={{ 
                                scale: 1.05,
                                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)"
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "100%" }}
                                transition={{ duration: 0.6 }}
                            />
                            <span className="relative z-10 flex items-center space-x-2">
                                {loading ? (
                                    <>
                                        <ButtonLoader size="sm" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5" />
                                        <span>Sign in</span>
                                    </>
                                )}
                            </span>
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <motion.div 
                        className="mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <motion.button
                                type="button"
                                className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center justify-center space-x-2"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.0 }}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span>Google</span>
                            </motion.button>
                            <motion.button
                                type="button"
                                className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center justify-center space-x-2"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1 }}
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                <span>GitHub</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Footer */}
                <motion.p 
                    className="mt-8 text-center text-sm text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    Protected by industry-standard encryption
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Login;