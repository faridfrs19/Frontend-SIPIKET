import '../../../public/assets/css/main.css';
import edit from '../../assets/image/edit.svg';
import hapus from '../../assets/image/delete.svg';
import { Table, Pagination, InputGroup, FormControl, Button, Modal, Form } from 'react-bootstrap';
import search from '../../assets/image/search.svg';

// import alert
import Swal from 'sweetalert2'

// Import useState and useEffect
import { useState, useEffect } from 'react';
//import useNavigate
import { useNavigate, useParams } from 'react-router-dom';

// Import api
import Api from '../../api';

// Import layout
import LayoutDefault from "../../layouts/Default";

//import js cookie
import Cookies from 'js-cookie';

export default function Absens() {
    // useNavigate hook
    const navigate = useNavigate();
    // zoom img
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    // //token from cookies
    const token = Cookies.get('token');

    const [selectedDate, setSelectedDate] = useState(null);

    // State untuk filter berdasarkan role
    const [kelasFilter, setKelasFilter] = useState('');
    // State untuk hasil pencarian
    const [searchTerm, setSearchTerm] = useState('');

    // State untuk menampilkan atau menyembunyikan form tambah siswa
    const [showAddForm, setShowAddForm] = useState(false);

    // // State untuk data siswa baru
    // const [newAbsensData, setNewAbsensData] = useState({
    //     username: '',
    //     password: '',
    //     email: '',
    //     role: '',
    // });

    const filterByDate = (absen) => {
        if (!selectedDate) {
            return true;
        }
    
        const absenDate = new Date(absen.waktu_absen).toLocaleDateString();
    
        return absenDate === selectedDate.toLocaleDateString();
    };

    // Fungsi untuk menangani perubahan nilai filter berdasarkan role
    const handleKelasFilterChange = (event) => {
        setKelasFilter(event.target.value);
    };

    // Fungsi untuk menangani perubahan nilai pencarian
    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Fungsi untuk melakukan filter berdasarkan role
    const filterByKelas = (absen) => {
        if (!kelasFilter) {
            return true;
        }
        return absen.kelas.toLowerCase() === kelasFilter.toLowerCase();
    };

    // Fungsi untuk melakukan pencarian
    const searchFilter = (absen) => {
        if (!searchTerm) {
            return true;
        }
        return (
            absen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            absen.kelas.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // zoom img
    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowImageModal(true);
      };
      

    document.title = "Dashboard - SIPIKET";

    // Pagination from api
    const [absens, setAbsens] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
    });

    // ambil data absen dan menampilkannya + paginaton
    const fetchDataAbsens = async (page = 1) => {
        Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        await Api.get(`/api/admin/absens?page=${page}`)
            .then(response => {
                setAbsens(response.data.data);
                setPagination({
                    currentPage: response.data.data.current_page,
                    lastPage: response.data.data.last_page,
                });
            })
            .catch(error => {
                console.error('Error fetching absens:', error);
            });
    };
    const handlePageChange = (page) => {
      fetchDataAbsens(page);
  };


    //run hook useEffect
    useEffect(() => {
        
    //call method "fetchDataAbsens"
    fetchDataAbsens();

    }, []);

    //  //method deletePost
    const deleteAbsens = async (id) => {
        
        //delete with api
        await Api.delete(`/api/admin/absens/${id}`)
            .then(() => {
                
                fetchDataAbsens();

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
                deleteAbsens(id);
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
    const [name, setName] = useState('');
    const [jenis_absen, setJenis_absen] = useState('');
    const [kelas, setKelas] = useState('');
    const [waktu_absen, setWaktu_absen] = useState('');
    const [image, setImage] = useState('');
    const [descriptions, setDescriptions] = useState('');

    // State for validation errors
    const [errors, setErrors] = useState([]);

     //method handle file change
    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    }

    // Handle form submit
const storeAbsens = async (e) => {
    e.preventDefault();

    // Menampilkan SweetAlert loading
    const loadingAlert = Swal.fire({
        title: 'Menambahkan Data',
        text: 'Harap tunggu...',
        icon: 'info',
        allowOutsideClick: false,
        showCancelButton: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        },
    });

    // Inisialisasi FormData
    const formData = new FormData();

    // Tambahkan data
    formData.append('name', name);
    formData.append('jenis_absen', jenis_absen);
    formData.append('kelas', kelas);
    formData.append('waktu_absen', waktu_absen);
    formData.append('image', image);
    formData.append('descriptions', descriptions);

    try {
        // Mengirim permintaan API
        await Api.post('/api/admin/absens', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        // Menutup SweetAlert loading
        loadingAlert.close();

        fetchDataAbsens(); // Perbarui data untuk memperbarui tabel
        setShowAddForm(false); // Sembunyikan formulir setelah berhasil menambahkan data

        // Tampilkan pemberitahuan SweetAlert
        Swal.fire({
            title: 'Berhasil!',
            text: 'Data absen berhasil ditambahkan.',
            icon: 'success',
        });
    } catch (error) {
        // Menutup SweetAlert loading
        loadingAlert.close();

        // Tampilkan pemberitahuan SweetAlert untuk kesalahan
        Swal.fire({
            title: 'Gagal!',
            text: 'Terjadi kesalahan saat menambahkan data absen.',
            icon: 'error',
        });
        // setErrors(error.response.data);
    }
};

    // membuat fungsi edit menggunakan api berdasarkan id
    const [editAbsenId, setEditAbsenId] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
  
    const findAbsenById = (id) => {
        return absens.find((absen) => absen.id === id);
    };    
  
        // Fungsi untuk mengatur data pengguna yang akan diedit
        const handleEdit = (id) => {
            const absenToEdit = findAbsenById(id);
            setEditAbsenId(id);
        
            // Fill the form with existing user data
            setName(absenToEdit.name);
            setJenis_absen(absenToEdit.jenis_absen);
            setKelas(absenToEdit.kelas);
            setWaktu_absen(absenToEdit.waktu_absen);
            setImage(absenToEdit.image);
            setDescriptions(absenToEdit.descriptions);
            setShowEditForm(true);
          };
      
          // Fungsi untuk menangani submit form edit pengguna
          const handleEditFormSubmit = async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append('name', name);
            formData.append('jenis_absen', jenis_absen);
            formData.append('kelas', kelas);
            formData.append('waktu_absen', waktu_absen);
            formData.append('image', image);
            formData.append('descriptions', descriptions);
            formData.append('_method', 'PUT')
            
            try {
                await Api.post(`/api/admin/absens/${editAbsenId}`, formData, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                  },
                });
  
                fetchDataAbsens(); // Ambil data ulang untuk memperbarui tabel
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
              }
            };
          // Membedakan warna dari setiap role
          const getJenis_absenColor = (absen) => {
            switch (absen) {
              case 'Sakit':
                return 'orange'; 
              case 'Izin':
                return 'green';
              case 'Tanpa keterangan':
                return 'red';
              default:
                return 'gray'; 
            }
          };
    
    return (
        <LayoutDefault>

            {/* zoom img */}
            <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Bukti Gambar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <img src={selectedImage} alt="Large View" style={{ width: '100%' }} />
            </Modal.Body>
            </Modal>
            
            <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
                {/* Tombol untuk menampilkan form tambah data */}
            <Button  style={{background: '#4570de'}} onClick={() => setShowAddForm(true)}>
                Tambah Absen
            </Button>

            {/* Modal Form Tambah User */}
            <Modal show={showAddForm} onHide={() => setShowAddForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Absen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={storeAbsens}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Nama Lengkap</label>
                                    <input type="text" className="form-control" onChange={(e) => setName(e.target.value)} placeholder="Masukan nama lengkap" />
                                    {errors.name && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.name[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Jenis Absen</label>
                                    <select className="form-select" onChange={(e) => setJenis_absen(e.target.value)}>
                                        <option value=""style={{color: 'black'}}>Pilih jenis absen</option>
                                        <option value="Izin" style={{color: 'black'}}>Izin</option>
                                        <option value="Sakit" style={{color: 'black'}}>Sakit</option>
                                        <option value="Tanpa keterangan" style={{color: 'black'}}>Tanpa keterangan</option>
                                    </select>
                                    {errors.jenis_absen && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.jenis_absen[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Kelas</label>
                                    <select className="form-select" onChange={(e) => setKelas(e.target.value)}>
                                        <option value=""style={{color: 'black'}}>Pilih kelas</option>
                                        <option value="10 PPLG 1" style={{color: 'black'}}>10 PPLG 1</option>
                                        <option value="10 PPLG 2" style={{color: 'black'}}>10 PPLG 2</option>
                                        <option value="10 PPLG 3" style={{color: 'black'}}>10 PPLG 3</option>
                                        <option value="10 BCF 1" style={{color: 'black'}}>10 BCF 1</option>
                                        <option value="10 BCF 2" style={{color: 'black'}}>10 BCF 2</option>
                                        <option value="10 ANIMASI 1" style={{color: 'black'}}>10 ANIMASI 1</option>
                                        <option value="10 ANIMASI 2" style={{color: 'black'}}>10 ANIMASI 2</option>
                                        <option value="10 TO 1" style={{color: 'black'}}>10 TO 1</option>
                                        <option value="10 TO 2" style={{color: 'black'}}>10 TO 2</option>
                                        <option value="10 TPL 1" style={{color: 'black'}}>10 TPL 1</option>
                                        <option value="10 TPL 2" style={{color: 'black'}}>10 TPL 2</option>
                                        <option value="11 PPLG 1" style={{color: 'black'}}>11 PPLG 1</option>
                                        <option value="11 PPLG 2" style={{color: 'black'}}>11 PPLG 2</option>
                                        <option value="11 PPLG 3" style={{color: 'black'}}>11 PPLG 3</option>
                                        <option value="11 BCF 1" style={{color: 'black'}}>11 BCF 1</option>
                                        <option value="11 BCF 2" style={{color: 'black'}}>11 BCF 2</option>
                                        <option value="11 ANIMASI 1" style={{color: 'black'}}>11 ANIMASI 1</option>
                                        <option value="11 ANIMASI 2" style={{color: 'black'}}>11 ANIMASI 2</option>
                                        <option value="11 TO 1" style={{color: 'black'}}>11 TO 1</option>
                                        <option value="11 TO 2" style={{color: 'black'}}>11 TO 2</option>
                                        <option value="11 TPL 1" style={{color: 'black'}}>11 TPL 1</option>
                                        <option value="11 TPL 2" style={{color: 'black'}}>11 TPL 2</option>
                                        <option value="12 PPLG 1" style={{color: 'black'}}>12 PPLG 1</option>
                                        <option value="12 PPLG 2" style={{color: 'black'}}>12 PPLG 2</option>
                                        <option value="12 PPLG 3" style={{color: 'black'}}>12 PPLG 3</option>
                                        <option value="12 BCF 1" style={{color: 'black'}}>12 BCF 1</option>
                                        <option value="12 BCF 2" style={{color: 'black'}}>12 BCF 2</option>
                                        <option value="12 ANIMASI 1" style={{color: 'black'}}>12 ANIMASI 1</option>
                                        <option value="12 ANIMASI 2" style={{color: 'black'}}>12 ANIMASI 2</option>
                                        <option value="12 TO 1" style={{color: 'black'}}>12 TO 1</option>
                                        <option value="12 TO 2" style={{color: 'black'}}>12 TO 2</option>
                                        <option value="12 TPL 1" style={{color: 'black'}}>12 TPL 1</option>
                                        <option value="12 TPL 2" style={{color: 'black'}}>12 TPL 2</option>
                                    </select>
                                    {errors.kelas && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.kelas[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Waktu Absen</label>
                                    <input type="datetime-local" className="form-control" onChange={(e) => setWaktu_absen(e.target.value)} />
                                    {errors.waktu_absen && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.waktu_absen[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Bukti Gambar</label>
                                    <input type="file" className="form-control" onChange={handleFileChange}/>
                                    {errors.image && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.image[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Catatan</label>
                                    <input type="text" className="form-control" onChange={(e) => setDescriptions(e.target.value)} placeholder="Masukan catatan" />
                                    {errors.descriptions && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.descriptions[0]}
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="btn btn-md btn-success rounded-sm shadow border-0 mx-2" style={{color: 'white'}}>Simpan</button>
                            </form>

                </Modal.Body>
            </Modal>
            {/* Modal Form Edit User */}
            <Modal show={showEditForm} onHide={() => setShowEditForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Absen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={handleEditFormSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Nama Lengkap</label>
                                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukan nama" />
                                    {errors.name && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.name[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Jenis Absen</label>
                                    <select className="form-select" value={jenis_absen} onChange={(e) => setJenis_absen(e.target.value)}>
                                        <option value=""style={{color: 'black'}}>Pilih jenis absen</option>
                                        <option value="Izin" style={{color: 'black'}}>Izin</option>
                                        <option value="Sakit" style={{color: 'black'}}>Sakit</option>
                                        <option value="Tanpa keterangan" style={{color: 'black'}}>Tanpa keterangan</option>
                                    </select>
                                    {errors.jenis_absen && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.jenis_absen[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Kelas</label>
                                    <select className="form-select" value={kelas} onChange={(e) => setKelas(e.target.value)}>
                                        <option value=""style={{color: 'black'}}>Pilih kelas</option>
                                        <option value="10 PPLG 1" style={{color: 'black'}}>10 PPLG 1</option>
                                        <option value="10 PPLG 2" style={{color: 'black'}}>10 PPLG 2</option>
                                        <option value="10 PPLG 3" style={{color: 'black'}}>10 PPLG 3</option>
                                        <option value="10 BCF 1" style={{color: 'black'}}>10 BCF 1</option>
                                        <option value="10 BCF 2" style={{color: 'black'}}>10 BCF 2</option>
                                        <option value="10 ANIMASI 1" style={{color: 'black'}}>10 ANIMASI 1</option>
                                        <option value="10 ANIMASI 2" style={{color: 'black'}}>10 ANIMASI 2</option>
                                        <option value="10 TO 1" style={{color: 'black'}}>10 TO 1</option>
                                        <option value="10 TO 2" style={{color: 'black'}}>10 TO 2</option>
                                        <option value="10 TPL 1" style={{color: 'black'}}>10 TPL 1</option>
                                        <option value="10 TPL 2" style={{color: 'black'}}>10 TPL 2</option>
                                        <option value="11 PPLG 1" style={{color: 'black'}}>11 PPLG 1</option>
                                        <option value="11 PPLG 2" style={{color: 'black'}}>11 PPLG 2</option>
                                        <option value="11 PPLG 3" style={{color: 'black'}}>11 PPLG 3</option>
                                        <option value="11 BCF 1" style={{color: 'black'}}>11 BCF 1</option>
                                        <option value="11 BCF 2" style={{color: 'black'}}>11 BCF 2</option>
                                        <option value="11 ANIMASI 1" style={{color: 'black'}}>11 ANIMASI 1</option>
                                        <option value="11 ANIMASI 2" style={{color: 'black'}}>11 ANIMASI 2</option>
                                        <option value="11 TO 1" style={{color: 'black'}}>11 TO 1</option>
                                        <option value="11 TO 2" style={{color: 'black'}}>11 TO 2</option>
                                        <option value="11 TPL 1" style={{color: 'black'}}>11 TPL 1</option>
                                        <option value="11 TPL 2" style={{color: 'black'}}>11 TPL 2</option>
                                        <option value="12 PPLG 1" style={{color: 'black'}}>12 PPLG 1</option>
                                        <option value="12 PPLG 2" style={{color: 'black'}}>12 PPLG 2</option>
                                        <option value="12 PPLG 3" style={{color: 'black'}}>12 PPLG 3</option>
                                        <option value="12 BCF 1" style={{color: 'black'}}>12 BCF 1</option>
                                        <option value="12 BCF 2" style={{color: 'black'}}>12 BCF 2</option>
                                        <option value="12 ANIMASI 1" style={{color: 'black'}}>12 ANIMASI 1</option>
                                        <option value="12 ANIMASI 2" style={{color: 'black'}}>12 ANIMASI 2</option>
                                        <option value="12 TO 1" style={{color: 'black'}}>12 TO 1</option>
                                        <option value="12 TO 2" style={{color: 'black'}}>12 TO 2</option>
                                        <option value="12 TPL 1" style={{color: 'black'}}>12 TPL 1</option>
                                        <option value="12 TPL 2" style={{color: 'black'}}>12 TPL 2</option>
                                    </select>
                                    {errors.kelas && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.kelas[0]}
                                        </div>
                                    )}
                                </div>


                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Waktu Absen</label>
                                    <input type="datetime-local" className="form-control" value={waktu_absen} onChange={(e) => setWaktu_absen(e.target.value)}/>
                                    {errors.waktu_absen && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.waktu_absen[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Bukti Gambar</label>
                                    <input type="file" className="form-control" onChange={handleFileChange}/>
                                    {errors.image && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.image[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Catatan</label>
                                    <input type="text" className="form-control" value={descriptions} onChange={(e) => setDescriptions(e.target.value)} placeholder="Masukan catatan" />
                                    {errors.descriptions && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.descriptions[0]}
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="btn btn-md btn-success rounded-sm shadow border-0 mx-2" style={{color: 'white'}}>Simpan</button>
                            </form>
                </Modal.Body>
            </Modal>
            <InputGroup style={{ width: '20rem', height: '45px', borderRadius: '40px' }}>
                <FormControl
                    className='shadow'
                    placeholder="ketik untuk mencari..."
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    style={{
                        borderRadius: '40px',
                        boxShadow: 'none',
                        background: `url(${search}) no-repeat 10px center/20px`,
                        paddingLeft: '40px',
                    }}
                    />
            </InputGroup>

                <div className="ms-3 d-flex">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        style={{color: 'black', width: '26px', borderRadius: '10px'}}
                    />
                    <select className="form-select ms-2" style={{width: '130px'}} onChange={handleKelasFilterChange} value={kelasFilter}>
                        <option value="" style={{color: 'black'}}>Semua</option>
                        <option value="10 PPLG 1" style={{color: 'black'}}>10 PPLG 1</option>
                        <option value="10 PPLG 2" style={{color: 'black'}}>10 PPLG 2</option>
                        <option value="10 PPLG 3" style={{color: 'black'}}>10 PPLG 3</option>
                        <option value="10 BCF 1" style={{color: 'black'}}>10 BCF 1</option>
                        <option value="10 BCF 2" style={{color: 'black'}}>10 BCF 2</option>
                        <option value="10 ANIMASI 1" style={{color: 'black'}}>10 ANIMASI 1</option>
                        <option value="10 ANIMASI 2" style={{color: 'black'}}>10 ANIMASI 2</option>
                        <option value="10 TO 1" style={{color: 'black'}}>10 TO 1</option>
                        <option value="10 TO 2" style={{color: 'black'}}>10 TO 2</option>
                        <option value="10 TPL 1" style={{color: 'black'}}>10 TPL 1</option>
                        <option value="10 TPL 2" style={{color: 'black'}}>10 TPL 2</option>
                        <option value="11 PPLG 1" style={{color: 'black'}}>11 PPLG 1</option>
                        <option value="11 PPLG 2" style={{color: 'black'}}>11 PPLG 2</option>
                        <option value="11 PPLG 3" style={{color: 'black'}}>11 PPLG 3</option>
                        <option value="11 BCF 1" style={{color: 'black'}}>11 BCF 1</option>
                        <option value="11 BCF 2" style={{color: 'black'}}>11 BCF 2</option>
                        <option value="11 ANIMASI 1" style={{color: 'black'}}>11 ANIMASI 1</option>
                        <option value="11 ANIMASI 2" style={{color: 'black'}}>11 ANIMASI 2</option>
                        <option value="11 TO 1" style={{color: 'black'}}>11 TO 1</option>
                        <option value="11 TO 2" style={{color: 'black'}}>11 TO 2</option>
                        <option value="11 TPL 1" style={{color: 'black'}}>11 TPL 1</option>
                        <option value="11 TPL 2" style={{color: 'black'}}>11 TPL 2</option>
                        <option value="12 PPLG 1" style={{color: 'black'}}>12 PPLG 1</option>
                        <option value="12 PPLG 2" style={{color: 'black'}}>12 PPLG 2</option>
                        <option value="12 PPLG 3" style={{color: 'black'}}>12 PPLG 3</option>
                        <option value="12 BCF 1" style={{color: 'black'}}>12 BCF 1</option>
                        <option value="12 BCF 2" style={{color: 'black'}}>12 BCF 2</option>
                        <option value="12 ANIMASI 1" style={{color: 'black'}}>12 ANIMASI 1</option>
                        <option value="12 ANIMASI 2" style={{color: 'black'}}>12 ANIMASI 2</option>
                        <option value="12 TO 1" style={{color: 'black'}}>12 TO 1</option>
                        <option value="12 TO 2" style={{color: 'black'}}>12 TO 2</option>
                        <option value="12 TPL 1" style={{color: 'black'}}>12 TPL 1</option>
                        <option value="12 TPL 2" style={{color: 'black'}}>12 TPL 2</option>
                    </select>
                </div>
            </div>

            <div className="table-responsive" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
    <table className="table align-middle mb-0 bg-white">
        <thead style={{background: '#4570de'}}>
            <tr>
                <th scope="col" style={{color: 'white'}}>No</th>
                <th scope="col" style={{color: 'white'}}>Nama Siswa</th>
                <th scope="col" style={{color: 'white'}}>Jenis Absen</th>
                <th scope="col" style={{color: 'white'}}>Kelas</th>
                <th scope="col" style={{color: 'white'}}>Waktu Absen</th>
                <th scope="col" style={{color: 'white'}}>Bukti Gambar</th>
                <th scope="col" style={{color: 'white'}}>Catatan</th>
                <th scope="col" style={{color: 'white'}}>Aksi</th>
            </tr>
        </thead>
        <tbody className='table-group-divider'>
            {absens.length > 0 ? (
                absens
                    .filter((absen) => filterByKelas(absen) && searchFilter(absen) && filterByDate(absen))
                    .map((absen, index, array) => (
                        <tr key={absen.id}>
                            <td>{array.length - index}</td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <div className="ms-3">
                                        <p className="fw-bold mb-1" style={{ color: 'black' }}>
                                            {absen.name}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span
                                    className="badge rounded-pill"
                                    style={{
                                        color: 'white',
                                        backgroundColor: getJenis_absenColor(absen.jenis_absen),
                                    }}
                                >
                                    {absen.jenis_absen}
                                </span>
                            </td>
                            <td>{absen.kelas}</td>
                            <td>{absen.waktu_absen}</td>
                            <td>
                                <img src={absen.image} alt={absen.name} width="200" style={{ cursor: 'pointer' }} onClick={() => handleImageClick(absen.image)}/>
                            </td>
                            <td>{absen.descriptions}</td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <button
                                        onClick={() => handleEdit(absen.id)}
                                        type="button"
                                        className="btn-edit btn-link btn-sm btn-rounded border-0 mx-2"
                                        style={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        <img src={edit} alt="" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(absen.id)}
                                        type="button"
                                        className="btn-delete btn-link btn-sm btn-rounded border-0"
                                        style={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        <img src={hapus} alt="" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    <div className="alert alert-danger mb-0" role="alert">
                                        Data Belum Tersedia!
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination className="mt-3 d-flex justify-content-end">
                <Pagination.First onClick={() => handlePageChange(1)} />
                <Pagination.Prev onClick={() => handlePageChange(pagination.currentPage - 1)} />

                {[...Array(pagination.lastPage).keys()].map((page) => (
                    <Pagination.Item
                        key={page + 1}
                        active={page + 1 === pagination.currentPage}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        {page + 1}
                    </Pagination.Item>
                ))}

                <Pagination.Next onClick={() => handlePageChange(pagination.currentPage + 1)} />
                <Pagination.Last onClick={() => handlePageChange(pagination.lastPage)} />
            </Pagination>            
            
        </LayoutDefault>
    );
}
