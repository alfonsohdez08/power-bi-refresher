import React from "react";

import { NavLink } from "react-router-dom";

const NavigationItem = ({
  to,
  placeholder,
}: {
  to: string;
  placeholder: string;
}) => (
  <NavLink
    to={to}
    className="hover:bg-gray-600 rounded py-1 px-3 font-semibold text-base"
    activeClassName="bg-gray-600"
  >
    {placeholder}
  </NavLink>
);

export default function Navbar() {
  const navigationItems = [
    {
      to: "/",
      placeholder: "Home",
    },
  ];

  return (
    <nav className="bg-gray-800 h-14 rounded-sm text-gray-100">
      <div className="flex space-x-4 items-center px-5 h-full">
        <NavLink
          to="/"
          className="px-3 py-1 rounded-md bg-gray-700 text-xl font-bold"
        >
          Super Power BI Refresher
        </NavLink>
        <div className="space-x-3">
          {navigationItems.map((n, index) => (
            <NavigationItem
              key={index}
              placeholder={n.placeholder}
              to={n.to}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
