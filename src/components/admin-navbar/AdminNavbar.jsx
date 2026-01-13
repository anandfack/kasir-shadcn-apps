import React from "react";

const AdminNavbar = ({ user }) => {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-end p-4 bg-[#18181B]">
      <div>
        <p className="flex justify-end">Hello, {user?.nama}</p>
      </div>
    </div>
  );
};

export default AdminNavbar;
