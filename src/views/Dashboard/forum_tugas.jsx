import '../../../public/assets/css/main.css';
import edit from '../../assets/image/edit.svg';
import hapus from '../../assets/image/delete.svg';
import { Table, Pagination, InputGroup, FormControl, Button, Modal, Form } from 'react-bootstrap';
import search from '../../assets/image/search.svg';
import setuju from '../../assets/image/setuju.svg';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// import alert
import Swal from 'sweetalert2'

// Import useState and useEffect
import { useState, useEffect, useRef } from 'react';
//import useNavigate
import { useNavigate, useParams } from 'react-router-dom';

// Import api
import Api from '../../api';

// Import layout
import LayoutDefault from "../../layouts/Default";

//import js cookie
import Cookies from 'js-cookie';

export default function ForumTugas() {
    // pdf
    const tableRef = useRef(null);
    // useNavigate hook
    const navigate = useNavigate();
    // zoom img
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    // //token from cookies
    const token = Cookies.get('token');
    // State untuk filter berdasarkan role
    const [kelasFilter, setKelasFilter] = useState('');
    // State untuk hasil pencarian
    const [searchTerm, setSearchTerm] = useState('');
    // State untuk menampilkan atau menyembunyikan form tambah siswa
    const [showAddForm, setShowAddForm] = useState(false);

    // Fungsi untuk menangani perubahan nilai filter berdasarkan role
    const handleKelasFilterChange = (event) => {
        setKelasFilter(event.target.value);
    };

    // Fungsi untuk menangani perubahan nilai pencarian
    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Fungsi untuk melakukan filter berdasarkan role
    const filterByKelas = (tugas_guru) => {
        if (!kelasFilter) {
            return true;
        }
        return tugas_guru.kelas_penerima.toLowerCase() === kelasFilter.toLowerCase();
    };

    // Fungsi untuk melakukan pencarian
    const searchFilter = (tugas_guru) => {
        if (!searchTerm) {
            return true;
        }
        return (
            tugas_guru.name_teachers.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tugas_guru.kelas_penerima.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };  

    // zoom img
    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowImageModal(true);
      };
      

    document.title = "Dashboard - SIPIKET";

    // Pagination from api
    const [tugas_guru, setTugas_guru] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
    });

    // ambil data absen dan menampilkannya + paginaton
    const fetchDataTugas_guru = async (page = 1) => {
        Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        await Api.get(`/api/admin/tugasguru?page=${page}`)
            .then(response => {
                setTugas_guru(response.data.data);
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
      fetchDataTugas_guru(page);
  };


    //run hook useEffect
    useEffect(() => {
        
    //call method "fetchDataAbsens"
    fetchDataTugas_guru();

    }, []);

    //  //method deletePost
    const deleteTugas_guru = async (id) => {
        
        //delete with api
        await Api.delete(`/api/admin/tugasguru/${id}`)
            .then(() => {
                
                fetchDataTugas_guru();

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
                deleteTugas_guru(id);
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
    const [name_teachers, setName_teachers] = useState('');
    const [mapel, setMapel] = useState('');
    const [alasan, setAlasan] = useState('');
    const [tugas, setTugas] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [kelas_penerima, setKelas_penerima] = useState('');
    const [status, setStatus] = useState('');

    // State for validation errors
    const [errors, setErrors] = useState([]);

     //method handle file change
    const handleFileChange = (e) => {
        setTugas(e.target.files[0]);
    }

    // Handle form submit
    const storeTugas_guru = async (e) => {
        e.preventDefault();

    // Inisialisasi FormData
    const formData = new FormData();

    // Tambahkan data
    formData.append('name_teachers', name_teachers);
    formData.append('mapel', mapel);
    formData.append('alasan', alasan);
    formData.append('tugas', tugas);
    formData.append('keterangan', keterangan);
    formData.append('kelas_penerima', kelas_penerima);
    formData.append('status', status);

    try {
        await Api.post('/api/admin/tugasguru', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            
        });

        fetchDataTugas_guru(); // Perbarui data untuk memperbarui tabel
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
    const [editTugas_guruId, setEditTugas_guruId] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
  
    const findTugas_guruById = (id) => {
        return tugas_guru.find((tugas_guru) => tugas_guru.id === id);
    };    
  
        // Fungsi untuk mengatur data pengguna yang akan diedit
        const handleEdit = (id) => {
            const tugas_guruToEdit = findTugas_guruById(id);
            setEditTugas_guruId(id);
        
            // Fill the form with existing user data
            setName_teachers(tugas_guruToEdit.name_teachers);
            setMapel(tugas_guruToEdit.mapel);
            setAlasan(tugas_guruToEdit.alasan);
            setTugas(tugas_guruToEdit.tugas);
            setKeterangan(tugas_guruToEdit.keterangan);
            setKelas_penerima(tugas_guruToEdit.kelas_penerima);
            setStatus(tugas_guruToEdit.status);
            setShowEditForm(true);
          };
      
          // Fungsi untuk menangani submit form edit pengguna
          const handleEditFormSubmit = async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append('name_teachers', name_teachers);
            formData.append('mapel', mapel);
            formData.append('alasan', alasan);
            formData.append('tugas', tugas);
            formData.append('keterangan', keterangan);
            formData.append('kelas_penerima', kelas_penerima);
            formData.append('status', status);
            formData.append('_method', 'PUT');
            
            try {
              await Api.post(`/api/admin/tugasguru/${editTugas_guruId}`, formData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data',
                },
              });

              fetchDataTugas_guru(); // Ambil data ulang untuk memperbarui tabel
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

          const handleCeklis = async (id) => {
            try {
              await Api.post(`/api/admin/tugasgurustatus/${id}`, { status: 'Sudah Dibaca' }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              fetchDataTugas_guru(); // Ambil data ulang untuk memperbarui tabel
              // Tampilkan notifikasi SweetAlert
              Swal.fire({
                title: 'Berhasil!',
                text: 'Tugas telah dibaca.',
                icon: 'success',
              });
            } catch (error) {
              // Tampilkan notifikasi SweetAlert untuk error
              Swal.fire({
                title: 'Gagal!',
                text: 'Terjadi kesalahan saat menyetujui surat masuk.',
                icon: 'error',
              });
              console.error('Error approving surat masuk:', error);
            }
          };

          const getConfirm = (tugas_guru) => {
            switch (tugas_guru) {
              case 'Sudah Dibaca':
                return 'green';
              default:
                return 'red'; 
            }
          };

          const toggleSelection = (id) => {
            setTugas_guru((prevTugas_guru) =>
              prevTugas_guru.map((tugas_guru) => (tugas_guru.id === id ? { ...tugas_guru, selected: !tugas_guru.selected } : tugas_guru))
            );
          };
        
          const exportToPDF = () => {
            const input = tableRef.current;
            const selectedRows = tugas_guru.filter((tugas_guru) => tugas_guru.selected);
        
            if (selectedRows.length === 0) {
                alert('Pilih setidaknya satu baris untuk diekspor.');
                return;
            }
        
            const pdf = new jsPDF('p', 'mm', 'a6');
            const height = pdf.internal.pageSize.getHeight();
            let yPos = 15;
        
            selectedRows.forEach((tugas_guru, index) => {
                // Tambahkan halaman baru untuk setiap baris yang dipilih (kecuali yang pertama)
                if (index !== 0) {
                    pdf.addPage();
                    yPos = 15;
                }
        
                // Tambahkan judul untuk setiap baris
                pdf.setFont('times', 'bold');
                pdf.setFontSize(30);
                pdf.text('Tugas', 20, yPos);
                yPos += 20;
        
                // Tambahkan gambar (menggunakan addImage)
                if (tugas_guru.tugas) {
                    // Check if the file is a PDF
                    if (tugas_guru.tugas.endsWith('.pdf')) {
                        // If it's a PDF, directly download the file
                        const pdfUrl = tugas_guru.tugas;
                        const pdfFilename = pdfUrl.substring(pdfUrl.lastIndexOf('/') + 1);
                        const link = document.createElement('a');
                        link.href = pdfUrl;
                        link.download = pdfFilename;
                        link.click();
                    } else {
                        // For other image types
                        const imgData = tugas_guru.tugas;
                        const imgWidth = 60; // Adjust the width as needed
                        const imgHeight = 60; // Adjust the height as needed
                        pdf.addImage(imgData, 'JPEG', 20, yPos, imgWidth, imgHeight);
                        yPos += imgHeight + 10; // Increase yPos to leave space for the image
                    }
                }
            });
            pdf.save('Tugas.pdf');
        };

        const getAlasanColor = (tugas_guru) => {
            switch (tugas_guru) {
              case 'sakit':
                return 'orange'; 
              case 'izin':
                return 'green';
              case 'tanpa keterangan':
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
                <Modal.Title>Tugas</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <img src={selectedImage} alt="Large View" style={{ width: '100%' }} />
            </Modal.Body>
            </Modal>
            
            <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
                {/* Tombol untuk menampilkan form tambah data */}
            <Button  style={{background: '#4570de'}} onClick={() => setShowAddForm(true)}>
                Tambah Tugas
            </Button>

            {/* Modal Form Tambah User */}
            <Modal show={showAddForm} onHide={() => setShowAddForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Tugas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={storeTugas_guru}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Nama Guru</label>
                                    <input type="text" className="form-control" onChange={(e) => setName_teachers(e.target.value)} placeholder="Masukan nama guru" />
                                    {errors.name_teachers && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.name_teachers[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Mapel</label>
                                    <select className="form-select" onChange={(e) => setMapel(e.target.value)}>
                                        <option value=""style={{color: 'black'}}>Pilih mapel</option>
                                        <option value="PPLG" style={{color: 'black'}}>PPLG</option>
                                        <option value="BCF" style={{color: 'black'}}>BCF</option>
                                        <option value="TPL" style={{color: 'black'}}>TPL</option>
                                        <option value="TO" style={{color: 'black'}}>TO</option>
                                        <option value="ANIMASI" style={{color: 'black'}}>ANIMASI</option>
                                        <option value="JEPANG" style={{color: 'black'}}>JEPANG</option>
                                        <option value="PAI" style={{color: 'black'}}>PAI</option>
                                        <option value="MTK" style={{color: 'black'}}>MTK</option>
                                        <option value="PPKN" style={{color: 'black'}}>PPKN</option>
                                        <option value="SEJARAH" style={{color: 'black'}}>SEJARAH</option>
                                        <option value="PJOK" style={{color: 'black'}}>PJOK</option>
                                        <option value="B.INDO" style={{color: 'black'}}>B.INDO</option>
                                        <option value="B.SUNDA" style={{color: 'black'}}>B.SUNDA</option>
                                        <option value="IPAS" style={{color: 'black'}}>IPAS</option>
                                        <option value="INFORMATIKA" style={{color: 'black'}}>INFORMATIKA</option>
                                        <option value="ENGLISH" style={{color: 'black'}}>ENGLISH</option>
                                        <option value="PKWU" style={{color: 'black'}}>PKWU</option>
                                    </select>
                                    {errors.mapel && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.mapel[0]}
                                        </div>
                                    )}
                                </div>


                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Alasan</label>
                                    <select className="form-select" onChange={(e) => setAlasan(e.target.value)}>
                                        <option value=""style={{color: 'black'}}>Pilih alasan</option>
                                        <option value="izin" style={{color: 'black'}}>Izin</option>
                                        <option value="sakit" style={{color: 'black'}}>Sakit</option>
                                        <option value="tanpa keterangan" style={{color: 'black'}}>Tanpa keterangan</option>
                                    </select>
                                    {errors.alasan && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.alasan[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Tugas</label>
                                    <input type="file" className="form-control" onChange={handleFileChange}/>
                                    {errors.tugas && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.tugas[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>keterangan</label>
                                    <input type="text" className="form-control" onChange={(e) => setKeterangan(e.target.value)} placeholder="Masukan keterangan" />
                                    {errors.keterangan && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.keterangan[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Kelas Penerima</label>
                                    <select className="form-select" onChange={(e) => setKelas_id(e.target.value)}>
                                        <option value=""style={{color: 'black'}}>Pilih kelas penerima</option>
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
                                    {errors.kelas_id && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.kelas_id[0]}
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
                    <Modal.Title>Edit Tugas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={handleEditFormSubmit}>
                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Nama Guru</label>
                                    <input type="text" className="form-control" value={name_teachers} onChange={(e) => setName_teachers(e.target.value)} placeholder="Masukan nama guru" />
                                    {errors.name_teachers && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.name_teachers[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Mapel</label>
                                    <input type="form-select" className="form-control" value={mapel} onChange={(e) => setMapel(e.target.value)} placeholder="Masukan mapel" />
                                    {errors.mapel && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.mapel[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Alasan</label>
                                    <select className="form-select" value={alasan} onChange={(e) => setAlasan(e.target.value)}>
                                        <option value=""style={{color: 'black'}}>Pilih alasan</option>
                                        <option value="izin" style={{color: 'black'}}>Izin</option>
                                        <option value="sakit" style={{color: 'black'}}>Sakit</option>
                                        <option value="tanpa keterangan" style={{color: 'black'}}>Tanpa keterangan</option>
                                    </select>
                                    {errors.alasan && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.alasan[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Tugas</label>
                                    <input type="file" className="form-control" onChange={handleFileChange}/>
                                    {errors.tugas && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.tugas[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>keterangan</label>
                                    <input type="text" className="form-control" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="Masukan alasan" />
                                    {errors.keterangan && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.keterangan[0]}
                                        </div>
                                    )}

                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Kelas Penerima</label>
                                    <select className="form-select" value={kelas_id} onChange={(e) => setKelas_id(e.target.value)}>
                                        <option value=""style={{color: 'black'}}>Pilih kelas penerima</option>
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
                                    {errors.kelas_id && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.kelas_id[0]}
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


            <div className="ms-3 shadow">
                    <select className="form-select" onChange={handleKelasFilterChange} value={kelasFilter}>
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
                            <th scope="col" style={{color: 'white'}}>Nama Guru</th>
                            <th scope="col" style={{color: 'white'}}>Mapel</th>
                            <th scope="col" style={{color: 'white'}}>Alasan</th>
                            <th scope="col" style={{color: 'white'}}>Tugas</th>
                            <th scope="col" style={{color: 'white'}}>Catatan Tugas</th>
                            <th scope="col" style={{color: 'white'}}>Kelas Penerima</th>
                            <th scope="col" style={{color: 'white'}}>Status</th>
                            <th scope="col" style={{color: 'white'}}>Konfirmasi</th>
                            <th scope="col" style={{color: 'white'}}>Pilih Eksport</th>
                            <th scope="col" style={{color: 'white'}}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className='table-group-divider'>
                    {tugas_guru.length > 0 ? (
                        tugas_guru
                        .filter((tugas_guru) => filterByKelas(tugas_guru) && searchFilter(tugas_guru))
                        .map((tugas_guru, index, array) => (
                            <tr key={tugas_guru.id}>
                            <td>{array.length - index}</td>
                            <td>
                                <div className="d-flex align-items-center">
                                <div className="ms-3">
                                    <p className="fw-bold mb-1" style={{ color: 'black' }}>
                                    {tugas_guru.name}
                                    </p>
                                </div>
                                </div>
                            </td>
                            <td>{tugas_guru.name_mapel}</td>
                            <td>
                                <span
                                className="badge rounded-pill"
                                style={{
                                    color: 'white',
                                    backgroundColor: getAlasanColor(tugas_guru.alasan),
                                }}
                                >
                                {tugas_guru.alasan}
                                </span>
                            </td>
                            <td onClick={() => handleImageClick(tugas_guru.tugas)}>
                                {tugas_guru.tugas && tugas_guru.tugas.endsWith('.pdf') ? (
                                <embed src={tugas_guru.tugas} type="application/pdf" width="200" height="200" style={{ cursor: 'pointer' }} zoom="scale" />
                                ) : (
                                <img src={tugas_guru.tugas} alt={tugas_guru.mapel} width="200" style={{ cursor: 'pointer' }} />
                                )}
                            </td>
                            <td>{tugas_guru.keterangan}</td>
                            <td>{tugas_guru.kelas_penerima}</td>
                            <td>
                                <span
                                className="badge rounded-pill"
                                style={{
                                    color: 'white',
                                    backgroundColor: getConfirm(tugas_guru.status),
                                }}
                                >
                                {tugas_guru.status}:  {tugas_guru.name_sekertaris   }
                                </span>
                            </td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                <button
                                    type="button"
                                    className="btn-setuju btn-link btn-sm btn-rounded border-0 mx-2"
                                    style={{ display: 'flex', alignItems: 'center' }}
                                    onClick={() => handleCeklis(tugas_guru.id)}
                                >
                                    <img src={setuju} alt="" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                                </button>
                                </div>
                            </td>
                            <td className='text-center'><input type="checkbox" style={{ width: '50px', height: '20px' }} checked={tugas_guru.selected} onChange={() => toggleSelection(tugas_guru.id)} /></td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                <button
                                    onClick={() => handleEdit(tugas_guru.id)}
                                    type="button"
                                    className="btn-edit btn-link btn-sm btn-rounded border-0 mx-2"
                                    style={{ display: 'flex', alignItems: 'center' }}
                                >
                                    <img src={edit} alt="" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                                </button>
                                <button
                                    onClick={() => confirmDelete(tugas_guru.id)}
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
                            <td colSpan="12" className="text-center">
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
            <Button  style={{background: '#4570de'}} className='me-4 border-0' onClick={exportToPDF}>
                Eksport PDF
            </Button>
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
