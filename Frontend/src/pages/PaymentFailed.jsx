import { useNavigate } from "react-router-dom";

export default function PaymentFailed() {

  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-[#111827] flex justify-center items-center">

      <div className="bg-[#1F2937] rounded-3xl p-10 text-center max-w-xl">

        <div className="w-24 h-24 rounded-full bg-red-500 mx-auto flex items-center justify-center text-white text-5xl">
          ✕
        </div>

        <h1 className="text-4xl text-white mt-6 font-bold">
          Payment Failed
        </h1>

        <p className="text-gray-400 mt-4">
          Something went wrong while processing payment.
        </p>

        <button
          onClick={() => navigate("/checkout")}
          className="mt-8 bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-xl text-white"
        >
          Try Again
        </button>

      </div>

    </div>

  );

}