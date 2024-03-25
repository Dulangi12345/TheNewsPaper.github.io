import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import {
  doc,
  collection,
  addDoc,
  setDoc,
  getDoc,
} from "firebase/firestore/lite";
import photo from "../../assets/Login3.png";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [indexNumber, setIndexNumber] = useState("");

  const [phoneNo, setPhoneNo] = useState("");
  const [classOrCourse, setClassOrCourse] = useState("");
  const [invoice, setInvoice] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  const handleIndexNumber = (e) => {
    setIndexNumber(e.target.value);
  };

  const handlePhoneNo = (e) => {
    setPhoneNo(e.target.value);
  };

  const handleClassOrCourse = (e) => {
    setClassOrCourse(e.target.value);
  };

  const handleInvoice = (e) => {
    setInvoice(e.target.value);
  };

  const addPayment = async () => {
    try {
      const response = await fetch(
        " https://secure.myfees.lk/api/sch/payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentName: name,
            description: description,
            amount: amount,
            indexNumber: indexNumber,
            email: email,
            phoneNo: phoneNo,
            classOrCourse: classOrCourse,
            invoice: invoice,
          }),
        }
      );

      const status = response.status;
      console.log(status);
      await handleRegister(name, email, password);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginLoading(true);
    addPayment(
      studentName,
      description,
      amount,
      indexNumber,
      email,
      phoneNo,
      classOrCourse,
      invoice
    );
  };

  const handleRegister = async (name, email, password) => {
    // e.preventDefault();
    // setLoginLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (user) {
        await updateProfile(user, {
          displayName: name,
        });

        // Save user details to Firestore, including the role
        const userRef = collection(db, "users");
        await addDoc(userRef, {
          uid: user.uid,
          name: name,
          email: email,

          role: "user",
          description: description,
          amount: amount,
          indexNumber: indexNumber,
          phoneNo: phoneNo,
          classOrCourse: classOrCourse,
          invoice: invoice,
        });

        // Send email verification
        //await sendEmailVerification(user);
      }
      setSuccessMessage(
        "Account created successfully. You can now login to your account."
      );
      setLoginLoading(false);
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
      setLoginLoading(false);
    }
  };

  return (
    <div>
      <section className="flex flex-col md:flex-row h-screen items-center">
        <div className="bg-white hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
          <img src={photo} alt="" className="w-full h-full object-cover" />
        </div>

        <div
          className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
                    flex items-center justify-center"
        >
          <div className="w-full ">
            <h1 className="text-3xl md:text-3xl font-bold leading-tight mt-12 text-[#20615B]">
              Create an account
            </h1>

            <form className="mt-6 h-96"
             style={{
              overflow : "scroll"
             }}
             id="payment-form"
             onSubmit={handleSubmit} method="post">
              {error && <p className="text-red-500">{error}</p>}
              {successMessage && (
                <p className="text-green-500">{successMessage}</p>
              )}
              <div>
                <label className="block text-gray-700" for="studentName">
                  Name
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={name}
                  id="studentName"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Full Name"
                  className="w-full px-4 py-3 rounded-lg focus:border-[#20615B]  mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                  autoFocus
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700" for="email">
                  Email Address
                </label>
                <input
                  type="text"
                  name="email"
                  value={email}
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email Address"
                  className="w-full px-4 py-3 rounded-lg focus:border-[#20615B]  mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                  autoFocus
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block text-gray-700">Password</label>

                <div className="flex flex-col  w-full rounded-lg items-end">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    minLength="6"
                    className="w-full px-4 py-3 rounded-lg focus:border-[#20615B]  mt-2 border focus:border-blue-500
              focus:bg-white focus:outline-none"
                    required
                  />

                  <button
                    type="button"
                    className="text-gray-600 cursor-pointer underline "
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div class="mt-4">
                <label for="description" className="block text-gray-700">
                  Affliated University or Institute
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg focus:border-[#20615B]  mt-2 border focus:border-blue-500
                  focus:bg-white focus:outline-none"
                  id="description"
                  name="description"
                  placeholder="Enter Affliated University or Institute"
                  onChange={handleDescription}
                  required
                />
              </div>
              <div class="mt-4">
                <label for="amount" className="block text-gray-700">Payment Amount</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg focus:border-[#20615B]  mt-2 border focus:border-blue-500
                  focus:bg-white focus:outline-none"
                  id="amount"
                  name="amount"
                  placeholder="Enter Payment Amount"
                  onChange={handleAmount}
                  required
                />
              </div>
              <div class="mt-4">
                <label for="indexNumber" className="block text-gray-700">Index number</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg focus:border-[#20615B]  mt-2 border focus:border-blue-500
                  focus:bg-white focus:outline-none"
                  id="indexNumber"
                  name="indexNumber"
                  placeholder="Enter index number"
                  onChange={handleIndexNumber}
                  required
                />
              </div>

              <div class="mt-4">
                <label for="phoneNo" className="block text-gray-700">Mobile Number</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg focus:border-[#20615B]  mt-2 border focus:border-blue-500
                  focus:bg-white focus:outline-none"
                  id="phoneNo"
                  name="phoneNo"
                  placeholder="Enter Mobile Number"
                  onChange={handlePhoneNo}
                />
              </div>
              <div class="mt-4">
                <label for="classOrCourse" className="block text-gray-700">Payment Category</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg focus:border-[#20615B]  mt-2 border focus:border-blue-500
                  focus:bg-white focus:outline-none"
                  id="classOrCourse"
                  name="classOrCourse"
                  placeholder="Enter Payment Category"
                  onChange={handleClassOrCourse}
                  required
                />
              </div>
              <div class="mt-4">
                <label for="invoice" className="block text-gray-700">Invoice Number</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg focus:border-[#20615B]  mt-2 border focus:border-blue-500
                  focus:bg-white focus:outline-none"
                  id="invoice"
                  name="invoice"
                  placeholder="Enter Invoice Number"
                  onChange={handleInvoice}
                />
              </div>
              <input type="hidden" id="apiKey" value=""    />

              {/* <div className="text-right mt-2">
                                <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700">Forgot Password?</a>
                            </div> */}

              <button
              onClick={
                handleSubmit
              }
                type="submit"
                className="w-full block bg-black hover:bg-[#20615B] text-white font-semibold rounded-lg px-4 py-3 mt-6"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <div className="flex items-center justify-center">
                    <span className="mr-2 text-white">Registering...</span>
                    <div className="animate-spin h-4 w-3.5 border-t-2 border-b-2 border-white rounded-full"></div>
                  </div>
                ) : (
                  "Register"
                )}
              </button>
            </form>

            <hr className="my-6 border-gray-300 w-full" />

            <p className="mt-8">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-500 hover:text-blue-700 font-semibold"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
