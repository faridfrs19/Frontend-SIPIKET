import '../../../public/assets/css/main.css';
import edit from '../../assets/image/edit.svg';
import hapus from '../../assets/image/delete.svg';
import { Table, Pagination, InputGroup, FormControl, Button, Modal, Form } from 'react-bootstrap';
import search from '../../assets/image/search.svg';
import setuju from '../../assets/image/setuju.svg';
import tolak from '../../assets/image/tolak.svg';
import surat from '../../assets/image/suratizin3.png';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// import alert
import Swal from 'sweetalert2'
//import permissions
import hasAnyPermission from '../../utils/Permissions.jsx';
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

export default function SuratMasuk() {
      // pdf
      const tableRef = useRef(null);
    // useNavigate hook
    const navigate = useNavigate();
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
    const filterByKelas = (surat_masuk) => {
        if (!kelasFilter) {
            return true;
        }
        return surat_masuk.kelas.toLowerCase() === kelasFilter.toLowerCase();
    };

    // Fungsi untuk melakukan pencarian
    const searchFilter = (surat_masuk) => {
        if (!searchTerm) {
            return true;
        }
        return (
            surat_masuk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            surat_masuk.kelas.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };  

    document.title = "Dashboard - SIPIKET";

    const findSurat_masukById = (id) => {
      return surat_masuk.find((surat_masuk) => surat_masuk.id === id);
    };    

    // Pagination from api
    const [surat_masuk, setSurat_masuk] = useState([]);
    const [suratMasukWithUsers, setSuratMasukWithUsers] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
    });

    // ambil data absen dan menampilkannya + paginaton
    const fetchDataSurat_masuk = async (page = 1) => {
      Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
      try {
          const response = await Api.get(`/api/admin/suratmasuk?page=${page}`);
          
          // Check if the response has the expected structure
          if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
              // Assuming `response.data.data.data` is an array
              const joinedData = response.data.data.data.map(surat_masuk => {
                  // Assuming you have a function findSurat_keluarById to find user data
                  const user = findSurat_masukById(surat_masuk.id);
                  return { ...surat_masuk, user: user };
              });
  
              setSuratMasukWithUsers(joinedData);
              setPagination({
                  currentPage: response.data.data.current_page,
                  lastPage: response.data.data.last_page,
              });
          } else {
              // Handle the case when the response structure is not as expected
              console.error('Invalid response structure:', response.data);
          }
      } catch (error) {
          console.error('Error fetching surat keluar:', error);
      }
  };
    const handlePageChange = (page) => {
      fetchDataSurat_masuk(page);
  };


    //run hook useEffect
    useEffect(() => {
        
    //call method "fetchDataAbsens"
    fetchDataSurat_masuk();

    }, []);

    //  //method deletePost
    const deleteSurat_masuk = async (id) => {
        
        //delete with api
        await Api.delete(`/api/admin/suratmasuk/${id}`)
            .then(() => {
                
                fetchDataSurat_masuk();

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
                deleteSurat_masuk(id);
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
    const [kelas, setKelas] = useState('');
    const [tanggal_surat, setTanggal_surat] = useState('');
    const [jam_masuk, setJam_masuk] = useState('');
    const [alasan, setAlasan] = useState('');
    const [status, setStatus] = useState('');

    // State for validation errors
    const [errors, setErrors] = useState([]);

    // Handle form submit
    const storeSurat_masuk = async (e) => {
        e.preventDefault();

    // Inisialisasi FormData
    const formData = new FormData();

    // Tambahkan data
    formData.append('kelas', kelas);
    formData.append('tanggal_surat', tanggal_surat);
    formData.append('jam_masuk', jam_masuk);
    formData.append('alasan', alasan);
    formData.append('status', status);

    try {
        await Api.post('/api/admin/suratmasuk', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        fetchDataSurat_masuk(); // Perbarui data untuk memperbarui tabel
        setShowAddForm(false); // Sembunyikan formulir setelah berhasil menambahkan data

        // Tampilkan pemberitahuan SweetAlert
        Swal.fire({
            title: 'Berhasil!',
            text: 'Data surat masuk berhasil ditambahkan.',
            icon: 'success',
        });
    } catch (error) {
        // Tampilkan pemberitahuan SweetAlert untuk kesalahan
        Swal.fire({
            title: 'Gagal!',
            text: 'Terjadi kesalahan saat menambahkan data surat masuk.',
            icon: 'error',
        });
        // setErrors(error.response.data);
    }
};


    // membuat fungsi edit menggunakan api berdasarkan id
    const [editSurat_masukId, setEditSurat_masukId] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
  
    const findSurat_masukByEditId = (id) => {
        return suratMasukWithUsers.find((surat_masuk) => surat_masuk.id === id);
    };    
  
        // Fungsi untuk mengatur data pengguna yang akan diedit
        const handleEdit = (id) => {
            const surat_masukToEdit = findSurat_masukByEditId(id);
            setEditSurat_masukId(id);
        
            // Fill the form with existing user data
            setKelas(surat_masukToEdit.kelas);
            setTanggal_surat(surat_masukToEdit.tanggal_surat);
            setJam_masuk(surat_masukToEdit.jam_masuk);
            setAlasan(surat_masukToEdit.alasan);
            setStatus(surat_masukToEdit.status);
            setShowEditForm(true);
          };
      
          // Fungsi untuk menangani submit form edit pengguna
          const handleEditFormSubmit = async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append('kelas', kelas);
            formData.append('tanggal_surat', tanggal_surat);
            formData.append('jam_masuk', jam_masuk);
            formData.append('alasan', alasan);
            formData.append('status', status);
            formData.append('_method', 'PUT')
            
            try {
              await Api.post(`/api/admin/suratmasuk/${editSurat_masukId}`, formData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              fetchDataSurat_masuk(); // Ambil data ulang untuk memperbarui tabel
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
          const handleSetuju = async (id) => {
            try {
              await Api.post(`/api/admin/suratmasukstatus/${id}`, { status: 'Disetujui' }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              fetchDataSurat_masuk(); // Ambil data ulang untuk memperbarui tabel
              // Tampilkan notifikasi SweetAlert
              Swal.fire({
                title: 'Berhasil!',
                text: 'Surat masuk berhasil disetujui.',
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
          
          const handleTolak = async (id) => {
            try {
              await Api.post(`/api/admin/suratmasukstatus/${id}`, { status: 'Ditolak' }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              fetchDataSurat_masuk(); // Ambil data ulang untuk memperbarui tabel
              // Tampilkan notifikasi SweetAlert
              Swal.fire({
                title: 'Berhasil!',
                text: 'Surat masuk berhasil ditolak.',
                icon: 'success',
              });
            } catch (error) {
              // Tampilkan notifikasi SweetAlert untuk error
              Swal.fire({
                title: 'Gagal!',
                text: 'Terjadi kesalahan saat menolak surat masuk.',
                icon: 'error',
              });
              console.error('Error rejecting surat masuk:', error);
            }
          };
          
          const getConfirm = (surat_masuk) => {
            switch (surat_masuk) {
              case 'Disetujui':
                return 'green';
              case 'Ditolak':
                return 'red';
              default:
                return 'orange'; 
            }
          };

          const toggleSelection = (id) => {
            setSuratMasukWithUsers((prevSurat_masuk) =>
              prevSurat_masuk.map((surat_masuk) => (surat_masuk.id === id ? { ...surat_masuk, selected: !surat_masuk.selected } : surat_masuk))
            );
          };
        
          const exportToPDF = () => {
            const input = tableRef.current;
            const selectedRows = suratMasukWithUsers.filter((surat_masuk) => surat_masuk.selected);
        
            if (selectedRows.length === 0) {
                alert('Pilih setidaknya satu baris untuk diekspor.');
                return;
            }
        
            const pdf = new jsPDF('p', 'mm', 'a6');
            const height = pdf.internal.pageSize.getHeight();
            let yPos = 15;
        
            selectedRows.forEach((surat_masuk, index) => {
                // Tambahkan halaman baru untuk setiap baris yang dipilih (kecuali yang pertama)
                if (index !== 0) {
                    pdf.addPage();
                    yPos = 15;
                }

                // Tambahkan background image dari URL gambar
                const imageUrl = surat;
                pdf.addImage(imageUrl, 'png', 0, 0, 210, 297);

                // Tambahkan judul untuk setiap baris
                pdf.setFont('times', 'bold');
                pdf.setFontSize(30);
                addTextWithUnderline(pdf, 'Surat Izin Masuk', yPos + 50);
                yPos += 20;
        
                // Tambahkan detail konten untuk setiap baris dengan garis bawah
                pdf.setFont('times', 'normal');
                pdf.setFontSize(12);
                addTextWithUnderline(pdf, `Nama Siswa/i: ${surat_masuk.name}`, yPos + 40);
                addTextWithUnderline(pdf, `Kelas: ${surat_masuk.kelas}`, yPos + 50);
                addTextWithUnderline(pdf, `Tanggal Surat: ${surat_masuk.tanggal_surat}`, yPos + 60);
                addTextWithUnderline(pdf, `Jam Masuk: ${surat_masuk.jam_masuk}`, yPos + 70);
                addTextWithUnderline(pdf, `Alasan: ${surat_masuk.alasan}`, yPos + 80);
                addTextWithUnderline(pdf, `Status: ${surat_masuk.status}`, yPos + 90);
                // Tingkatkan yPos untuk baris berikutnya
                yPos += 20;
            });
        
            pdf.save('Surat_Izin_Masuk.pdf'); 
        };
        
        
        // Fungsi untuk menambahkan teks dengan garis bawah dan posisinya di tengah halaman
        const addTextWithUnderline = (pdf, text, y) => {
            const textWidth = pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
            const x = (pdf.internal.pageSize.getWidth() - textWidth) / 2; // Hitung posisi x untuk teks di tengah
            pdf.text(text, x, y);
            pdf.line(x, y + 2, x + textWidth, y + 2); // Menambahkan garis bawah
        };
    
    return (
        <LayoutDefault>
            
            <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
                {/* Tombol untuk menampilkan form tambah data */}
            <Button  style={{background: '#4570de'}} onClick={() => setShowAddForm(true)}>
                Tambah Surat Masuk
            </Button>

            {/* Modal Form Tambah User */}
            <Modal show={showAddForm} onHide={() => setShowAddForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Surat Masuk</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={storeSurat_masuk}>  
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
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Tanggal Surat</label>
                                    <input type="date" className="form-control" onChange={(e) => setTanggal_surat(e.target.value)} />
                                    {errors.tanggal_surat && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.tanggal_surat[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Jam Masuk</label>
                                    <input type="time" className="form-control" onChange={(e) => setJam_masuk(e.target.value)} />
                                    {errors.jam_masuk && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.jam_masuk[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Alasan</label>
                                    <input type="form-select" className="form-control" onChange={(e) => setAlasan(e.target.value)} placeholder="Masukan alasan"/>
                                    {errors.alasan && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.alasan[0]}
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
                    <Modal.Title>Edit Surat Masuk</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={handleEditFormSubmit}>                            
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
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Tanggal Surat</label>
                                    <input type="date" className="form-control" value={tanggal_surat} onChange={(e) => setTanggal_surat(e.target.value)} />
                                    {errors.tanggal_surat && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.tanggal_surat[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Jam Masuk</label>
                                    <input type="time" className="form-control" value={jam_masuk} onChange={(e) => setJam_masuk(e.target.value)} />
                                    {errors.jam_masuk && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.jam_masuk[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Alasan</label>
                                    <input type="form-select" className="form-control" value={alasan} onChange={(e) => setAlasan(e.target.value)} placeholder="Masukan alasan"/>
                                    {errors.alasan && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.alasan[0]}
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
                            <th scope="col" style={{color: 'white'}}>Nama Siswa</th>
                            <th scope="col" style={{color: 'white'}}>Kelas</th>
                            <th scope="col" style={{color: 'white'}}>Tanggal Surat</th>
                            <th scope="col" style={{color: 'white'}}>Jam Masuk</th>
                            <th scope="col" style={{color: 'white'}}>Alasan</th>
                            <th scope="col" style={{color: 'white'}}>Status</th>
                            {hasAnyPermission(['tugas_guru.index']) &&
                            <th scope="col" style={{color: 'white'}}>Konfirmasi</th>
                            }                           
                            <th scope="col" style={{color: 'white'}}>Pilih Eksport</th>
                            <th scope="col" style={{color: 'white'}}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className='table-group-divider'>
                    {suratMasukWithUsers.length > 0 ? (
                      suratMasukWithUsers
                    .filter((surat_masuk) => filterByKelas(surat_masuk) && searchFilter(surat_masuk))
                    .map((surat_masuk, index, array) => (
                      <tr key={surat_masuk.id}>
                        <td>{array.length - index}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="ms-3">
                              <p className="fw-bold mb-1" style={{ color: 'black' }}>
                                {surat_masuk.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>{surat_masuk.kelas}</td>
                        <td>{surat_masuk.tanggal_surat}</td>
                        <td>{surat_masuk.jam_masuk}</td>
                        <td>{surat_masuk.alasan}</td>
                        <td>
                          <span
                            className="badge rounded-pill"
                            style={{
                              color: 'white',
                              backgroundColor: getConfirm(surat_masuk.status),
                            }}
                          >{surat_masuk.status}
                          </span>
                        </td>
                        <td className='text-center'><input type="checkbox" style={{width: '50px', height: '20px'}} checked={surat_masuk.selected} onChange={() => toggleSelection(surat_masuk.id)}/></td>
                        {hasAnyPermission(['tugas_guru.index']) &&
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <button
                              type="button"
                              className="btn-setuju btn-link btn-sm btn-rounded border-0 mx-2"
                              style={{ display: 'flex', alignItems: 'center' }}
                              onClick={() => handleSetuju(surat_masuk.id)}
                            >
                              <img src={setuju} alt="" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                            </button>
                            <button
                              type="button"
                              className="btn-tolak btn-link btn-sm btn-rounded border-0"
                              style={{ display: 'flex', alignItems: 'center' }}
                              onClick={() => handleTolak(surat_masuk.id)}
                            >
                              <img src={tolak} alt="" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                            </button>
                          </div>
                        </td>
                        }
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <button
                              onClick={() => handleEdit(surat_masuk.id)}
                              type="button"
                              className="btn-edit btn-link btn-sm btn-rounded border-0 mx-2"
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              <img src={edit} alt="" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                            </button>
                            <button
                              onClick={() => confirmDelete(surat_masuk.id)}
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
                            <td colSpan="10" className="text-center">
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
