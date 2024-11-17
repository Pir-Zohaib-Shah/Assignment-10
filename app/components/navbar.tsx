'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const correctPassword = '1234567'; //this Password is only for testing purpose

    if (password === correctPassword) {

      window.location.href = '/admin'; 
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <nav className="bg-gray-800 p-2 px-4">
      <div className="flex items-center justify-between">
        <div className="text-white text-2xl font-bold">
          <Link href="/">SHAH</Link>
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? (
              <FaTimes className="text-white text-2xl" />
            ) : (
              <FaBars className="text-white text-2xl" />
            )}
          </button>
        </div>

        <ul
          className={`md:flex md:space-x-8 md:items-center md:ml-[725px] absolute md:static top-16 left-0 w-full bg-gray-800 transition-all duration-300 ease-in-out md:bg-transparent ${
            isOpen ? 'block' : 'hidden'
          }`}
        >
          <li>
            <Link href="/" className="text-white text-lg hover:text-gray-400 py-2 px-4 block">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-white text-lg hover:text-gray-400 py-2 px-4 block">
              About
            </Link>
          </li>
          <li>
            <Link href="/services" className="text-white text-lg hover:text-gray-400 py-2 px-4 block">
              Feedback
            </Link>
          </li>
          <li>
            <Dialog>
              <DialogTrigger>
                <a className="text-white text-lg hover:text-gray-400 py-2 px-4 block">
                  Admin
                </a>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle className='text-black'>Enter Admin Password</DialogTitle>
                <DialogDescription>
                  Please enter the password to access the admin page.
                </DialogDescription>
                <form onSubmit={handlePasswordSubmit}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 w-full mb-4 text-black"
                    placeholder="Password"
                  />
                  {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                  <div className="flex justify-between">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                      Submit
                    </button>
                    <DialogClose asChild>
                      <button
                        type="button"
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </DialogClose>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
