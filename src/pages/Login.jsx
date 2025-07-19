import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import fetchCountries from "../utils/fetchCountries";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  countryCode: z.string().min(1, "Select a country"),
  phone: z.string().min(10, "Enter valid phone"),
  otp: z.string(),
});

export default function LoginPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      countryCode: "",
      phone: "",
      otp: "",
    },
  });

  useEffect(() => {
    fetchCountries().then((c) => {
      setCountries(c);
      setLoading(false);
    });
  }, []);
  
  useEffect(() => {
    Object.values(errors).forEach((err) => {
      toast.error(err.message);
    });
  }, [errors]);

  const onSubmit = (data) => {
    if (!otpSent) {
      toast.success("OTP sent to " + data.countryCode + " " + data.phone);
      setOtpSent(true);
    } else {
      if (data.otp.length === 6) {
        toast.success("OTP Verified!");
        navigate("/chat/1752930361512");
      } else {
        toast.error("Invalid OTP");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-8 mx-auto">
      <h1 className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        Gemni
      </h1>
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 md:space-y-6"
          >
            <div className="p-6 sm:p-0 space-y-4 md:space-y-6 ">
              <h1 className="text-xl font-semibold text-center">User Login</h1>
              {!otpSent && (<>
              {loading ? (
                <p>Loading countries...</p>
              ) : (
                <>
                  <label
                    for="email"
                    class="block  text-base font-medium text-gray-900 dark:text-white"
                  >
                    Select country
                  </label>
                  <select
                    {...register("countryCode")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    disabled={otpSent}
                  >
                    <option value=""> Select country</option>
                    {countries.map((c, index) => (
                      <option key={index} value={c.dial}>
                        {c.name} ({c.dial})
                      </option>
                    ))}
                  </select>
                </>
              )}
              <label
                for="email"
                class="block  text-base font-medium text-gray-900 dark:text-white"
              >
                Enter phone number
              </label>
              <input
                type="tel"
                placeholder="Phone number"
                {...register("phone")}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                disabled={otpSent}
              />
              </>
              )}
              {otpSent && (
                <>
                  <input
                    type="text"
                    placeholder="Enter 6 digit OTP"
                    {...register("otp")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {/* Add error message if needed */}
                </>
              )}{" "}
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {otpSent ? "Verify OTP" : "Send OTP"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
