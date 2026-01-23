"use client";

import { IOrder } from "@/models/order.model";
import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import axios from "axios";

function AdminOrderCard({ order }: { order: IOrder }) {
  const [status, setStatus] = useState<String>(order.status)
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const statusOptions = ["pending", "out of delivery"];

  const updateStatus = async (orderId: string, status: string) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `/api/admin/update-order-status/${orderId}`,
        { status }
      );
      console.log("Updated:", res.data);
      setStatus(status)
    } catch (error) {
      console.error("Status update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-gray-100 shadow-md hover:shadow-lg rounded-2xl p-6 transition-all"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div className="space-y-1">
          <p className="text-lg font-bold flex items-center gap-2 text-green-700">
            <Package size={20} />
            Order #{order._id!.toString().slice(-6)}
          </p>

          <span
            className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${
              order.isPaid
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-red-100 text-red-700 border-red-300"
            }`}
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>

          <p className="text-gray-500 text-sm">
            {new Date(order.createdAt!).toLocaleString()}
          </p>

          {/* ADDRESS */}
          <div className="mt-3 space-y-1 text-sm text-gray-700">
            <p className="flex items-center gap-2 font-semibold">
              <User size={16} className="text-green-600" />
              {order.address.fullName}
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <Phone size={16} className="text-green-600" />
              {order.address.mobile}
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <MapPin size={16} className="text-green-600" />
              {order.address.fullAddress}
            </p>
          </div>

          <p className="mt-3 flex items-center gap-2 text-xs text-gray-700">
            <CreditCard size={16} className="text-green-600" />
            {order.paymentMethod === "cod"
              ? "Cash On Delivery"
              : "Online Payment"}
          </p>
        </div>

        {/* STATUS */}
        <div className="flex flex-col items-start md:items-end gap-2">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
              status === "delivered"
                ? "bg-green-100 text-green-700"
                : status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {status}
          </span>

          <select
          value={status}
            disabled={loading || status === "delivered"}
            onChange={(e) =>
              updateStatus(order._id!.toString(), e.target.value)
            }
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm shadow-sm hover:border-green-400 focus:ring-2 focus:ring-green-500 outline-none disabled:opacity-60"
          >
            {statusOptions.map((st) => (
              <option key={st} value={st}>
                {st.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ITEMS TOGGLE */}
      <div className="border-t border-gray-200 mt-4 pt-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-green-700"
        >
          <span className="flex items-center gap-2">
            <Package size={16} className="text-green-600" />
            {expanded
              ? "Hide Order Items"
              : `View ${order.items.length} Items`}
          </span>
          {expanded ? (
            <ChevronUp size={16} className="text-green-600" />
          ) : (
            <ChevronDown size={16} className="text-green-600" />
          )}
        </button>

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: expanded ? "auto" : 0,
            opacity: expanded ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="mt-3 space-y-3">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover border"
                  />
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × {item.unit}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold">
                  रु{Number(item.price) * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* FOOTER */}
      <div className="border-t pt-3 mt-4 flex justify-between items-center text-sm font-semibold">
        <div className="flex items-center gap-2 text-gray-700">
          <Truck size={16} className="text-green-600" />
          Delivery:{" "}
          <span className="text-green-700 capitalize">{status}</span>
        </div>
        <div>
          Total:{" "}
          <span className="text-green-700 font-bold">
            रु{order.totalAmount}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default AdminOrderCard;
