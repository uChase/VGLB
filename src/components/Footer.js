import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white text-center py-4">
      <p>
        Data from{" "}
        <Link
          href="https://www.igdb.com"
          className=" underline hover:text-slate-500"
        >
          IGDB
        </Link>
      </p>
      <p>© {new Date().getFullYear()} Chase Hameetman</p>
    </footer>
  );
};

export default Footer;
