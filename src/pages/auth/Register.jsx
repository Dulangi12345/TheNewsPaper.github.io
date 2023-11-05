import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, collection , addDoc, setDoc , getDoc  } from 'firebase/firestore/lite';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            if (user) {
                await updateProfile(user, {
                    displayName: name
                });
    
                // Save user details to Firestore, including the role
                const userRef = collection(db, "users"); 
                await addDoc(userRef, {
                    uid: user.uid,
                    name: name,
                    email: email,
                    role: "user" 
                });
    
                // Send email verification
                //await sendEmailVerification(user);
            }
        } catch (error) {
            switch (error.code) {
                case "auth/email-already-in-use":
                    setError("Email already in use");
                    break;
                case "auth/missing-email":
                    setError("Please enter an email address");
                    break;
                case "auth/invalid-email":
                    setError("Invalid email address");
                    break;
                case "auth/missing-password":
                    setError("Please enter a password");
                    break;
                case "auth/weak-password":
                    setError("Password must be at least 6 characters");
                    break;
                default:
                    setError(error.message);
            }
        }
    };

    return (
        <div>
            <section className="flex flex-col md:flex-row h-screen items-center">

                <div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
                    <img src="https://source.unsplash.com/random" alt="" className="w-full h-full object-cover" />
                </div>

                <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
                    flex items-center justify-center">

                    <div className="w-full h-100">


                        <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">Create an account</h1>

                        <form className="mt-6" onSubmit={handleRegister}>
                            {error && <p className="text-red-500">{error}</p>}
                            <div>
                                <label className="block text-gray-700">Email Address</label>
                                <input type="name" name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter Full Name" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" autoFocus required />
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700">Email Address</label>
                                <input type="email" name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter Email Address" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" autoFocus required />
                            </div>

                            <div className="mt-4">
                                <label className="block text-gray-700">Password</label>
                                <input type="password" name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter Password" minLength="6" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
              focus:bg-white focus:outline-none" required />
                            </div>

                            <div className="text-right mt-2">
                                <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700">Forgot Password?</a>
                            </div>

                            <button type="submit" className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg
            px-4 py-3 mt-6">Register</button>
                        </form>

                        <hr className="my-6 border-gray-300 w-full" />


                        <p className="mt-8">Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-700 font-semibold">Login</Link></p>


                    </div>
                </div>

            </section>
        </div>
    );
};

export default Register;
