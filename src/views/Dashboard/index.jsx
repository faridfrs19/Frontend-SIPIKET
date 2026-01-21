import '../../../public/assets/css/main.css'

//import useState and useEffect
import { useState, useEffect, useRef } from 'react';
import edit from '../../assets/image/edit.svg';
import hapus from '../../assets/image/delete.svg';
import { Table, Pagination, InputGroup, FormControl, Button, Modal, Form} from 'react-bootstrap';
// import alert
import Swal from 'sweetalert2'
//import api
import Api from '../../api';

//import permissions
import hasAnyPermission from '../../utils/Permissions.jsx';

//import js cookie
import Cookies from 'js-cookie';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/swiper-bundle.css';

// import required modules
import { Scrollbar, Autoplay } from 'swiper/modules';

//import layout
import LayoutDefault from "../../layouts/Default";

export default function Dashboard() {
    // State untuk menampilkan atau menyembunyikan form tambah siswa
    const [showAddForm, setShowAddForm] = useState(false);
    // zoom img
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    // zoom img
    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowImageModal(true);
      };
    //title page
    document.title = "Dashboard - SIPIKET";

    //define state
    const [userData, setUserData] = useState(null);

    //token from cookies
    const token = Cookies.get('token');

    //method fetchData
    const fetchData = async () => {

       //set axios header dengan type Authorization + Bearer token
        Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        await Api.get('/api/admin/dashboard')
        .then(response => {

            //set response to state
            setUserData(response.data.data);
        })

    }

    //useEffect
    useEffect(() => {

        //call method "fetchData"
        fetchData();

    }, []);
    
    // Define state for the current time and date
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    // Function to update the current time and date
    const updateCurrentDateTime = () => {
        setCurrentDateTime(new Date());
    };

    // Use useEffect to set up the interval for updating the time and date
    useEffect(() => {
        const intervalId = setInterval(updateCurrentDateTime, 1000); // Update every second

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    // Function to format the date in a readable format
    const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    };

    // Function to calculate angle based on time
    const calculateAngle = (value, max) => (360 * value) / max;

    const [teacherSchedule, setTeacherSchedule] = useState([]);
    
    // Gunakan useEffect untuk mengupdate jadwal guru sesuai hari
    useEffect(() => {
        const currentDay = currentDateTime.toLocaleDateString('id-ID', { weekday: 'long' });
        const currentTeacher = jadwal_gurupiket.find((jadwal_gurupiket) => jadwal_gurupiket.hari === currentDay);
        setTeacherSchedule(currentTeacher ? [currentTeacher] : []);
    }, [currentDateTime]);

     // State untuk konfigurasi waktu istirahat
    const [breakTimeConfig, setBreakTimeConfig] = useState([
        { startBreakTime: [9, 55], endBreakTime: [10, 15] }, // Istirahat pertama
        { startBreakTime: [12, 0], endBreakTime: [13, 0] },  // Istirahat kedua
    ]);
    
     // Fungsi untuk memeriksa apakah saat ini waktu istirahat
    const isBreakTime = (currentDateTime, breakTime) => {
        const startBreak = new Date(currentDateTime);
        const endBreak = new Date(currentDateTime);
        startBreak.setHours(...breakTime.startBreakTime, 0, 0);
        endBreak.setHours(...breakTime.endBreakTime, 0, 0);
        return currentDateTime >= startBreak && currentDateTime < endBreak;
    };

    // /////////////////// Jadwal guru
    const [jadwal_gurupiket, setJadwal_gurupiket] = useState([]);

    // ambil data absen dan menampilkannya + paginaton
    const fetchDataJadwal_gurupiket = async () => {
        Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        await Api.get(`/api/admin/jadwalgurupiket`)
            .then(response => {
                setJadwal_gurupiket(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching absens:', error);
            });
    };

    //run hook useEffect
    useEffect(() => {
        
    //call method "fetchDataAbsens"
    fetchDataJadwal_gurupiket();

    }, []);

    //  //method deletePost
    const deleteJadwal_gurupiket = async (id) => {
        
        //delete with api
        await Api.delete(`/api/admin/jadwalgurupiket/${id}`)
            .then(() => {
                
                fetchDataJadwal_gurupiket();

            })
    }
    const confirmDelete = (id) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
            confirmButton: "btn btn-success mx-2",
            cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: "Apakah kamu yakin ingin menghapusnya?",
            text: "Data akan terhapus!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, saya yakin!",
            cancelButtonText: "Tidak, batalakan!",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                deleteJadwal_gurupiket(id);
            swalWithBootstrapButtons.fire({
                title: "Terhapus!",
                text: "Data berhasil di hapus.",
                icon: "success"
            });
            } else if (
            result.dismiss === Swal.DismissReason.cancel
            ) {
            swalWithBootstrapButtons.fire({
                title: "Dibatalkan",
                text: "Data tidak jadi dihapus :)",
                icon: "error"
            });
            }
        });
    };
    
    // menambahkan absen dan menyimpan di table
    const [hari, setHari] = useState('');
    const [name_gurupiket1, setName_gurupiket1] = useState('');
    const [name_gurupiket2, setName_gurupiket2] = useState('');
    const [name_gurupiket3, setName_gurupiket3] = useState('');
    const [name_gurupiket4, setName_gurupiket4] = useState('');
    const [telepon1, setTelepon1] = useState('');
    const [telepon2, setTelepon2] = useState('');
    const [telepon3, setTelepon3] = useState('');
    const [telepon4, setTelepon4] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');

    // State for validation errors
    const [errors, setErrors] = useState([]);

     //method handle file change
    const handleFileChange1 = (e) => {
        setImage1(e.target.files[0]);
    }
    const handleFileChange2 = (e) => {
        setImage2(e.target.files[0]);
    }
    const handleFileChange3 = (e) => {
        setImage3(e.target.files[0]);
    }
    const handleFileChange4 = (e) => {
        setImage4(e.target.files[0]);
    }

    // Handle form submit
    const storeJadwal_gurupiket = async (e) => {
        e.preventDefault();

    // Inisialisasi FormData
    const formData = new FormData();

    // Tambahkan data
    formData.append('hari', hari);
    formData.append('name_gurupiket1', name_gurupiket1);
    formData.append('name_gurupiket2', name_gurupiket2);
    formData.append('name_gurupiket3', name_gurupiket3);
    formData.append('name_gurupiket4', name_gurupiket4);
    formData.append('telepon1', telepon1);
    formData.append('telepon2', telepon2);
    formData.append('telepon3', telepon3);
    formData.append('telepon4', telepon4);
    formData.append('image1', image1);
    formData.append('image2', image2);
    formData.append('image3', image3);
    formData.append('image4', image4);

    try {
        await Api.post('/api/admin/jadwalgurupiket', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            
        });

        fetchDataJadwal_gurupiket(); // Perbarui data untuk memperbarui tabel
        setShowAddForm(false); // Sembunyikan formulir setelah berhasil menambahkan data

        // Tampilkan pemberitahuan SweetAlert
        Swal.fire({
            title: 'Berhasil!',
            text: 'Data absen berhasil ditambahkan.',
            icon: 'success',
        });
    } catch (error) {
        // Tampilkan pemberitahuan SweetAlert untuk kesalahan
        Swal.fire({
            title: 'Gagal!',
            text: 'Terjadi kesalahan saat menambahkan data absen.',
            icon: 'error',
        });
        setErrors(error.response.data);
    }
};


    // membuat fungsi edit menggunakan api berdasarkan id
    const [editJadwal_gurupiketId, setEditJadwal_gurupiketId] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
  
    const findJadwal_gurupiketById = (id) => {
        return jadwal_gurupiket.find((jadwal_gurupiket) => jadwal_gurupiket.id === id);
    };    
  
        // Fungsi untuk mengatur data pengguna yang akan diedit
        const handleEdit = (id) => {
            const jadwal_gurupiketToEdit = findJadwal_gurupiketById(id);
            setEditJadwal_gurupiketId(id);
        
            // Fill the form with existing user data
            setHari(jadwal_gurupiketToEdit.hari);
            setName_gurupiket1(jadwal_gurupiketToEdit.name_gurupiket1);
            setName_gurupiket2(jadwal_gurupiketToEdit.name_gurupiket2);
            setName_gurupiket3(jadwal_gurupiketToEdit.name_gurupiket3);
            setName_gurupiket4(jadwal_gurupiketToEdit.name_gurupiket4);
            setTelepon1(jadwal_gurupiketToEdit.telepon1);
            setTelepon2(jadwal_gurupiketToEdit.telepon2);
            setTelepon3(jadwal_gurupiketToEdit.telepon3);
            setTelepon4(jadwal_gurupiketToEdit.telepon4);
            setImage1(jadwal_gurupiketToEdit.image1);
            setImage2(jadwal_gurupiketToEdit.image2);
            setImage3(jadwal_gurupiketToEdit.image3);
            setImage4(jadwal_gurupiketToEdit.image4);
            setShowEditForm(true);
          };
      
          // Fungsi untuk menangani submit form edit pengguna
          const handleEditFormSubmit = async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append('hari', hari);
            formData.append('name_gurupiket1', name_gurupiket1);
            formData.append('name_gurupiket2', name_gurupiket2);
            formData.append('name_gurupiket3', name_gurupiket3);
            formData.append('name_gurupiket4', name_gurupiket4);
            formData.append('telepon1', telepon1);
            formData.append('telepon2', telepon2);
            formData.append('telepon3', telepon3);
            formData.append('telepon4', telepon4);
            formData.append('image1', image1);
            formData.append('image2', image2);
            formData.append('image3', image3);
            formData.append('image4', image4);
            formData.append('_method', 'PUT');
            
            try {
              await Api.post(`/api/admin/jadwalgurupiket/${editJadwal_gurupiketId}`, formData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data',    
                },
              });

              fetchDataJadwal_gurupiket(); // Ambil data ulang untuk memperbarui tabel
              setShowEditForm(false); // Sembunyikan form edit

              // Tampilkan notifikasi SweetAlert
              Swal.fire({
                title: 'Berhasil!',
                text: 'Data pengguna berhasil diperbarui.',
                icon: 'success',
              });
            } catch (error) {
              // Tampilkan notifikasi SweetAlert untuk error
              Swal.fire({
                title: 'Gagal!',
                text: 'Terjadi kesalahan saat memperbarui pengguna.',
                icon: 'error',
              });
            // setErrors(error.response.data);
            // console.error('Error fetching absenss:', error);
            }
          };
          

    return (
        <LayoutDefault>
            <div className="container-fluid mb-5 mt-4">
                <div className="row">
                
                    {hasAnyPermission(['absen.index']) &&
                    <div className="col-12 col-sm-6 col-xl-3 mb-4">
                        <div className="card border-0 shadow">
                            <div className="card-body">
                                <div className="row d-block d-xl-flex align-items-center">
                                    <div
                                        className="col-12 col-xl-5 text-xl-center mb-3 mb-xl-0 d-flex align-items-center justify-content-xl-center">
                                        <div className="icon-shape icon-shape-info rounded me-4 me-sm-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-folder" viewBox="0 0 16 16">
                                                <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4H2.19zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707z" />
                                            </svg>
                                        </div>
                                        <div className="d-sm-none">
                                            <h6 className="h6">Absensi</h6>
                                            <h5 className="fw-extrabold mb-1">{userData ? userData.siswa_absen : 'Loading...'}</h5>
                                        </div>
                                    </div>
                                    <div className="col-12 col-xl-7 px-xl-0">
                                        <div className="d-none d-sm-block">
                                            <h6 className="h6">Absensi</h6>
                                            <h5 className="fw-extrabold mb-1">{userData ? userData.siswa_absen : 'Loading...'}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    }

                    {hasAnyPermission(['surat_masuk.index']) &&
                    <div className="col-12 col-sm-6 col-xl-3 mb-4">
                        <div className="card border-0 shadow">
                            <div className="card-body">
                                <div className="row d-block d-xl-flex align-items-center">
                                    <div
                                        className="col-12 col-xl-5 text-xl-center mb-3 mb-xl-0 d-flex align-items-center justify-content-xl-center">
                                        <div className="icon-shape icon-shape-success rounded me-4 me-sm-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                            </svg>
                                        </div>
                                        <div className="d-sm-none">
                                            <h6 className="h6">Izin Masuk</h6>
                                            <h5 className="fw-extrabold mb-1">{userData ? userData.surat_masuk : 'Loading...'}</h5>
                                        </div>
                                    </div>
                                    <div className="col-12 col-xl-7 px-xl-0">
                                        <div className="d-none d-sm-block">
                                            <h6 className="h6">Izin Masuk</h6>
                                            <h5 className="fw-extrabold mb-1">{userData ? userData.surat_masuk : 'Loading...'}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    }

                    {hasAnyPermission(['surat_keluar.index']) &&
                    <div className="col-12 col-sm-6 col-xl-3 mb-4">
                        <div className="card border-0 shadow">
                            <div className="card-body">
                                <div className="row d-block d-xl-flex align-items-center">
                                    <div
                                        className="col-12 col-xl-5 text-xl-center mb-3 mb-xl-0 d-flex align-items-center justify-content-xl-center">
                                        <div className="icon-shape icon-shape-success rounded me-4 me-sm-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                            </svg>
                                        </div>
                                        <div className="d-sm-none">
                                            <h6 className="h6">Izin Keluar</h6>
                                            <h5 className="fw-extrabold mb-1">{userData ? userData.surat_keluar : 'Loading...'}</h5>
                                        </div>
                                    </div>
                                    <div className="col-12 col-xl-7 px-xl-0">
                                        <div className="d-none d-sm-block">
                                            <h6 className="h6">Izin Keluar</h6>
                                            <h5 className="fw-extrabold mb-1">{userData ? userData.surat_keluar : 'Loading...'}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    }

                    {hasAnyPermission(['surat_pulang.index']) &&
                    <div className="col-12 col-sm-6 col-xl-3 mb-4">
                        <div className="card border-0 shadow">
                            <div className="card-body">
                                <div className="row d-block d-xl-flex align-items-center">
                                    <div
                                        className="col-12 col-xl-5 text-xl-center mb-3 mb-xl-0 d-flex align-items-center justify-content-xl-center">
                                        <div className="icon-shape icon-shape-success rounded me-4 me-sm-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                            </svg>
                                        </div>
                                        <div className="d-sm-none">
                                            <h6 className="h6">Izin Pulang</h6>
                                            <h5 className="fw-extrabold mb-1">{userData ? userData.surat_pulang : 'Loading...'}</h5>
                                        </div>
                                    </div>
                                    <div className="col-12 col-xl-7 px-xl-0">
                                        <div className="d-none d-sm-block">
                                            <h6 className="h6">Izin Pulang</h6>
                                            <h5 className="fw-extrabold mb-1">{userData ? userData.surat_pulang : 'Loading...'}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    }

                    {hasAnyPermission(['tugas_guru.index']) &&
                    <div className="col-12 col-sm-6 col-xl-3 mb-4">
                        <div className="card border-0 shadow">
                            <div className="card-body">
                                <div className="row d-block d-xl-flex align-items-center">
                                    <div
                                        className="col-12 col-xl-5 text-xl-center mb-3 mb-xl-0 d-flex align-items-center justify-content-xl-center">
                                        <div className="icon-shape icon-shape-tertiary rounded me-4 me-sm-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-image-fill" viewBox="0 0 16 16">
                                                <path d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2V3zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12zm5-6.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z" />
                                            </svg>
                                        </div>
                                        <div className="d-sm-none">
                                            <h6 className="h6">Info Tugas</h6>
                                            <h5 className="fw-extrabold mb-1">{userData ? userData.tugas_guru : 'Loading...'}</h5>
                                        </div>
                                    </div>
                                    <div className="col-12 col-xl-7 px-xl-0">
                                        <div className="d-none d-sm-block">
                                            <h6 className="h6">Info Tugas</h6>
                                            <h5 className="fw-extrabold mb-1">{userData ? userData.tugas_guru : 'Loading...'}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    }

                    {hasAnyPermission(['users.index']) &&
                    <div className="col-12 col-sm-6 col-xl-3 mb-4">
                        <div className="card border-0 shadow">
                            <div className="card-body">
                                <div className="row d-block d-xl-flex align-items-center">
                                    <div
                                        className="col-12 col-xl-5 text-xl-center mb-3 mb-xl-0 d-flex align-items-center justify-content-xl-center">
                                        <div className="icon-shape icon-shape-danger rounded me-4 me-sm-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                                                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
                                            </svg>
                                        </div>
                                        <div className="d-sm-none">
                                            <h6 className="h6">Users</h6>
                                            <h5 className="fw-extrabold mb-1">{userData ? userData.users : 'Loading...'}</h5>
                                        </div>
                                    </div>
                                    <div className="col-12 col-xl-7 px-xl-0">
                                        <div className="d-none d-sm-block">
                                            <h6 className="h6">Users</h6>
                                            <h5 className="fw-extrabold mb-1">{userData ? userData.users : 'Loading...'}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    }

                </div>

                <div className="row">
                    <div className="col-12 col-md-6 mb-4">
                        <div className="card border-0 shadow">
                            <div className="card-body text-center" style={{height:'360px'}}>
                                <h6 className="h6">Waktu dan tanggal</h6>
                                <div className="clock-container">
                                    <svg height="200" width="200">
                                        {/* Bentuk jam */}
                                        <circle cx="100" cy="100" r="90" fill="#4570de7f"stroke="#343a40" strokeWidth="4" />

                                        {/* Angka di jam */}
                                        <g fontFamily="Arial" fontSize="12" textAnchor="middle" dominantBaseline="middle">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((number, index) => (
                                                <text
                                                    key={index}
                                                    x={100 + 75 * Math.sin(((2 * Math.PI) / 12) * number)}
                                                    y={100 - 75 * Math.cos(((2 * Math.PI) / 12) * number)}
                                                >
                                                    {number}
                                                </text>
                                            ))}
                                        </g>
                                        
                                        {/* jarum jam */}
                                        <line
                                            x1="100"
                                            y1="100"
                                            x2="100"
                                            y2="50"
                                            transform={`rotate(${calculateAngle(currentDateTime.getHours(), 12)}, 100, 100)`}
                                            stroke="#f8f9fa"
                                            strokeWidth="6"
                                        />
                                        
                                        {/* Jarum Menit */}
                                        <line
                                            x1="100"
                                            y1="100"
                                            x2="100"
                                            y2="40"
                                            transform={`rotate(${calculateAngle(currentDateTime.getMinutes(), 60)}, 100, 100)`}
                                            stroke="#f8f9fa"
                                            strokeWidth="4"
                                        />
                                        
                                        {/* Jarum Detik */}
                                        <line
                                            x1="100"
                                            y1="100"
                                            x2="100"
                                            y2="30"
                                            transform={`rotate(${calculateAngle(currentDateTime.getSeconds(), 60)}, 100, 100)`}
                                            stroke="red"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                    <h2 className={`fw-extrabold mb-0 mx-3 ${isBreakTime(currentDateTime, breakTimeConfig[0]) || isBreakTime(currentDateTime, breakTimeConfig[1]) ? 'text-danger' : ''}`}>
                                        {currentDateTime.toLocaleTimeString('id-ID')} <span className='fw-normal' style={{ color: 'black' }}>WIB</span>
                                    </h2>
                                    <p className="mb-0" style={{ color: 'red' }}>
                                        {(isBreakTime(currentDateTime, breakTimeConfig[0]) || isBreakTime(currentDateTime, breakTimeConfig[1])) ? 'Waktu nya Istirahat' : ''}
                                    </p>
                                    <h5 className="mb-0" style={{color: 'black'}}>{formatDate(currentDateTime)}</h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 mb-4">
                <div className="card border-0 shadow">
                <div className="card-body text-center" style={{width: '100%', height: '360px'}}>
                <h6 className="h6">Guru Piket Hari Ini</h6>
            <>
            <Swiper
                scrollbar={{
                hide: true,
                }}
                modules={[Scrollbar, Autoplay]}
                className="mySwiper"
                style={{width: '100%', height: '100%'}}
                autoplay={{ delay: 2000 }}
            >
                <SwiperSlide>
                {teacherSchedule.map((jadwal_gurupiket) => (
                           <div key={jadwal_gurupiket.hari} className="teacher-info">
                           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                               <img
                                   src={jadwal_gurupiket.image1}
                                   alt={jadwal_gurupiket.name_gurupiket1}
                                   className="teacher-image mb-1"
                                   style={{ borderRadius: '50%', width: '51.3%', backgroundSize: 'cover'}}
                               />
                               <div className='fw-extrabold border-3 border-bottom border-info' style={{ color: 'black' }}>
                                   <h4>{jadwal_gurupiket.name_gurupiket1}</h4>
                                   <p className='mt-0 mb-0' style={{ color: 'black' }}>No Telp: {jadwal_gurupiket.telepon1}</p>
                               </div>
                               <p className="mb-0" style={{ color: 'red' }}>
                                {(isBreakTime(currentDateTime, breakTimeConfig[0]) || isBreakTime(currentDateTime, breakTimeConfig[1])) ? 'Sedang Istirahat' : ''}
                                </p>
                           </div>
                       </div>
                        ))}
                </SwiperSlide>
                <SwiperSlide>
                {teacherSchedule.map((jadwal_gurupiket) => (
                           <div key={jadwal_gurupiket.hari} className="teacher-info">
                           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                               <img
                                   src={jadwal_gurupiket.image2}
                                   alt={jadwal_gurupiket.name_gurupiket2}
                                   className="teacher-image mb-1"
                                   style={{ borderRadius: '50%', width: '51.3%', backgroundSize: 'cover'}}
                               />
                               <div className='fw-extrabold border-3 border-bottom border-info' style={{ color: 'black' }}>
                                   <h4>{jadwal_gurupiket.name_gurupiket2}</h4>
                                   <p className='mt-0 mb-0' style={{ color: 'black' }}>No Telp: {jadwal_gurupiket.telepon2}</p>
                               </div>
                               <p className="mb-0" style={{ color: 'red' }}>
                                {(isBreakTime(currentDateTime, breakTimeConfig[0]) || isBreakTime(currentDateTime, breakTimeConfig[1])) ? 'Sedang Istirahat' : ''}
                                </p>
                           </div>
                       </div>
                        ))}
                </SwiperSlide>
                <SwiperSlide>
                {teacherSchedule.map((jadwal_gurupiket) => (
                           <div key={jadwal_gurupiket.hari} className="teacher-info">
                           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                               <img
                                   src={jadwal_gurupiket.image3}
                                   alt={jadwal_gurupiket.name_gurupiket3}
                                   className="teacher-image mb-1"
                                   style={{ borderRadius: '50%', width: '51.3%', backgroundSize: 'cover'}}
                               />
                               <div className='fw-extrabold border-3 border-bottom border-info' style={{ color: 'black' }}>
                                   <h4>{jadwal_gurupiket.name_gurupiket3}</h4>
                                   <p className='mt-0 mb-0' style={{ color: 'black' }}>No Telp: {jadwal_gurupiket.telepon3}</p>
                               </div>
                               <p className="mb-0" style={{ color: 'red' }}>
                                {(isBreakTime(currentDateTime, breakTimeConfig[0]) || isBreakTime(currentDateTime, breakTimeConfig[1])) ? 'Sedang Istirahat' : ''}
                                </p>
                           </div>
                       </div>
                        ))}
                </SwiperSlide>
                <SwiperSlide>
                {teacherSchedule.map((jadwal_gurupiket) => (
                           <div key={jadwal_gurupiket.hari} className="teacher-info">
                           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                               <img
                                   src={jadwal_gurupiket.image4}
                                   alt={jadwal_gurupiket.name_gurupiket4}
                                   className="teacher-image mb-1"
                                   style={{ borderRadius: '50%', width: '51.3%', backgroundSize: 'cover'}}
                               />
                               <div className='fw-extrabold border-3 border-bottom border-info' style={{ color: 'black' }}>
                                   <h4>{jadwal_gurupiket.name_gurupiket4}</h4>
                                   <p className='mt-0 mb-0' style={{ color: 'black' }}>No Telp: {jadwal_gurupiket.telepon4}</p>
                               </div>
                               <p className="mb-0" style={{ color: 'red' }}>
                                {(isBreakTime(currentDateTime, breakTimeConfig[0]) || isBreakTime(currentDateTime, breakTimeConfig[1])) ? 'Sedang Istirahat' : ''}
                                </p>
                           </div>
                       </div>
                        ))}
                </SwiperSlide>
            </Swiper>
            </>
            </div>
        </div>
    </div>

                            {/* zoom img */}
            <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Foto Guru</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <img src={selectedImage} alt="Large View" style={{ width: '100%' }} />
            </Modal.Body>
            </Modal>

            {hasAnyPermission(['tugas_guru.index']) &&
            <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
                {/* Tombol untuk menampilkan form tambah data */}
            <Button  style={{background: '#4570de'}} onClick={() => setShowAddForm(true)}>
                Tambah Jadwal
            </Button>

            {/* Modal Form Tambah User */}
            <Modal show={showAddForm} onHide={() => setShowAddForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Jadwal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={storeJadwal_gurupiket}>

                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Hari</label>
                                    <select className="form-select" onChange={(e) => setHari(e.target.value)}>
                                        <option value="" style={{color: 'black'}}>Pilih Hari</option>
                                        <option value="Minggu" style={{ color: 'black' }}>Minggu</option>
                                        <option value="Senin" style={{ color: 'black' }}>Senin</option>
                                        <option value="Selasa" style={{ color: 'black' }}>Selasa</option>
                                        <option value="Rabu" style={{ color: 'black' }}>Rabu</option>
                                        <option value="Kamis" style={{ color: 'black' }}>Kamis</option>
                                        <option value="Jumat" style={{ color: 'black' }}>Jumat</option>
                                        <option value="Sabtu" style={{ color: 'black' }}>Sabtu</option>
                                    </select>
                                    {errors.hari && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.hari[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Guru Piket 1</label>
                                    <select className="form-select" onChange={(e) => setName_gurupiket1(e.target.value)}>
                                    <option value="" style={{color: 'black'}}>Pilih Guru</option>
                                    <option value="Tina Maihasti, S.I.Kom." style={{ color: 'black' }}>Tina Maihasti, S.I.Kom.</option>
                                    <option value="Belinda Indriani Bomantara, S.S." style={{ color: 'black' }}>Belinda Indriani Bomantara, S.S.</option>
                                    <option value="Wulandari, S.Pd" style={{ color: 'black' }}>Wulandari, S.Pd</option>
                                    <option value="Nani Maryadi, S.Pd" style={{ color: 'black' }}>Nani Maryadi, S.Pd</option>
                                    <option value="Tedi Hariadi, S.Kom" style={{ color: 'black' }}>Tedi Hariadi, S.Kom</option>
                                    <option value="Dewan Cakra Kharisma, S.I.Kom" style={{ color: 'black' }}>Dewan Cakra Kharisma, S.I.Kom</option>
                                    <option value="Delika Pratiwi, S.Kom" style={{ color: 'black' }}>Delika Pratiwi, S.Kom</option>
                                    <option value="Suci Ramadhanti, S.Pd" style={{ color: 'black' }}>Suci Ramadhanti, S.Pd</option>
                                    <option value="Rizky Muhammad Ramdan, S.Kom" style={{ color: 'black' }}>Rizky Muhammad Ramdan, S.Kom</option>
                                    <option value="Mutia Oktaviani, S.Pd" style={{ color: 'black' }}>Mutia Oktaviani, S.Pd</option>
                                    <option value="Maman Sulaeman, S.Pd" style={{ color: 'black' }}>Maman Sulaeman, S.Pd</option>
                                    <option value="Desi Nurfauziah, S.Pd" style={{ color: 'black' }}>Desi Nurfauziah, S.Pd</option>
                                    <option value="Wagino, S.T." style={{ color: 'black' }}>Wagino, S.T.</option>
                                    <option value="Abdul Ruhyat, S.Pd" style={{ color: 'black' }}>Abdul Ruhyat, S.Pd</option>
                                    <option value="Riyana Hermadiana, S.SI" style={{ color: 'black' }}>Riyana Hermadiana, S.SI</option>
                                    <option value="Rahmatullah, S.PdI" style={{ color: 'black' }}>Rahmatullah, S.PdI</option>
                                    </select>
                                    {errors.name_gurupiket1 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.name_gurupiket1[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Foto Guru 1</label>
                                    <input type="file" className="form-control" onChange={handleFileChange1}/>
                                    {errors.image1 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.image1[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>No Telp</label>
                                    <input type="text" className="form-control" onChange={(e) => setTelepon1(e.target.value)} placeholder="Masukan no telp" />
                                    {errors.telepon1 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.telepon1[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Guru Piket 2</label>
                                    <select className="form-select" onChange={(e) => setName_gurupiket2(e.target.value)}>
                                    <option value="" style={{color: 'black'}}>Pilih Guru</option>
                                    <option value="Tina Maihasti, S.I.Kom." style={{ color: 'black' }}>Tina Maihasti, S.I.Kom.</option>
                                    <option value="Belinda Indriani Bomantara, S.S." style={{ color: 'black' }}>Belinda Indriani Bomantara, S.S.</option>
                                    <option value="Wulandari, S.Pd" style={{ color: 'black' }}>Wulandari, S.Pd</option>
                                    <option value="Nani Maryadi, S.Pd" style={{ color: 'black' }}>Nani Maryadi, S.Pd</option>
                                    <option value="Tedi Hariadi, S.Kom" style={{ color: 'black' }}>Tedi Hariadi, S.Kom</option>
                                    <option value="Dewan Cakra Kharisma, S.I.Kom" style={{ color: 'black' }}>Dewan Cakra Kharisma, S.I.Kom</option>
                                    <option value="Delika Pratiwi, S.Kom" style={{ color: 'black' }}>Delika Pratiwi, S.Kom</option>
                                    <option value="Suci Ramadhanti, S.Pd" style={{ color: 'black' }}>Suci Ramadhanti, S.Pd</option>
                                    <option value="Rizky Muhammad Ramdan, S.Kom" style={{ color: 'black' }}>Rizky Muhammad Ramdan, S.Kom</option>
                                    <option value="Mutia Oktaviani, S.Pd" style={{ color: 'black' }}>Mutia Oktaviani, S.Pd</option>
                                    <option value="Maman Sulaeman, S.Pd" style={{ color: 'black' }}>Maman Sulaeman, S.Pd</option>
                                    <option value="Desi Nurfauziah, S.Pd" style={{ color: 'black' }}>Desi Nurfauziah, S.Pd</option>
                                    <option value="Wagino, S.T." style={{ color: 'black' }}>Wagino, S.T.</option>
                                    <option value="Abdul Ruhyat, S.Pd" style={{ color: 'black' }}>Abdul Ruhyat, S.Pd</option>
                                    <option value="Riyana Hermadiana, S.SI" style={{ color: 'black' }}>Riyana Hermadiana, S.SI</option>
                                    <option value="Rahmatullah, S.PdI" style={{ color: 'black' }}>Rahmatullah, S.PdI</option>
                                    </select>
                                    {errors.name_gurupiket2 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.name_gurupiket2[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Foto Guru 2</label>
                                    <input type="file" className="form-control" onChange={handleFileChange2}/>
                                    {errors.image2 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.image2[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>No Telp</label>
                                    <input type="text" className="form-control" onChange={(e) => setTelepon2(e.target.value)} placeholder="Masukan no telp" />
                                    {errors.telepon2 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.telepon2[0]}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Guru Piket 3</label>
                                    <select className="form-select" onChange={(e) => setName_gurupiket3(e.target.value)}>
                                    <option value="" style={{color: 'black'}}>Pilih Guru</option>
                                    <option value="Tina Maihasti, S.I.Kom." style={{ color: 'black' }}>Tina Maihasti, S.I.Kom.</option>
                                    <option value="Belinda Indriani Bomantara, S.S." style={{ color: 'black' }}>Belinda Indriani Bomantara, S.S.</option>
                                    <option value="Wulandari, S.Pd" style={{ color: 'black' }}>Wulandari, S.Pd</option>
                                    <option value="Nani Maryadi, S.Pd" style={{ color: 'black' }}>Nani Maryadi, S.Pd</option>
                                    <option value="Tedi Hariadi, S.Kom" style={{ color: 'black' }}>Tedi Hariadi, S.Kom</option>
                                    <option value="Dewan Cakra Kharisma, S.I.Kom" style={{ color: 'black' }}>Dewan Cakra Kharisma, S.I.Kom</option>
                                    <option value="Delika Pratiwi, S.Kom" style={{ color: 'black' }}>Delika Pratiwi, S.Kom</option>
                                    <option value="Suci Ramadhanti, S.Pd" style={{ color: 'black' }}>Suci Ramadhanti, S.Pd</option>
                                    <option value="Rizky Muhammad Ramdan, S.Kom" style={{ color: 'black' }}>Rizky Muhammad Ramdan, S.Kom</option>
                                    <option value="Mutia Oktaviani, S.Pd" style={{ color: 'black' }}>Mutia Oktaviani, S.Pd</option>
                                    <option value="Maman Sulaeman, S.Pd" style={{ color: 'black' }}>Maman Sulaeman, S.Pd</option>
                                    <option value="Desi Nurfauziah, S.Pd" style={{ color: 'black' }}>Desi Nurfauziah, S.Pd</option>
                                    <option value="Wagino, S.T." style={{ color: 'black' }}>Wagino, S.T.</option>
                                    <option value="Abdul Ruhyat, S.Pd" style={{ color: 'black' }}>Abdul Ruhyat, S.Pd</option>
                                    <option value="Riyana Hermadiana, S.SI" style={{ color: 'black' }}>Riyana Hermadiana, S.SI</option>
                                    <option value="Rahmatullah, S.PdI" style={{ color: 'black' }}>Rahmatullah, S.PdI</option>
                                    </select>
                                    {errors.name_gurupiket3 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.name_gurupiket3[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Foto Guru 3</label>
                                    <input type="file" className="form-control" onChange={handleFileChange3}/>
                                    {errors.image3 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.image3[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>No Telp</label>
                                    <input type="text" className="form-control" onChange={(e) => setTelepon3(e.target.value)} placeholder="Masukan no telp" />
                                    {errors.telepon3 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.telepon3[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Guru Piket 4</label>
                                    <select className="form-select" onChange={(e) => setName_gurupiket4(e.target.value)}>
                                    <option value="" style={{color: 'black'}}>Pilih Guru</option>
                                    <option value="Tina Maihasti, S.I.Kom." style={{ color: 'black' }}>Tina Maihasti, S.I.Kom.</option>
                                    <option value="Belinda Indriani Bomantara, S.S." style={{ color: 'black' }}>Belinda Indriani Bomantara, S.S.</option>
                                    <option value="Wulandari, S.Pd" style={{ color: 'black' }}>Wulandari, S.Pd</option>
                                    <option value="Nani Maryadi, S.Pd" style={{ color: 'black' }}>Nani Maryadi, S.Pd</option>
                                    <option value="Tedi Hariadi, S.Kom" style={{ color: 'black' }}>Tedi Hariadi, S.Kom</option>
                                    <option value="Dewan Cakra Kharisma, S.I.Kom" style={{ color: 'black' }}>Dewan Cakra Kharisma, S.I.Kom</option>
                                    <option value="Delika Pratiwi, S.Kom" style={{ color: 'black' }}>Delika Pratiwi, S.Kom</option>
                                    <option value="Suci Ramadhanti, S.Pd" style={{ color: 'black' }}>Suci Ramadhanti, S.Pd</option>
                                    <option value="Rizky Muhammad Ramdan, S.Kom" style={{ color: 'black' }}>Rizky Muhammad Ramdan, S.Kom</option>
                                    <option value="Mutia Oktaviani, S.Pd" style={{ color: 'black' }}>Mutia Oktaviani, S.Pd</option>
                                    <option value="Maman Sulaeman, S.Pd" style={{ color: 'black' }}>Maman Sulaeman, S.Pd</option>
                                    <option value="Desi Nurfauziah, S.Pd" style={{ color: 'black' }}>Desi Nurfauziah, S.Pd</option>
                                    <option value="Wagino, S.T." style={{ color: 'black' }}>Wagino, S.T.</option>
                                    <option value="Abdul Ruhyat, S.Pd" style={{ color: 'black' }}>Abdul Ruhyat, S.Pd</option>
                                    <option value="Riyana Hermadiana, S.SI" style={{ color: 'black' }}>Riyana Hermadiana, S.SI</option>
                                    <option value="Rahmatullah, S.PdI" style={{ color: 'black' }}>Rahmatullah, S.PdI</option>
                                    </select>
                                    {errors.name_gurupiket4 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.name_gurupiket4[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Foto Guru 4</label>
                                    <input type="file" className="form-control" onChange={handleFileChange4}/>
                                    {errors.image4 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.image4[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>No Telp</label>
                                    <input type="text" className="form-control" onChange={(e) => setTelepon4(e.target.value)} placeholder="Masukan no telp" />
                                    {errors.telepon4 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.telepon4[0]}
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="btn btn-md btn-success rounded-sm shadow border-0 mx-2" style={{color: 'white'}}>Simpan</button>
                                <button variant="primary" onClick={() => setShowAddForm(false)} className="btn btn-md btn-secondary rounded-sm shadow border-0">Batal</button>
                            </form>

                </Modal.Body>
            </Modal>
            {/* Modal Form Edit User */}
            <Modal show={showEditForm} onHide={() => setShowEditForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Tugas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={handleEditFormSubmit}>
                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Hari</label>
                                    <select className="form-select" value={hari} onChange={(e) => setHari(e.target.value)}>
                                        <option value="" style={{color: 'black'}}>Pilih Hari</option>
                                        <option value="Minggu" style={{ color: 'black' }}>Minggu</option>
                                        <option value="Senin" style={{ color: 'black' }}>Senin</option>
                                        <option value="Selasa" style={{ color: 'black' }}>Selasa</option>
                                        <option value="Rabu" style={{ color: 'black' }}>Rabu</option>
                                        <option value="Kamis" style={{ color: 'black' }}>Kamis</option>
                                        <option value="Jumat" style={{ color: 'black' }}>Jumat</option>
                                        <option value="Sabtu" style={{ color: 'black' }}>Sabtu</option>
                                    </select>
                                    {errors.hari && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.hari[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Guru Piket 1</label>
                                    <select className="form-select" value={name_gurupiket1} onChange={(e) => setName_gurupiket1(e.target.value)}>
                                    <option value="" style={{color: 'black'}}>Pilih Guru</option>
                                    <option value="Tina Maihasti, S.I.Kom." style={{ color: 'black' }}>Tina Maihasti, S.I.Kom.</option>
                                    <option value="Belinda Indriani Bomantara, S.S." style={{ color: 'black' }}>Belinda Indriani Bomantara, S.S.</option>
                                    <option value="Wulandari, S.Pd" style={{ color: 'black' }}>Wulandari, S.Pd</option>
                                    <option value="Nani Maryadi, S.Pd" style={{ color: 'black' }}>Nani Maryadi, S.Pd</option>
                                    <option value="Tedi Hariadi, S.Kom" style={{ color: 'black' }}>Tedi Hariadi, S.Kom</option>
                                    <option value="Dewan Cakra Kharisma, S.I.Kom" style={{ color: 'black' }}>Dewan Cakra Kharisma, S.I.Kom</option>
                                    <option value="Delika Pratiwi, S.Kom" style={{ color: 'black' }}>Delika Pratiwi, S.Kom</option>
                                    <option value="Suci Ramadhanti, S.Pd" style={{ color: 'black' }}>Suci Ramadhanti, S.Pd</option>
                                    <option value="Rizky Muhammad Ramdan, S.Kom" style={{ color: 'black' }}>Rizky Muhammad Ramdan, S.Kom</option>
                                    <option value="Mutia Oktaviani, S.Pd" style={{ color: 'black' }}>Mutia Oktaviani, S.Pd</option>
                                    <option value="Maman Sulaeman, S.Pd" style={{ color: 'black' }}>Maman Sulaeman, S.Pd</option>
                                    <option value="Desi Nurfauziah, S.Pd" style={{ color: 'black' }}>Desi Nurfauziah, S.Pd</option>
                                    <option value="Wagino, S.T." style={{ color: 'black' }}>Wagino, S.T.</option>
                                    <option value="Abdul Ruhyat, S.Pd" style={{ color: 'black' }}>Abdul Ruhyat, S.Pd</option>
                                    <option value="Riyana Hermadiana, S.SI" style={{ color: 'black' }}>Riyana Hermadiana, S.SI</option>
                                    <option value="Rahmatullah, S.PdI" style={{ color: 'black' }}>Rahmatullah, S.PdI</option>
                                    </select>
                                    {errors.name_gurupiket1 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.name_gurupiket1[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Foto Guru 1</label>
                                    <input type="file" className="form-control" onChange={handleFileChange1}/>
                                    {errors.image1 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.image1[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>No Telp</label>
                                    <input type="text" className="form-control" value={telepon1} onChange={(e) => setTelepon1(e.target.value)} placeholder="Masukan no telp" />
                                    {errors.telepon1 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.telepon1[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Guru Piket 2</label>
                                    <select className="form-select" value={name_gurupiket2} onChange={(e) => setName_gurupiket2(e.target.value)}>
                                    <option value="" style={{color: 'black'}}>Pilih Guru</option>
                                    <option value="Tina Maihasti, S.I.Kom." style={{ color: 'black' }}>Tina Maihasti, S.I.Kom.</option>
                                    <option value="Belinda Indriani Bomantara, S.S." style={{ color: 'black' }}>Belinda Indriani Bomantara, S.S.</option>
                                    <option value="Wulandari, S.Pd" style={{ color: 'black' }}>Wulandari, S.Pd</option>
                                    <option value="Nani Maryadi, S.Pd" style={{ color: 'black' }}>Nani Maryadi, S.Pd</option>
                                    <option value="Tedi Hariadi, S.Kom" style={{ color: 'black' }}>Tedi Hariadi, S.Kom</option>
                                    <option value="Dewan Cakra Kharisma, S.I.Kom" style={{ color: 'black' }}>Dewan Cakra Kharisma, S.I.Kom</option>
                                    <option value="Delika Pratiwi, S.Kom" style={{ color: 'black' }}>Delika Pratiwi, S.Kom</option>
                                    <option value="Suci Ramadhanti, S.Pd" style={{ color: 'black' }}>Suci Ramadhanti, S.Pd</option>
                                    <option value="Rizky Muhammad Ramdan, S.Kom" style={{ color: 'black' }}>Rizky Muhammad Ramdan, S.Kom</option>
                                    <option value="Mutia Oktaviani, S.Pd" style={{ color: 'black' }}>Mutia Oktaviani, S.Pd</option>
                                    <option value="Maman Sulaeman, S.Pd" style={{ color: 'black' }}>Maman Sulaeman, S.Pd</option>
                                    <option value="Desi Nurfauziah, S.Pd" style={{ color: 'black' }}>Desi Nurfauziah, S.Pd</option>
                                    <option value="Wagino, S.T." style={{ color: 'black' }}>Wagino, S.T.</option>
                                    <option value="Abdul Ruhyat, S.Pd" style={{ color: 'black' }}>Abdul Ruhyat, S.Pd</option>
                                    <option value="Riyana Hermadiana, S.SI" style={{ color: 'black' }}>Riyana Hermadiana, S.SI</option>
                                    <option value="Rahmatullah, S.PdI" style={{ color: 'black' }}>Rahmatullah, S.PdI</option>
                                    </select>
                                    {errors.name_gurupiket2 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.name_gurupiket2[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Foto Guru 2</label>
                                    <input type="file" className="form-control" onChange={handleFileChange2}/>
                                    {errors.image2 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.image2[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>No Telp</label>
                                    <input type="text" className="form-control" value={telepon2} onChange={(e) => setTelepon2(e.target.value)} placeholder="Masukan no telp" />
                                    {errors.telepon2 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.telepon2[0]}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Guru Piket 3</label>
                                    <select className="form-select" value={name_gurupiket3} onChange={(e) => setName_gurupiket3(e.target.value)}>
                                    <option value="" style={{color: 'black'}}>Pilih Guru</option>
                                    <option value="Tina Maihasti, S.I.Kom." style={{ color: 'black' }}>Tina Maihasti, S.I.Kom.</option>
                                    <option value="Belinda Indriani Bomantara, S.S." style={{ color: 'black' }}>Belinda Indriani Bomantara, S.S.</option>
                                    <option value="Wulandari, S.Pd" style={{ color: 'black' }}>Wulandari, S.Pd</option>
                                    <option value="Nani Maryadi, S.Pd" style={{ color: 'black' }}>Nani Maryadi, S.Pd</option>
                                    <option value="Tedi Hariadi, S.Kom" style={{ color: 'black' }}>Tedi Hariadi, S.Kom</option>
                                    <option value="Dewan Cakra Kharisma, S.I.Kom" style={{ color: 'black' }}>Dewan Cakra Kharisma, S.I.Kom</option>
                                    <option value="Delika Pratiwi, S.Kom" style={{ color: 'black' }}>Delika Pratiwi, S.Kom</option>
                                    <option value="Suci Ramadhanti, S.Pd" style={{ color: 'black' }}>Suci Ramadhanti, S.Pd</option>
                                    <option value="Rizky Muhammad Ramdan, S.Kom" style={{ color: 'black' }}>Rizky Muhammad Ramdan, S.Kom</option>
                                    <option value="Mutia Oktaviani, S.Pd" style={{ color: 'black' }}>Mutia Oktaviani, S.Pd</option>
                                    <option value="Maman Sulaeman, S.Pd" style={{ color: 'black' }}>Maman Sulaeman, S.Pd</option>
                                    <option value="Desi Nurfauziah, S.Pd" style={{ color: 'black' }}>Desi Nurfauziah, S.Pd</option>
                                    <option value="Wagino, S.T." style={{ color: 'black' }}>Wagino, S.T.</option>
                                    <option value="Abdul Ruhyat, S.Pd" style={{ color: 'black' }}>Abdul Ruhyat, S.Pd</option>
                                    <option value="Riyana Hermadiana, S.SI" style={{ color: 'black' }}>Riyana Hermadiana, S.SI</option>
                                    <option value="Rahmatullah, S.PdI" style={{ color: 'black' }}>Rahmatullah, S.PdI</option>
                                    </select>
                                    {errors.name_gurupiket3 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.name_gurupiket3[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Foto Guru 3</label>
                                    <input type="file" className="form-control" onChange={handleFileChange3}/>
                                    {errors.image3 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.image3[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>No Telp</label>
                                    <input type="text" className="form-control" value={telepon3} onChange={(e) => setTelepon3(e.target.value)} placeholder="Masukan no telp" />
                                    {errors.telepon3 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.telepon3[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Guru Piket 4</label>
                                    <select className="form-select" value={name_gurupiket4} onChange={(e) => setName_gurupiket4(e.target.value)}>
                                    <option value="" style={{color: 'black'}}>Pilih Guru</option>
                                    <option value="Tina Maihasti, S.I.Kom." style={{ color: 'black' }}>Tina Maihasti, S.I.Kom.</option>
                                    <option value="Belinda Indriani Bomantara, S.S." style={{ color: 'black' }}>Belinda Indriani Bomantara, S.S.</option>
                                    <option value="Wulandari, S.Pd" style={{ color: 'black' }}>Wulandari, S.Pd</option>
                                    <option value="Nani Maryadi, S.Pd" style={{ color: 'black' }}>Nani Maryadi, S.Pd</option>
                                    <option value="Tedi Hariadi, S.Kom" style={{ color: 'black' }}>Tedi Hariadi, S.Kom</option>
                                    <option value="Dewan Cakra Kharisma, S.I.Kom" style={{ color: 'black' }}>Dewan Cakra Kharisma, S.I.Kom</option>
                                    <option value="Delika Pratiwi, S.Kom" style={{ color: 'black' }}>Delika Pratiwi, S.Kom</option>
                                    <option value="Suci Ramadhanti, S.Pd" style={{ color: 'black' }}>Suci Ramadhanti, S.Pd</option>
                                    <option value="Rizky Muhammad Ramdan, S.Kom" style={{ color: 'black' }}>Rizky Muhammad Ramdan, S.Kom</option>
                                    <option value="Mutia Oktaviani, S.Pd" style={{ color: 'black' }}>Mutia Oktaviani, S.Pd</option>
                                    <option value="Maman Sulaeman, S.Pd" style={{ color: 'black' }}>Maman Sulaeman, S.Pd</option>
                                    <option value="Desi Nurfauziah, S.Pd" style={{ color: 'black' }}>Desi Nurfauziah, S.Pd</option>
                                    <option value="Wagino, S.T." style={{ color: 'black' }}>Wagino, S.T.</option>
                                    <option value="Abdul Ruhyat, S.Pd" style={{ color: 'black' }}>Abdul Ruhyat, S.Pd</option>
                                    <option value="Riyana Hermadiana, S.SI" style={{ color: 'black' }}>Riyana Hermadiana, S.SI</option>
                                    <option value="Rahmatullah, S.PdI" style={{ color: 'black' }}>Rahmatullah, S.PdI</option>
                                    </select>
                                    {errors.name_gurupiket4 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.name_gurupiket4[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Foto Guru 4</label>
                                    <input type="file" className="form-control" onChange={handleFileChange4}/>
                                    {errors.image4 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.image4[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>No Telp</label>
                                    <input type="text" className="form-control" value={telepon4} onChange={(e) => setTelepon4(e.target.value)} placeholder="Masukan no telp" />
                                    {errors.telepon4 && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.telepon4[0]}
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="btn btn-md btn-success rounded-sm shadow border-0 mx-2" style={{color: 'white'}}>Simpan</button>
                                <button variant="primary" onClick={() => setShowEditForm(false)} className="btn btn-md btn-secondary rounded-sm shadow border-0">Batal</button>
                            </form>
                </Modal.Body>
            </Modal>
            </div>
            }

            <div className="table-responsive" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                <table className="table align-middle mb-0 bg-white">
                    <thead style={{background: '#4570de'}}>
                        <tr>
                            <th scope="col" style={{color: 'white'}}>Hari</th>
                            <th scope="col" style={{color: 'white'}}>Guru Piket 1</th>
                            <th scope="col" style={{color: 'white'}}>Foto Guru 1</th>
                            <th scope="col" style={{color: 'white'}}>No Telp</th>
                            <th scope="col" style={{color: 'white'}}>Guru Piket 2</th>
                            <th scope="col" style={{color: 'white'}}>Foto Guru 2</th>
                            <th scope="col" style={{color: 'white'}}>No Telp</th>
                            <th scope="col" style={{color: 'white'}}>Guru Piket 3</th>
                            <th scope="col" style={{color: 'white'}}>Foto Guru 3</th>
                            <th scope="col" style={{color: 'white'}}>No Telp</th>
                            <th scope="col" style={{color: 'white'}}>Guru Piket 4</th>
                            <th scope="col" style={{color: 'white'}}>Foto Guru 4</th>
                            <th scope="col" style={{color: 'white'}}>No Telp</th>
                            <th scope="col" style={{color: 'white'}}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className='table-group-divider'>
                    {jadwal_gurupiket
                    .map((jadwal_gurupiket) => (
                      <tr key={jadwal_gurupiket.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="ms-3">
                              <p className="fw-bold mb-1" style={{ color: 'black' }}>
                                {jadwal_gurupiket.hari}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>{jadwal_gurupiket.name_gurupiket1}</td>
                        <td>
                            <img src={jadwal_gurupiket.image1} alt={jadwal_gurupiket.name_gurupiket1} width="200" style={{ cursor: 'pointer' }} onClick={() => handleImageClick(jadwal_gurupiket.image1)}/>
                        </td>
                        <td>{jadwal_gurupiket.telepon1}</td>
                        <td>{jadwal_gurupiket.name_gurupiket2}</td>
                        <td>
                        <img src={jadwal_gurupiket.image2} alt={jadwal_gurupiket.name_gurupiket2} width="200" style={{ cursor: 'pointer' }} onClick={() => handleImageClick(jadwal_gurupiket.image2)}/>
                        </td>
                        <td>{jadwal_gurupiket.telepon2}</td>
                        <td>{jadwal_gurupiket.name_gurupiket3}</td>
                        <td>
                        <img src={jadwal_gurupiket.image3} alt={jadwal_gurupiket.name_gurupiket3} width="200" style={{ cursor: 'pointer' }} onClick={() => handleImageClick(jadwal_gurupiket.image3)}/>
                        </td>
                        <td>{jadwal_gurupiket.telepon3}</td>
                        <td>{jadwal_gurupiket.name_gurupiket4}</td>
                        <td>
                        <img src={jadwal_gurupiket.image4} alt={jadwal_gurupiket.name_gurupiket4} width="200" style={{ cursor: 'pointer' }} onClick={() => handleImageClick(jadwal_gurupiket.image4)}/>
                        </td>
                        <td>{jadwal_gurupiket.telepon4}</td>
                        {hasAnyPermission(['tugas_guru.index']) &&
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <button
                              onClick={() => handleEdit(jadwal_gurupiket.id)}
                              type="button"
                              className="btn-edit btn-link btn-sm btn-rounded border-0 mx-2"
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              <img src={edit} alt="" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                            </button>
                            <button
                              onClick={() => confirmDelete(jadwal_gurupiket.id)}
                              type="button"
                              className="btn-delete btn-link btn-sm btn-rounded border-0"
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              <img src={hapus} alt="" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                            </button>
                          </div>
                        </td>
                        }
                      </tr>
                    ))}
                    </tbody>
                </table>
            </div>       
                </div>
            </div>

        </LayoutDefault>
    )

}