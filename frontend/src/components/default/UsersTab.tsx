import { useState } from "react";
import UsersTable from "./UsersTable";

export default function UsersTab() {
  const [users, setUsers] = useState([
    {
      user_id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      phone_number: "(555) 123-4567",
      billing_address: "",
      payment_method: "**** **** **** 4242",
      is_admin: false,
      is_suspended: false,
      promotion: true,
    },
    {
      user_id: 2,
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@example.com",
      phone_number: "(555) 987-6543",
      billing_address: "",
      payment_method: "**** **** **** 1234",
      is_admin: true,
      is_suspended: false,
      promotion: false,
    },
  ]);

  const handleUpdateUser = (id, field, value) => {
    setUsers((prev) =>
      prev.map((u) => (u.user_id === id ? { ...u, [field]: value } : u))
    );
  };

  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.user_id !== id));
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Registered Users</h2>
      </div>
      <UsersTable
        users={users}
        onUpdate={handleUpdateUser}
        onDelete={handleDeleteUser}
      />
    </div>
  );
}
