import React from "react";
import { AuthButton } from "../auth/auth-button";

const Navbar = () => {
  return (
    <header>
      <nav className="flex items-center justify-between p-4 border-b  shadow-sm ">
        <div className="text-lg font-bold">My App</div>
        <AuthButton />
      </nav>
    </header>
  );
};

export default Navbar;
