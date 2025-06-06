import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { registerUser } from "../services/userService";
import { userSchema } from "../validations/userSchema";
import toast from "react-hot-toast";

import InputField from "../components/InputField";
import { useNavigate } from "react-router-dom";
import '../styles/register.css'
const UserRegistrationForm = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);

  // Initialize  schema validation
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
  });


    const [formData, setFormData] = useState({
        name: "",
        email: "",
    })

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { message, user } = await registerUser(data);
      toast.success(message);
      console.log("Registered User:", user);

      // Store the registered user in localStorage (optional, for later use)
      localStorage.setItem("user", JSON.stringify(user));

      reset(); // reset

      //redirect
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error){
      const errorMessage = typeof error === "string" ? error : error.message;
      if (errorMessage.includes("Email already in use")) {
        toast.error(
          "This email is already registered. Please use a different email."
        );
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="contain">
      <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
        <h2 className="">Sign up</h2>
        <InputField
          name="fullName"
          control={control}
          label="Full Name"
          error={errors.fullName?.message}
        />
        <InputField
          name="email"
          control={control}
          label="Email"
          error={errors.email?.message}
        />
        <InputField
          name="password"
          control={control}
          label="Password"
          type="password"
          error={errors.password?.message}
          
        />
        <button
          type="submit"
          className="registration-button"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

    </div>
  );
};

export default UserRegistrationForm;