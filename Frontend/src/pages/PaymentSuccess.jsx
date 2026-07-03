import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center px-4">
      <div className="bg-[#1F2937] rounded-3xl p-10 w-full max-w-xl text-center">

        <div className="w-24 h-24 mx-auto rounded-full bg-green-500 flex items-center justify-center text-5xl text-white">
          ✓
        </div>

        <h1 className="text-4xl text-white font-bold mt-6">
          Payment Successful
        </h1>

        <p className="text-gray-400 mt-3">
          Your order has been placed successfully.
        </p>

        <div className="grid gap-4 mt-10">

          <button
            onClick={() => navigate("/user/orders")}
            className="bg-orange-500 hover:bg-orange-600 rounded-xl py-3 text-white"
          >
            View Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="bg-gray-700 hover:bg-gray-600 rounded-xl py-3 text-white"
          >
            Continue Shopping
          </button>

        </div>

      </div>
    </div>
  );
}