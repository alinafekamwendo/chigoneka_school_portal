import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import SearchForm from "@/components/Header/SearchForm";

const Header = ({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-999 flex w-full border-b border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark">
      <div className="flex flex-grow items-center justify-between px-4 py-2.5 shadow-2 md:px-5 2xl:px-10">
        
        <div className="hidden xl:block">
          <div>
            <h2 className="mb-0.5 font-bold text-dark dark:text-white">
              SCHOOL MANAGEMENT PORTAL
            </h2>
          
          </div>
        </div>

        <div className="flex w-full items-center justify-end gap-2 2xsm:gap-4 xl:w-auto xl:justify-end">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* <SearchForm />
            <DarkModeSwitcher /> */}
            <DropdownNotification />
          </ul>
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
