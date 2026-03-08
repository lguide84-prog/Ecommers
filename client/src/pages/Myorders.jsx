import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

function Myorders() {
  const { axios, user } = useAppContext();
  const [myOrders, setMyOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders || []);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  return (
    <div className="mt-16 pb-16">
      <div>
        <p className="text-2xl font-medium uppercase">My Orders</p>
      </div>

      {myOrders.length === 0 && (
        <p className="text-gray-500 mt-6">No orders found.</p>
      )}

      {myOrders.map((order) => (
        <div
          className="border border-gray-300 rounded-lg mb-10 p-4 py-5"
          key={order._id}
        >
          <div className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col mb-4">
            <span>Order ID: {order._id}</span>
            <span>Payment: {order.paymentType}</span>
            <span>Total: ₹{order.amount}</span>

            {order.transactionId && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                Txn ID: {order.transactionId.slice(0, 8)}...
              </span>
            )}
          </div>

          {(order.items || []).map((item, itemIndex) => {
            const product = item?.product;

            const imageUrl =
              product?.images?.[0] ||
              "https://via.placeholder.com/80?text=No+Image";

            return (
              <div
                className={`relative bg-white text-gray-500/70 ${
                  order.items.length !== itemIndex + 1 && "border-b"
                } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
                key={itemIndex}
              >
                {/* LEFT SECTION */}
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <img
                      src={imageUrl}
                      className="w-20 h-20 object-contain bg-white"
                      alt={product?.name || "Product"}
                    />
                  </div>

                  <div className="ml-4">
                    <h2 className="text-xl font-medium text-gray-800">
                      {product?.name || "Product no longer available"}
                    </h2>
                    <p>{product?.category || "Removed product"}</p>
                  </div>
                </div>

                {/* MIDDLE */}
                <div className="flex flex-col justify-center md:ml-10 mb-4 md:mb-0">
                  <p>Quantity: {item?.quantity || 1}</p>
                  <p>Status: {order.status}</p>
                  <p>
                    Date:{" "}
                    {order?.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "-"}
                  </p>
                </div>

                {/* RIGHT */}
                <p className="text-primary text-lg font-medium">
                  Amount: ₹
                  {(product?.offerPrice || product?.price || 0) *
                    (item?.quantity || 1)}
                </p>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Myorders;