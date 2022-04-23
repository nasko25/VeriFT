import Link from 'next/link';

const NavItem = ({ href, name }) => (
  <Link href={href}>
    <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-blue-600 hover:text-white">
      {name}
    </a>
  </Link>
);

export const Navbar = () => {
  return (
    <>
      <nav className="flex items-center flex-wrap bg-blue-500 p-3">
        <Link href="/">
          <a className="inline-flex items-center p-2 mr-4 ">
            <span className="text-xl text-white font-bold uppercase tracking-wide">
              VeriFT Home
            </span>
          </a>
        </Link>
        <NavItem href="/mint-nft" name="Get test nft" />
      </nav>
    </>
  );
};
