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

export default function SuratKeluar() {
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
    const filterByKelas = (surat_keluar) => {
        if (!kelasFilter) {
            return true;
        }
        return surat_keluar.kelas.toLowerCase() === kelasFilter.toLowerCase();
    };

    // Fungsi untuk melakukan pencarian
    const searchFilter = (surat_keluar) => {
        if (!searchTerm) {
            return true;
        }
        return (
            surat_keluar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            surat_keluar.kelas.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };  


    document.title = "Dashboard - SIPIKET";

    const findSurat_keluarById = (id) => {
      return surat_keluar.find((surat_keluar) => surat_keluar.id === id);
    };    

    // Pagination from api
    const [surat_keluar, setSurat_keluar] = useState([]);
    const [suratKeluarWithUsers, setSuratKeluarWithUsers] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
    });

    // ambil data absen dan menampilkannya + paginaton
    const fetchDataSurat_keluar = async (page = 1) => {
      Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
      try {
          const response = await Api.get(`/api/admin/suratkeluar?page=${page}`);
          
          // Check if the response has the expected structure
          if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
              // Assuming `response.data.data.data` is an array
              const joinedData = response.data.data.data.map(surat_keluar => {
                  // Assuming you have a function findSurat_keluarById to find user data
                  const user = findSurat_keluarById(surat_keluar.id);
                  return { ...surat_keluar, user: user };
              });
  
              setSuratKeluarWithUsers(joinedData);
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
      fetchDataSurat_keluar(page);
  };


    //run hook useEffect
    useEffect(() => {
        
    //call method "fetchDataAbsens"
    fetchDataSurat_keluar();

    }, []);

    //  //method deletePost
    const deleteSurat_keluar = async (id) => {
        
        //delete with api
        await Api.delete(`/api/admin/suratkeluar/${id}`)
            .then(() => {
                
                fetchDataSurat_keluar();

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
                deleteSurat_keluar(id);
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
    const [tanggal_surat, setTanggal_surat] = useState('');
    const [kelas, setKelas] = useState('');
    const [alasan, setAlasan] = useState('');

    // State for validation errors
    const [errors, setErrors] = useState([]);

    // Handle form submit
    const storeSurat_keluar = async (e) => {
        e.preventDefault();

    // Inisialisasi FormData
    const formData = new FormData();

    // Tambahkan data
    formData.append('tanggal_surat', tanggal_surat);
    formData.append('kelas', kelas);
    formData.append('alasan', alasan);

    try {
        await Api.post('/api/admin/suratkeluar', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        fetchDataSurat_keluar(); // Perbarui data untuk memperbarui tabel
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
        // setErrors(error.response.data);
    }
};


    // membuat fungsi edit menggunakan api berdasarkan id
    const [editSurat_keluarId, setEditSurat_keluarId] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
  
    const findSurat_keluarByEditId = (id) => {
      return suratKeluarWithUsers.find((surat_keluar) => surat_keluar.id === id);
    };  

        // Fungsi untuk mengatur data pengguna yang akan diedit
        const handleEdit = (id) => {
            const surat_keluarToEdit = findSurat_keluarByEditId(id);
            setEditSurat_keluarId(id);
        
            // Fill the form with existing user data
            setTanggal_surat(surat_keluarToEdit.tanggal_surat);
            setKelas(surat_keluarToEdit.kelas);
            setAlasan(surat_keluarToEdit.alasan);
            setShowEditForm(true);
          };
      
          // Fungsi untuk menangani submit form edit pengguna
          const handleEditFormSubmit = async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append('tanggal_surat', tanggal_surat);;
            formData.append('kelas', kelas);
            formData.append('alasan', alasan);
            formData.append('_method', 'PUT')
            
            try {
              await Api.post(`/api/admin/suratkeluar/${editSurat_keluarId}`, formData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              fetchDataSurat_keluar(); // Ambil data ulang untuk memperbarui tabel
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
              await Api.post(`/api/admin/suratkeluarstatus/${id}`, { status: 'Disetujui' }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              fetchDataSurat_keluar(); // Ambil data ulang untuk memperbarui tabel
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
              await Api.post(`/api/admin/suratkeluarstatus/${id}`, { status: 'Ditolak' }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              fetchDataSurat_keluar(); // Ambil data ulang untuk memperbarui tabel
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
          
          const getConfirm = (surat_keluar) => {
            switch (surat_keluar) {
              case 'Disetujui':
                return 'green';
              case 'Ditolak':
                return 'red';
              default:
                return 'orange'; 
            }
          };
    
          const toggleSelection = (id) => {
            setSuratKeluarWithUsers((prevSurat_keluar) =>
              prevSurat_keluar.map((surat_keluar) => (surat_keluar.id === id ? { ...surat_keluar, selected: !surat_keluar.selected } : surat_keluar))
            );
          };
        
          const exportToPDF = () => {
            const input = tableRef.current;
            const selectedRows = suratKeluarWithUsers.filter((surat_keluar) => surat_keluar.selected);
        
            if (selectedRows.length === 0) {
                alert('Pilih setidaknya satu baris untuk diekspor.');
                return;
            }
        
            const pdf = new jsPDF('p', 'mm', 'a6');
            const height = pdf.internal.pageSize.getHeight();
            let yPos = 15;
        
            selectedRows.forEach((surat_keluar, index) => {
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
                addTextWithUnderline(pdf, 'Surat Izin Keluar', yPos + 50);
                yPos += 20;
                
                // Tambahkan detail konten untuk setiap baris dengan garis bawah
                pdf.setFont('times', 'normal');
                pdf.setFontSize(15);
                addTextWithUnderline(pdf, `Tanggal Surat: ${surat_keluar.tanggal_surat}`, yPos + 40);
                addTextWithUnderline(pdf, `Nama Siswa/i: ${surat_keluar.name}`, yPos + 50);
                addTextWithUnderline(pdf, `Kelas: ${surat_keluar.kelas}`, yPos + 60);
                addTextWithUnderline(pdf, `Alasan: ${surat_keluar.alasan}`, yPos + 70);
                addTextWithUnderline(pdf, `Status: ${surat_keluar.status}`, yPos + 80);
                // Tingkatkan yPos untuk baris berikutnya
                yPos += 20;
            });
        
            pdf.save('Surat_Izin_Keluar.pdf'); 
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
                Tambah Surat Keluar
            </Button>

            {/* Modal Form Tambah User */}
            <Modal show={showAddForm} onHide={() => setShowAddForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Surat Keluar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={storeSurat_keluar}>
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
                    <Modal.Title>Edit Surat Keluar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={handleEditFormSubmit}>
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
                            <th scope="col" style={{color: 'white'}}>Tanggal Surat</th>
                            <th scope="col" style={{color: 'white'}}>Nama Siswa</th>
                            <th scope="col" style={{color: 'white'}}>Kelas</th>
                            <th scope="col" style={{color: 'white'}}>Alasan</th>
                            <th scope="col" style={{color: 'white'}}>Status</th>
                            <th scope="col" style={{color: 'white'}}>Pilih Eksport</th>
                            {hasAnyPermission(['tugas_guru.index']) &&
                            <th scope="col" style={{color: 'white'}}>Konfirmasi</th>
                            }
                            <th scope="col" style={{color: 'white'}}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className='table-group-divider'>
                    {suratKeluarWithUsers.length > 0 ? (
                      suratKeluarWithUsers
                    .filter((surat_keluar) => filterByKelas(surat_keluar) && searchFilter(surat_keluar))
                    .map((surat_keluar, index, array) => (
                        <tr key={surat_keluar.id}>
                        <td>{array.length - index}</td>
                        <td>{surat_keluar.tanggal_surat}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="ms-3">
                              <p className="fw-bold mb-1" style={{ color: 'black' }}>
                                {surat_keluar.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>{surat_keluar.kelas}</td>
                        <td>{surat_keluar.alasan}</td>
                        <td>
                          <span
                            className="badge rounded-pill"
                            style={{
                              color: 'white',
                              backgroundColor: getConfirm(surat_keluar.status),
                            }}
                          >{surat_keluar.status}
                          </span>
                        </td>
                        <td className='text-center'><input type="checkbox" style={{width: '50px', height: '20px'}} checked={surat_keluar.selected} onChange={() => toggleSelection(surat_keluar.id)}/></td>
                        {hasAnyPermission(['tugas_guru.index']) &&
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <button
                              type="button"
                              className="btn-setuju btn-link btn-sm btn-rounded border-0 mx-2"
                              style={{ display: 'flex', alignItems: 'center' }}
                              onClick={() => handleSetuju(surat_keluar.id)}
                            >
                              <img src={setuju} alt="" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                            </button>
                            <button
                              type="button"
                              className="btn-tolak btn-link btn-sm btn-rounded border-0"
                              style={{ display: 'flex', alignItems: 'center' }}
                              onClick={() => handleTolak(surat_keluar.id)}
                            >
                              <img src={tolak} alt="" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                            </button>
                          </div>
                        </td>
                        }
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <button
                              onClick={() => handleEdit(surat_keluar.id)}
                              type="button"
                              className="btn-edit btn-link btn-sm btn-rounded border-0 mx-2"
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              <img src={edit} alt="" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                            </button>
                            <button
                              onClick={() => confirmDelete(surat_keluar.id)}
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
                            <td colSpan="9" className="text-center">
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
