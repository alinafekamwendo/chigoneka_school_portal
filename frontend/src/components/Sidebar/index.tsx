"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import useLocalStorage from "@/hooks/useLocalStorage";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  menuGroups:[]
}



const Sidebar = ({ sidebarOpen, setSidebarOpen ,menuGroups}: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  
  return (
    <>
      {/* Burger Button for Smaller Screens */}
 {/* Persistent Toggle Button for All Screens */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed left-4 top-4 z-9999 block rounded-lg p-2 shadow-md transition-transform ${
          sidebarOpen ? 'translate-x-72' : 'translate-x-0'
        } lg:block dark:text-white`}
      >
        <svg
          className="h-6 w-6 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
        </svg>
      </button>

      {/* Overlay */}

      {/* Sidebar */}
      <aside
        className={`w-68.5 fixed left-0 top-0 z-9999 flex h-screen flex-col overflow-y-hidden border-r border-stroke bg-white transition-transform duration-300 ease-linear dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-10">
          <Link href="/">
            <Image
              width={150}
              height={32}
              src={"/images/logo/logo-icon.svg"}
              alt="Logo"
              priority
              className="dark:hidden"
            />
          </Link>
    
          <button
            onClick={() => setSidebarOpen(false)}
            className="hover:bg-light-3 dark:hover:bg-light-3 block rounded-lg p-2 text-dark-4 transition duration-300 ease-in-out dark:text-white lg:hidden"
          >
            <svg
              className="h-6 w-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
              />
            </svg>
          </button>
        </div>
       
        {/* Sidebar Menu */}
        <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-1 max-h-[calc(100vh-150px)] overflow-y-auto px-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div  key={groupIndex}>
                <h3 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {group.name}
                </h3>

                <ul className="mb-4 flex flex-col gap-2 ">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem 
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
