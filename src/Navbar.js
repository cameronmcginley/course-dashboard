import "./Navbar.css";

const Navbar = () => {
    return (
      <nav className="navbar">
        <h1>Demo Application</h1>
        <div className="links">
          <a href="/">Home</a>
          <a href="/courses">Courses</a>
          <a href="/form">Form</a>
        </div>
      </nav>
    );
  }
   
  export default Navbar;