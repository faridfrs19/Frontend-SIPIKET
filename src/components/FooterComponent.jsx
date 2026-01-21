import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import React, { useEffect } from 'react';
import ig from "../assets/image/ig.svg"
import yt from "../assets/image/youtube.svg"


const FooterComponent = () => {
    useEffect(() => {
        AOS.init();
      }, []);
    
  return (
    <div className="footer py-5">
      <Container>
        <Row className="d-flex justify-content-between" data-aos="fade-up">
          <Col lg="5">
            <h3 className="fw-bold">SIPIKET</h3>
            <p className="desc">``Dengan Sistem Informasi Guru Piket kami, sekolah dapat mengurangi beban administratif, meningkatkan kehadiran, 
            dan menciptakan lingkungan pembelajaran yang terorganisir dan efisien.``</p>
            <div className="mail">
              <Link className="text-decoration-none">
                <i className="fa-regular fa-envelope"></i>
                <p className="m-0">SiPiket0304@gmail.com</p>
              </Link>
            </div>
          </Col>
          <Col className="d-flex flex-column col-lg-2 col mt-lg-0 mt-5">
            <h5 className="fw-bold">Menu</h5>
            <div className="fot d-flex col mt-lg-0 mt-5">
            <a href="#home"> Home</a>
            <a href="#about"> About Us</a>
            <a href="#about"> Service</a>
            <a href="#tutor"> Tutorial</a>
            <a href="#contact"> Contact</a>
            </div>
          </Col>
          <Col lg="4" className="mt-lg-0 mt-5">
            <div className="teks-f">
            <h5 className="fw-bold mb-3">Follow untuk info lebih lanjut</h5>
            </div>
            <div className="icon">
            <a href="https://www.instagram.com/s_ipiket?igsh=ZmVmeGZvNWcweGQ1" target="_blank" rel="noopener noreferrer">
              <img src={ig} alt="Instagram" />
            </a>
            <a href="https://www.youtube.com/@SIPIKET" target="_blank" rel="noopener noreferrer">
              <img src={yt} alt="YouTube" />
            </a>
          </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <p className="text-center px-md-0 px-3">&copy; {new Date().getFullYear()} Farid <span>|| SIPIKET </span>,ALL Right Reserved</p>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default FooterComponent