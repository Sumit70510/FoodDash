import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { useDispatchCart, useCart } from "../components/ContextReduce";

export default function MyOrders() {
  let data = useCart();
  let dispatch = useDispatchCart();
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    const fetchMyOrder = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/myOrderData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("userEmail"),
          }),
        });

        const result = await response.json();
        if (result.orderData) {
          setOrderData(result.orderData.order_data || []);
        } else {
          setOrderData([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchMyOrder();
  }, []);

  const handleAddToCart = async (items) => {
    for (const item of items) {
      await dispatch({
        type: "ADD",
        id: item._id,
        name: item.name,
        qty: item.qty,
        size: item.size,
        price: item.price,
        img: item.img,
      });
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mt-4">
        <h2 className="mb-4 text-center">My Orders</h2>
        <div className="row">
          {orderData.length > 0 ? (
            orderData
              .slice()
              .reverse()
              .map((order, index) => {
                const orderDate = order[0]?.order_date;
                const showDate =
                  index === 0 ||
                  orderData[index - 1][0]?.order_date !== orderDate;

                return (
                  <div key={index} className="mb-4 w-100">
                    {showDate && (
                      <>
                        <h4 className="text-center text-primary">{orderDate}</h4>
                        <hr />
                      </>
                    )}
                    <div className="row">
                      {order.slice(1).map((item, i) => (
                        <div key={i} className="col-12 col-md-6 col-lg-3">
                          <div
                            className="card mt-3"
                            style={{ width: "16rem", maxHeight: "360px" }}
                          >
                            <img
                              src={item.img}
                              className="card-img-top"
                              alt={item.name}
                              style={{ height: "120px", objectFit: "cover" }}
                            />
                            <div className="card-body">
                              <h5 className="card-title">{item.name}</h5>
                              <div className="container w-100 p-0">
                                <span className="m-1">Qty: {item.qty}</span>
                                <span className="m-1">Size: {item.size}</span>
                                <div className="d-inline ms-2 h-100 w-20 fs-5">
                                  ₹{item.price}/-
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={() => handleAddToCart(order.slice(1))}
                    >
                      Repeat Order
                    </button>
                  </div>
                );
              })
          ) : (
            <p className="text-center">No orders found.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
