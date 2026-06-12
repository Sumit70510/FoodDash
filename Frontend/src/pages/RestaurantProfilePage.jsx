import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function RestrauntProfilePage() {
  
  const { user, type } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const restaurant = user;
  console.log(restaurant);
  const [formData, setFormData] = useState({
    name: restaurant?.name || "",
    email: restaurant?.email || "",
    ownerContactNo: restaurant?.ownerContactNo || "",
    restrauntContactNo:
      restaurant?.restrauntContactNo || "",
    address: restaurant?.location?.address || "",
    operational: restaurant?.operational || "Open",
    isOpen: restaurant?.isOpen ?? true,
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // setLoading(true);

      // const response = await fetch(
      //   `http://localhost:5000/api/v1/restaurant/${restaurant._id}`,
      //   {
      //     method: "PUT",
      //     credentials: "include",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(formData),
      //   }
      // );

      // const data = await response.json();

      // if (data.success) {
      //   localStorage.setItem(
      //     "restaurant",
      //     JSON.stringify(data.restaurant)
      //   );

      //   alert("Profile Updated Successfully");
      // } else {
      //   alert(data.message);
      // }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] px-4 md:px-5 lg:px-6 py-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          Restaurant Profile
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Editable Section */}

          <div className="lg:col-span-2">
            <div className="bg-[#1F2937] rounded-3xl p-8 border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-6">
                Editable Information
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Restaurant Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[#111827] text-white p-3 rounded-xl border border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#111827] text-white p-3 rounded-xl border border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Owner Contact
                    </label>

                    <input
                      type="text"
                      name="ownerContactNo"
                      value={formData.ownerContactNo}
                      onChange={handleChange}
                      className="w-full bg-[#111827] text-white p-3 rounded-xl border border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Restaurant Contact
                    </label>

                    <input
                      type="text"
                      name="restrauntContactNo"
                      value={formData.restrauntContactNo}
                      onChange={handleChange}
                      className="w-full bg-[#111827] text-white p-3 rounded-xl border border-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Address
                  </label>

                  <textarea
                    rows="4"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-[#111827] text-white p-3 rounded-xl border border-gray-700"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Operational Status
                    </label>

                    <select
                      name="operational"
                      value={formData.operational}
                      onChange={handleChange}
                      className="w-full bg-[#111827] text-white p-3 rounded-xl border border-gray-700"
                    >
                      <option value="Open">
                        Open
                      </option>
                      <option value="Closed">
                        Closed
                      </option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 mt-9">
                    <input
                      type="checkbox"
                      name="isOpen"
                      checked={formData.isOpen}
                      onChange={handleChange}
                      className="w-5 h-5"
                    />

                    <span className="text-white">
                      Accept Orders
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full
                    bg-orange-500
                    hover:bg-orange-600
                    py-4
                    rounded-xl
                    text-white
                    font-bold
                    transition
                  "
                >
                  {loading
                    ? "Updating..."
                    : "Save Changes"}
                </button>
              </form>
            </div>
          </div>

          {/* Verification Section */}

          <div>
            <div className="bg-[#1F2937] rounded-3xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-6">
                Verification Details
              </h2>

              <div className="space-y-5">
                <div className="bg-[#111827] p-4 rounded-xl">
                  <p className="text-gray-400 text-sm">
                    Owner Name
                  </p>

                  <p className="text-white font-semibold mt-1">
                    {restaurant.ownerName}
                  </p>
                </div>

                <div className="bg-[#111827] p-4 rounded-xl">
                  <p className="text-gray-400 text-sm">
                    PAN Number
                  </p>

                  <p className="text-white font-semibold mt-1">
                    {restaurant.PAN}
                  </p>
                </div>

                <div className="bg-[#111827] p-4 rounded-xl">
                  <p className="text-gray-400 text-sm">
                    FSSAI Number
                  </p>

                  <p className="text-white font-semibold mt-1">
                    {restaurant.FSSAI}
                  </p>
                </div>

                <div className="bg-[#111827] p-4 rounded-xl">
                  <p className="text-gray-400 text-sm">
                    GST Number
                  </p>

                  <p className="text-white font-semibold mt-1">
                    {restaurant.GST || "Not Provided"}
                  </p>
                </div>

                <div className="bg-green-900/30 border border-green-500 p-4 rounded-xl">
                  <p className="text-green-400 font-semibold">
                    ✓ Verified Restaurant
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    Legal information can only be
                    changed through FoodDash support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}