import Link from "next/link";
import Image from 'next/image';
import { UserAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";


const Navbar = () => {
    const { user, googleSignIn, logOut } = UserAuth();
    const [loading, setLoading] = useState(true);

    const handleSignIn = async () => {
        try {
            await googleSignIn();
        } catch (error) {
            console.log(error);
        }
    };

    const handleSignOut = async () => {
        try {
            await logOut();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const checkAuthentication = async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
            setLoading(false);
        };
        checkAuthentication();
    }, [user]);

    return (
        <div className="navbar sticky top-0 z-40 shadow bg-base-100">
            <div className="navbar-start">
                <Link href={"/"} className="btn btn-ghost normal-case text-xl">HiperLife</Link>
            </div>
            <div className="navbar-center">
                {/* <Link href={"/"} className="btn btn-ghost normal-case text-xl">HiperLife</Link> */}
            </div>
            <div className="navbar-end">

                {!user ?
                    <>
                        <button onClick={handleSignIn} className="btn mx-1">Login</button>
                        
                    </>
                    : (
                        <div className="dropdown dropdown-end flex">
                            <label tabIndex={0} className="btn btn-ghost my-auto ">
                                <div className="avatar">
                                    <div className="w-8 my-auto h-auto rounded">
                                        <img src={user.photoURL}></img>
                                    </div>
                                </div>
                                <p className="hidden md:block">{user.displayName}</p>
                            </label>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-16 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                <li><button onClick={handleSignOut} >Sign out</button ></li>
                            </ul>
                        </div>
                    )}

            </div>
        </div>

    );
};

export default Navbar;
