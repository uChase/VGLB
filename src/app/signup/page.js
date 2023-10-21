"use client";
import makeAccount from "@/utils/MakeAccount";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useState } from "react";

require("dotenv").config();
const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA;

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const [captchaValue, setCaptchaValue] = useState(null);
  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const user = useSession({});

  useEffect(() => {
    console.log(user);
    if (user.status == "authenticated") {
      router.push("/");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!captchaValue) {
      setError("Please verify you are a human!");
      return;
    }

    try {
      await makeAccount(username, email, password);
      const credentials = { identifier: username, password: password };
      await signIn("credentials", {
        redirect: false,
        ...credentials,
      });
      router.refresh();
      router.push("/");
    } catch (error) {
      if (error + "" == "Error: User with this username already exists.") {
        setUsername("");
      } else {
        setEmail("");
      }
      setPassword("");
      setError(error + "");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen text-slate-800">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-100 mb-6">
          Create an account
        </h2>
        {error && <p className="text-center text-red-500 mb-6">{error}</p>}
      </div>
      <form onSubmit={handleSubmit} className="w-80 space-y-5">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
        <ReCAPTCHA sitekey={siteKey} onChange={handleCaptchaChange} />

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
        >
          Sign up
        </button>
      </form>
    </div>
  );
}
