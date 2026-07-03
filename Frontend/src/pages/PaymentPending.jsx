export default function PaymentPending() {

  return (

    <div className="min-h-screen bg-[#111827] flex items-center justify-center">

      <div className="bg-[#1F2937] rounded-3xl p-10 text-center">

        <div className="w-20 h-20 rounded-full bg-yellow-500 mx-auto animate-pulse"></div>

        <h1 className="text-white text-4xl font-bold mt-6">
          Processing Payment
        </h1>

        <p className="text-gray-400 mt-3">
          Please wait while we verify your payment.
        </p>

      </div>

    </div>

  );

}