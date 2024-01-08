import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, collection, query, where, addDoc, setDoc, getDocs } from 'firebase/firestore/lite';
import { AuthContext } from "./AuthProvider";
import { set } from "mongoose";
import photo  from "../../assets/Login3.png";


const Login = () => {
    const { loginAuthContext } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);

            const user = auth.currentUser;

            if (user) {
                const userRef = collection(db, "users");
                const q = query(userRef, where("uid", "==", user.uid));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        const userData = doc.data();
                        if (userData.role === "admin") {
                            loginAuthContext(userData.role);
                            navigate("/admin/dashboard");
                        } else if (userData.role === "user") {
                            loginAuthContext(userData.role);
                            navigate("/");
                        } else {
                            loginAuthContext("");
                            navigate("/login");
                        }
                    });
                } else {
                    console.log("No matching documents found");
                }
            }
            setLoginLoading(false);
        } catch (error) {
            switch (error.code) {
                case "auth/invalid-login-credentials":
                    setError("Invalid email address or password");
                    break;
                case "auth/missing-password":
                    setError("Please enter a password");
                    break;
                case "auth/user-disabled":
                    setError("Your account has been disabled");
                    break;
                case "auth/invalid-email":
                    setError("Invalid email address");
                    break;
                case "auth/too-many-requests":
                    setError("Too many requests. Please try again later.");
                    break;
                case "auth/weak-password":
                    setError("Password must be at least 6 characters");
                    break;
                default:
                    setError(error.code);
            }
            setLoginLoading(false);
        }
    };



    return (
        <div>
            <section className="flex flex-col md:flex-row h-screen items-center ">

                <div className="bg-white hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
                    <img src={photo} alt="" className="w-full h-full object-cover p-16" />
                </div>

                <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
              flex items-center justify-center">

                    <div className="w-full h-100">


                        <h1 className="text-3xl md:text-3xl font-bold leading-tight mt-12 text-[#20615B]">Log in to your account</h1>

                        <form className="mt-6" onSubmit={handleLogin}>
                            {error && <p className="text-red-500">{error}</p>}
                            <div>
                                <label className="block text-gray-700 ">Email Address</label>
                                <input type="email" name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter Email Address" className="w-full px-4 py-3 rounded-lg bg-white mt-2 border focus:border-[#20615B] focus:bg-[white] focus:outline-none" autoFocus required />
                            </div>

                            <div className="mt-4">
                                <label className="block text-gray-700">Password</label>
                                <div className="flex flex-col  w-full rounded-lg items-end ">
                                    <input
                                        type={showPassword ? 'text' : 'password'}

                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter Password" className="w-full px-4 py-3 rounded-lg bg-white mt-2  
                      focus:bg-white focus:outline-none  border focus:border-[#20615B]" required

                                    />

                                    <button
                                        type="button"
                                        className="text-gray-600 cursor-pointer underline "
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>

                                </div>




                            </div>

                            {/* <div className="text-right mt-2">
                                <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700">Forgot Password?</a>
                            </div> */}

                            <button
                                type="submit"
                                className="w-full block bg-black hover:bg-[#20615B] text-white font-semibold rounded-lg px-4 py-3 mt-6 text-lg"
                                disabled={loginLoading}
                            >
                                {loginLoading ? (
                                    <div className="flex items-center justify-center">
                                        <span className="mr-2 text-white">Logging In...</span>
                                        <div className="animate-spin h-4 w-3.5 border-t-2 border-b-2 border-white rounded-full"></div>
                                    </div>
                                ) : (
                                    'Log In'
                                )
                                }
                            </button>

                        </form>

                        <hr className="my-6 border-gray-300 w-full" />

                        {/* <button type="button" className="w-full block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300">
                            <div className="flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="w-6 h-6" viewBox="0 0 48 48"><defs><path id="a" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" /></defs><clipPath id="b"><use xlinkHref="#a" overflow="visible" /></clipPath><path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" /><path clipPath="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" /><path clipPath="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" /><path clipPath="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" /></svg>
                                <span className="ml-4">
                                    Log in
                                    with
                                    Google</span>
                            </div>
                        </button> */}

                        <p className="mt-8">Dont have an account? <Link to="/register" className="text-black  hover:underline font-semibold">Register</Link></p>


                    </div>
                </div>

            </section>
        </div>
    );
};

export default Login;
