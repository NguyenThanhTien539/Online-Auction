export const HeaderAccount = () => {
  return (
    <>
      <div className="flex items-center gap-1 whitespace-nowrap ">
        <a href="#" className="text-white-900 font-bold hover:text-gray-300">
          Sign in
        </a>
        <span className="text-white">/</span>
        <a
          href="accounts/register"
          className="text-white-900 font-bold hover:text-gray-300"
        >
          Sign up
        </a>
      </div>
    </>
  );
};
