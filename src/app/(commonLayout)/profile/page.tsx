"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CartItem, Order, User } from "../../../../types";
import { AxiosError } from "axios";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch profile, cart, orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, cartRes, ordersRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/cart"),
          api.get("/orders"),
        ]);
        setUser(userRes.data);
        setCart(cartRes.data);
        setOrders(ordersRes.data);
      } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        toast.error(error.response?.data?.message || "Failed to load profile");
      }
    };
    fetchData();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/auth/me", {
        name: user?.name,
        email: user?.email,
        avatar: user?.avatar,
      });
      toast.success("Profile updated!");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleReview = async (
    orderId: number,
    rating: number,
    comment: string,
  ) => {
    try {
      await api.post("/reviews", { orderId, rating, comment });
      toast.success("Review submitted!");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Profile Info */}
      <div className="mb-8 border rounded p-4 shadow">
        <h2 className="text-xl font-semibold mb-4">Profile Info</h2>
        <form onSubmit={handleProfileUpdate} className="flex flex-col gap-3">
          <Input
            type="text"
            value={user?.name || ""}
            onChange={(e) =>
              setUser((prev) => prev && { ...prev, name: e.target.value })
            }
            placeholder="Name"
          />
          <Input
            type="email"
            value={user?.email || ""}
            onChange={(e) =>
              setUser((prev) => prev && { ...prev, email: e.target.value })
            }
            placeholder="Email"
          />
          <Input
            type="text"
            value={user?.avatar || ""}
            onChange={(e) =>
              setUser((prev) => prev && { ...prev, avatar: e.target.value })
            }
            placeholder="Profile Image URL"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Update Profile"}
          </Button>
        </form>
      </div>

      {/* Cart Items */}
      <div className="mb-8 border rounded p-4 shadow">
        <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul className="space-y-2">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.medicine.name} x {item.quantity}
                </span>
                <span>${item.medicine.price * item.quantity}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Orders */}
      <div className="border rounded p-4 shadow">
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="border p-3 rounded">
                <p>Order ID: {order.id}</p>
                <p>Status: {order.status}</p>
                <p>Total: ${order.totalPrice}</p>
                <ul className="ml-4 mt-2">
                  {order.items.map((item) => (
                    <li key={item.medicine.id}>
                      {item.medicine.name} x {item.quantity}
                    </li>
                  ))}
                </ul>
                {/* Review form if delivered and not yet reviewed */}
                {order.status === "DELIVERED" && !order.reviewGiven && (
                  <button
                    onClick={() => handleReview(order.id, 5, "Great product!")}
                    className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Leave Review
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
