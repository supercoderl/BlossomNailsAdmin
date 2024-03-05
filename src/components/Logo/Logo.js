// material-ui

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={logo} alt="Mantis" width="100" />
     *
     */
    <>
      <img
        src="https://cdn-icons-png.flaticon.com/128/13941/13941933.png"
        alt=""
        width={40} height={40}
      />
      <h1 className="logo">Inox Thành Nam</h1>
    </>
  );
};

export default Logo;
