"use client";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Anonimo
        </a>
        {session ? (
          <>
            <span className="mr-4">
              Welcome, {user?.username || user?.email}
            </span>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto hover:cursor-pointer bg-slate-100 text-black hover:bg-slate-200 focus-visible:ring-2 focus-visible:ring-white transition-transform hover:scale-105"
              variant="outline"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full md:w-auto hover:cursor-pointer bg-slate-100 text-black hover:bg-slate-200 focus-visible:ring-2 focus-visible:ring-white transition-transform hover:scale-105"
              variant="outline"
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
