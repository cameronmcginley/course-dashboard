import "./Navbar.css";

const Navbar = () => {
    return (
      <nav className="navbar">
        <h1>Demo Application</h1>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/courses">Courses</a></li>
            <li><a href="/form">Form</a></li>
            <li><a href="/viewdata">View Data</a></li>
          </ul>
      </nav>
    );
  }
   
  export default Navbar;
