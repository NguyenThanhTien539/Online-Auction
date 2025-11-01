export const HeaderMenu = () => {
  const navbarItems = [
    { link: "#", option: "Home" },
    { link: "#", option: "About" },
    { link: "#", option: "Payment" },
    { link: "#", option: "Contact" },
  ];

  return (
    <>
      <nav className="">
        <ul className="flex gap-10">
          {navbarItems.map((item, index) => (
            <li key={index} className="text-white-700 font-bold hover:text-blue-300">
              <a href={item.link}>{item.option}</a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
