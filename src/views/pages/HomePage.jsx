import React, { useEffect, useState } from 'react';
import ghome from '../../assets/image/home.png'
import arrow from '../../assets/image/arrow.svg'
import box1 from '../../assets/image/absensi.svg'
import box2 from '../../assets/image/surat.svg'
import box3 from '../../assets/image/jadwal.svg'
import box4 from '../../assets/image/izin.svg'
import about from '../../assets/image/about.png'
import waktu from '../../assets/image/waktu.svg'
import ceklis from '../../assets/image/ceklis.svg'
import bell from '../../assets/image/bell.svg'
import tutor from '../../assets/image/tutor.png'
import kanan from '../../assets/image/kanan.svg'
import play from '../../assets/image/play.svg'
import { Container, Row, Col, Button, Form, Modal} from 'react-bootstrap';
import '../../dist/main.css'

import AOS from 'aos';
import 'aos/dist/aos.css';
import NavbarComponent from '../../components/NavbarComponent';
import FooterComponent from '../../components/FooterComponent';

import { useForm, ValidationError } from '@formspree/react';

// import alert
import Swal from 'sweetalert2'

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter" style={{ color: "black" }}>
        Tutorial menggunakan aplikasi sipiket
      </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <iframe width="100%" height="315" src="https://www.youtube.com/embed/kcnwI_5nKyA" frameborder="0"></iframe>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

const HomePage = () => {
  const [state, handleSubmit] = useForm("moqgwbzo");

  if (state.succeeded) {
    document.getElementById('email').value = '';
    document.getElementById('fullName').value = '';
    document.getElementById('kelasJurusan').value = '';
    document.getElementById('message').value = '';
    Swal.fire({
      title: 'Berhasil!',
      text: 'Pesan berhasil terkirim.',
      icon: 'success',
    });
  }

  useEffect(() => {
    AOS.init();
  }, []);

  const [modalShow, setModalShow] = React.useState(false);


  return (
  <>
  <NavbarComponent />

  {/* page home */}
    <div className="homepage">
      <header className="w-100 d-flex align-items-center" id='home'>
      <Container>
          <Row className="header-box d-flex align-items-center pt-lg-5">
            <Col data-aos="fade-down">
              <h1>  
                Sistem informasi <br />guru piket
              </h1>
              <p>``Dengan Sistem Informasi Guru Piket kami.
                  Membantu sekolah meminimalkan administrasi, meningkatkan kehadiran, dan menciptakan lingkungan  
                  pembelajaran yang terorganisir dan lebih effisien.``</p>
              <Button variant="light" href='#about' className='btn'><img src={arrow} alt="" /></Button> 
            </Col>
            <Col className='ghome' data-aos="fade-left">
              <img src={ghome} alt="" />
            </Col>
          </Row>
          <div className="box-item" id='about'>
            <div className="box-konten">
              <div className="box1 shadow" data-aos="flip-left">
                  <img src={waktu} alt="" />
                <div className="isi">
                  <h4>Efisiensi Waktu</h4>
                  <p>Dengan fitur yang di sediakan pengguna dapat menghemat waktu.</p>
                </div>
              </div>
              <div className="box2 shadow" data-aos="flip-left">
                  <img src={ceklis} alt="" />
                <div className="isi">
                  <h4>Akses Mudah</h4>
                  <p>Sangat mudah untuk di akses dimanapun dan kapanpun disekolah.</p>
                </div>
              </div>
              <div className="box3 shadow" data-aos="flip-left">
                  <img src={bell} alt="" />
                <div className="isi">
                  <h4>Berbagi Informasi</h4>
                  <p>Membantu pengguna mendapatkan informasi tugas secara online.</p>
                </div>
              </div>
            </div>
          </div>
      </Container>
      </header>
      {/* page home */}

      {/* page about */}
      <div className="about w-100">
        <Container>
          <Row>
            <Col className='gabout' data-aos="fade-up">
              <img src={about} alt="" />
              <div className="desc">
              <h1>About Us</h1>
              <p>"Sistem Informasi Guru Piket adalah platform inovatif untuk efisien mengelola jadwal piket guru di sekolah. Dengan fitur yang canggih. Komitmen kami adalah meningkatkan efisiensi dan memberikan pengalaman yang nyaman bagi para pendidik."</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* page service */}
      <div className="service w-100" id='service'>
        <Container>
          <Row>
          <Col>
          <div className="jud-service" data-aos="fade-right">
            <h1>Service</h1>
          </div>
          <div className="service-item">
            <div className="service1 shadow" data-aos="fade-right">
            <img src={box1} alt="" />
              <div className="isi-service">
                <h4>Info Tugas</h4>
                <p>Menginformasikan tugas dari guru yang tidak bisa hadir kedalam kelas.</p>
                <Button href='/login' className='button'>Pergi lihat</Button>
              </div>
            </div>
            <div className="service2 shadow" data-aos="fade-left">
            <img src={box2} alt="" />
              <div className="isi-service">
                <h4>Surat izin</h4>
                <p>Membuat surat izin masuk, keluar dan pulang sekolah secara online.</p>
                <Button href='/login' className='button'>Pergi lihat</Button>
              </div>
            </div>
          </div>  
          <div className='service-item'>
            <div className="service3 shadow" data-aos="fade-right">
            <img src={box3} alt="" />
              <div className="isi-service">
                <h4>Jadwal guru piket</h4>
                <p>Memperlihatkan jadwal guru piket yang bertugas setiap harinya.</p>
                <Button href='/login' className='button'>Pergi lihat</Button>
              </div>
            </div>
            <div className="service4 shadow" data-aos="fade-left">
            <img src={box4} alt="" />
              <div className="isi-service">
                <h4>Murid tidak hadir</h4>
                <p>Mencatat semua alasan murid yang tidak hadir sekolah.</p>
                <Button href='/login' className='button'>Pergi lihat</Button>
              </div>
            </div>
          </div>
          </Col>
          </Row>
        </Container>
      </div>
      {/* page service */}

      {/* page tutor */}
      <div className="tutor w-100" id='tutor'>
        <Container>
          <Row>
            <Col className='vidio'>
              <div className="desc" data-aos="zoom-in">
              <h1>Tutorial</h1>
              <p>Ingin tahu bagaimana cara menggunakan sistem informasi guru piket kami dengan lancar? 
                Kami telah merilis video panduan singkat yang akan membimbing Anda melalui langkah-langkah
                mudah dalam memanfaatkan sistem ini secara efektif.</p>
              <div className="kanan" data-aos="fade-right">
                  <p>Lihat vidio</p>
                <div className="arrow">
                  <img src={kanan} alt="" />
                </div>
              </div>
              </div>
            <>
              <Button className='play' variant="primary" onClick={() => setModalShow(true)}>
                <img src={play} alt="" />
              </Button>

              <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </>
              <img className='bg' src={tutor} alt="" />
            </Col>
          </Row>
        </Container>
      </div>
      {/* page tutor */}

  {/* Page kontak */}
  <div className="contact w-100 min-vh-100" id='contact'>
  <Container>
    <Row>
      <Col>
          <div className="kontak shadow" data-aos="fade-left">
            <h1>Contact</h1>
            <div className="form-con shadow">
              <div className="pesan">
              <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label teks-con">
            Email :
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="form-control"
            placeholder="Masukan email"
            style={{width: '80%'}}
          />
          <ValidationError prefix="Email" field="email" errors={state.errors} />
        </div>

        <div className="mb-3">
          <label htmlFor="fullName" className="form-label teks-con">
            Nama lengkap :
          </label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            className="form-control"
            placeholder="Masukan nama lengkap"
            style={{width: '80%'}}
          />
          <ValidationError
            prefix="Nama lengkap"
            field="fullName"
            errors={state.errors}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="kelasJurusan" className="form-label teks-con">
            Kelas & jurusan :
          </label>
          <input
            id="kelasJurusan"
            type="text"
            name="kelasJurusan"
            className="form-control"
            placeholder="Masukan kelas & jurusan"
            style={{width: '80%'}}
          />
          <ValidationError
            prefix="Kelas & jurusan"
            field="kelasJurusan"
            errors={state.errors}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="message" className="form-label teks-con">
            Tulis pesan :
          </label>
          <textarea
            id="message"
            name="message"
            className="form-control"
            rows={3}
            placeholder="Tulis pesan anda disini"
            style={{width: '80%'}}
          />
          <ValidationError prefix="Pesan" field="message" errors={state.errors} />
        </div>

        <button type="submit" className="btn btn-primary" disabled={state.submitting}>
          Kirim
        </button>
      </form>
            </div>
            <div className="peta">
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.489466999513!2d106.7562394740124!3d-6.585915564378438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c5457e0e3bcf%3A0x58481d58737539c0!2sSMK%20Negeri%201%20Ciomas!5e0!3m2!1sid!2sid!4v1705546703878!5m2!1sid!2sid"
              style={{ border: 0 }}
              width="600"
              height="370"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  </Container>
</div>
{/* Page kontak */}

    </div>
    <FooterComponent />
    </>
  )
}

export default HomePage