import React from "react";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

function LandingPage() {
  // Data kategori produk
  const kategoriProduk = [
    {
      nama: "Men Fashion",
      gambar: "https://forgecraftmensjewelry.com/cdn/shop/articles/minimalist-mens-fashion-beige-shirt-and-trousers.jpg?v=1737391858&width=1100",
      jumlah: 120,
      link: "/kategori/man-fashion",
      warna: "bg-pink-100",
    },
    {
      nama: "Women Fashion",
      gambar: "https://img.freepik.com/free-photo/black-woman-trendy-grey-leather-jacket-posing-beige-background-studio-winter-autumn-fashion-look_273443-141.jpg",
      jumlah: 85,
      link: "/kategori/woman-fashion",
      warna: "bg-blue-100",
    },
    {
      nama: "Kendaraan",
      gambar: "https://img.freepik.com/premium-photo/brown-car-isolated-white-background_140916-41243.jpg",
      jumlah: 64,
      link: "/kategori/kendaraan",
      warna: "bg-amber-100",
    },
    {
      nama: "Gadget",
      gambar: "https://img.freepik.com/free-photo/modern-stationary-collection-arrangement_23-2149309643.jpg",
      jumlah: 42,
      link: "/kategori/gadget",
      warna: "bg-purple-100",
    },
    {
      nama: "Properti",
      gambar: "https://kumbanews.com/wp-content/uploads/2018/11/home-insurance-e1479125215618.jpg",
      jumlah: 42,
      link: "/kategori/properti",
      warna: "bg-purple-100",
    },
    {
      nama: "Olahraga",
      gambar: "https://media.istockphoto.com/id/1355687112/photo/various-sport-equipment-gear.jpg?s=612x612&w=0&k=20&c=JOizKZg68gs_7lxjM3YLrngeS-7dGhBXL8b-wDBrYUE=",
      jumlah: 42,
      link: "/kategori/olahraga",
      warna: "bg-purple-100",
    },
    {
      nama: "Gadget",
      gambar: "https://jarrakposlampung.id/wp-content/uploads/2024/06/Gagdet.jpg",
      jumlah: 42,
      link: "/kategori/gadget",
      warna: "bg-purple-100",
    },
    {
      nama: "Gadget",
      gambar: "https://jarrakposlampung.id/wp-content/uploads/2024/06/Gagdet.jpg",
      jumlah: 42,
      link: "/kategori/gadget",
      warna: "bg-purple-100",
    }
  ];

  return (
    <div className="min-h-screen w-full bg-amber-50">
      {/* Bagian Hero */}
      <main className="w-full h-screen flex items-center justify-center px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Konten Kiri */}
            <div className="w-full md:w-1/2 mb-12 md:mb-0">
              <h2 className="text-gray-700 font-bold mb-4">
                Halo, Selamat Datang
              </h2>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Temukan Barang<br />Murah Impianmu
              </h1>
              <p className="mb-5 mt-5 text-gray-700">
                Trend Terkini: Zara, iPhone, Dress, iPad, Adidas, Crocs, Apple Watch, Perabotan
              </p>
              <div className="flex space-x-5">
                <Link to="">
                  <Button color="blue" className="px-7 py-2 font-semibold">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>

            {/* Gambar Kanan */}
            <div className="md:w-1/2 mt-10 md:mt-0">
              <img
                src="/bglanding.png"
                alt="Produk unggulan"
                className="w-full max-w-xl mx-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Section Kategori - Gambar Full Card */}
      <section className="py-16 bg-white px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Temukan Kategori Favoritmu</h2>
            <p className="text-gray-600 mt-3">Jelajahi koleksi terbaik kami</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {kategoriProduk.map((kategori, index) => (
              <Link
                to={kategori.link}
                key={index}
                className="mt-6 group relative block h-64 overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={kategori.gambar}
                  alt={kategori.nama}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-600 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-xl font-bold text-white">{kategori.nama}</h3>
                  <p className="text-white/90">{kategori.jumlah}+ produk</p>
                </div>
                <div className={`absolute top-4 right-4 ${kategori.warna} px-3 py-1 rounded-full text-sm font-medium`}>
                  Hot
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;