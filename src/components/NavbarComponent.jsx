import {Navbar, Nav, Container} from 'react-bootstrap'
import React, { useEffect } from 'react';
import logo from '../assets/image/logo2.svg'
import Button from 'react-bootstrap/Button'
import user from '../assets/image/user.svg'

import AOS from 'aos';
import 'aos/dist/aos.css';

const NavbarComponent = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  window.addEventListener('scroll', function() {
    var navbar = document.querySelector('.navbar');
    if (window.scrollY > 0) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

  return (
  <Navbar expand="lg fixed-top navbar-scroll" className="navbar" data-aos="fade-right">
      <Container>
        <Navbar.Brand href="#home" style={{color:"white"}} className='logo'><img src={logo} alt="" />SIPIKET</Navbar.Brand>
        <Navbar.Toggle style={{border:"0"}} aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className='teks'>
          <Nav className="me-auto gap-2">
            <Nav.Link href="#home" style={{color:"white"}}>Home</Nav.Link>
            <Nav.Link href="#about" style={{color:"white"}}>About Us</Nav.Link>
            <Nav.Link href="#service" style={{color:"white"}}>Service</Nav.Link>
            <Nav.Link href="#tutor" style={{color:"white"}}>Tutorial</Nav.Link>
            <Nav.Link href="#contact" style={{color:"white"}}>Contact</Nav.Link>
            <Button href='/Login' style={{color:"white"}} className='log'>Login<img src={user} alt="" /></Button>{' '}
          </Nav>
        </Navbar.Collapse>
      </Container>
  </Navbar>
  )
}

export default NavbarComponent