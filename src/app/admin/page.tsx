"use client";

import React, { useEffect, useState } from "react";

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  totalAmount: number;
  status: string;
}

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/get-orders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="pt-32 text-center text-lg font-semibold">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="pt-32 px-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-green-700">
        Manage Orders
      </h1>

      <div className="overflow-x-auto rounded-xl shadow">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="p-3">{order.user?.name}</td>
                <td className="p-3">{order.user?.email}</td>
                <td className="p-3">₹{order.totalAmount}</td>
                <td className="p-3 capitalize">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
