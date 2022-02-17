import Link from 'next/link';

import { useState } from 'react';

const Navigation = () => {
  const [showsMobileMenu, setShowsMobileMenu] = useState<boolean>(false);

  function toggleMobileMenu() {
    setShowsMobileMenu(!showsMobileMenu);
  }

  return (
    <nav className="px-5 sm:px-10 h-20">
      {/* Desktop Nav Bar */}
      <ul className="items-center space-x-8 lg:space-x-12 justify-left hidden lg:flex py-4">
        <li className="grow">
          <Link href="/">
            <a className="hover:opacity-40">Wonka Labs</a>
          </Link>
        </li>
        <li>
          <Link href="/#about">
            <a className="py-2 hover:opacity-40">About</a>
          </Link>
        </li>
        <li>
          <Link href="https://twitter.com/wagmify">
            <a className="py-2 hover:opacity-40">Twitter</a>
          </Link>
        </li>
        <li>
          <Link href="https://t.me/+Hwwhn4ufkxkzNzMx">
            <a className="py-2 hover:opacity-40">Telegram</a>
          </Link>
        </li>
      </ul>

      {/* Mobile Nav Bar */}
      <ul className="flex items-center justify-end lg:hidden py-4">
        <li className="grow">
          <Link href="/">
            <a className="hover:opacity-40">wagmify.app</a>
          </Link>
        </li>
        <li>
          <button onClick={toggleMobileMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              aria-hidden="true"
              className="w-8 h-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </li>
      </ul>

      {/* Mobile Menu */}
      {showsMobileMenu && (
        <div className="fixed inset-0 bg-inherit z-10 px-5">
          <ul className="flex items-center justify-end py-4 ">
            <li className="grow">
              <Link href="/">
                <a className="hover:opacity-40">Wonka Labs</a>
              </Link>
            </li>
            <li>
              <button onClick={toggleMobileMenu}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                  aria-hidden="true"
                  className="w-8 h-8"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </li>
          </ul>

          <ul className="flex-row space-y-2 items-center py-2">
            <li>
              <Link href="/#about">
                <a className="hover:opacity-40" onClick={toggleMobileMenu}>
                  About
                </a>
              </Link>
            </li>
            <li>
              <Link href="/#latest">
                <a className="hover:opacity-40" onClick={toggleMobileMenu}>
                  Latest Wagmiis
                </a>
              </Link>
            </li>
            <li>
              <Link href="https://twitter.com/wagmify">
                <a className="hover:opacity-40" onClick={toggleMobileMenu}>
                  Twitter
                </a>
              </Link>
            </li>
            <li>
              <Link href="https://t.me/+Hwwhn4ufkxkzNzMx">
                <a className="hover:opacity-40" onClick={toggleMobileMenu}>
                  Telegram
                </a>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

Navigation.defaultProps = {};

export default Navigation;
