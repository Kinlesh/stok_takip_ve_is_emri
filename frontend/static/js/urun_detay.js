function urunGuncelle() {
const urun = {

    adi: document.getElementById("urunAdiInput").value,
    kategori: document.getElementById("urunKategori").value,
    aciklama1: document.getElementById("aciklama1").value,
    aciklama2: document.getElementById("aciklama2").value,
    aciklama3: document.getElementById("aciklama3").value,
    minimum_stok: document.getElementById("minimumStok").value,
     ybs_malzeme_ismi: document.getElementById("ybs_malzeme_ismi").value,
    ybs_malzeme_kodu: document.getElementById("ybs_malzeme_kodu").value,
};


    fetch(`/api/urunler/${urunId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(urun)
    })
        .then(res => {
            if (!res.ok) throw new Error("Güncelleme başarısız");
            alert("Ürün güncellendi.");
            urunDetayGetir(); // Güncel verileri tekrar çek
        })
        .catch(err => alert("Hata: " + err.message));
}
function urunDetayGetir() {
    fetch(`/api/urunler/${urunId}/`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("urunAdiInput").value = data.adi || "";
            document.getElementById("urunStok").textContent = data.stok_miktari;
            document.getElementById("aciklama1").value = data.aciklama1 || "";
            document.getElementById("aciklama2").value = data.aciklama2 || "";
            document.getElementById("aciklama3").value = data.aciklama3 || "";
            document.getElementById("minimumStok").value = data.minimum_stok || 0;
            document.getElementById("ybs_malzeme_ismi").value = data.ybs_malzeme_ismi || "";
            document.getElementById("ybs_malzeme_kodu").value = data.ybs_malzeme_kodu || "";


            // Kritik stok görsel uyarı
            const stokLabel = document.getElementById("urunStok");
            stokLabel.classList.remove("text-danger", "text-success");
            if (data.stok_miktari < data.minimum_stok) {
                stokLabel.classList.add("text-danger");
            } else {
                stokLabel.classList.add("text-success");
            }

            kategoriListesiniGetir(data.kategori);
        })
        .catch(err => {
            console.error("Ürün detayları yüklenemedi:", err);
            alert("Ürün bilgisi alınamadı!");
        });
}



function kategoriListesiniGetir(seciliKategoriId) {
    fetch("/api/kategoriler/")
        .then(res => res.json())
        .then(data => {
            const kategoriDropdown = document.getElementById("urunKategori");
            kategoriDropdown.innerHTML = data.map(k =>
                `<option value="${k.id}" ${k.id == seciliKategoriId ? "selected" : ""}>${k.isim}</option>`
            ).join("");
        })
        .catch(err => console.error("Kategoriler alınamadı:", err));
}



function urunSil() {
    if (!confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return;

    fetch(`/api/urunler/${urunId}/`, { method: "DELETE" })
        .then(() => {
            alert("Ürün silindi.");
            window.location.href = "/urunler/";
        })
        .catch(err => alert("Silme işlemi başarısız: " + err.message));
}

function stokHareketleriniGetir() {
    fetch(`/api/urunler/${urunId}/stok-hareketleri/`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById("stokHareketleri");
            if (!Array.isArray(data)) {
                tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Veri hatası</td></tr>`;
                return;
            }

            if (data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Stok hareketi yok</td></tr>`;
                return;
            }

            const rows = data.map(h =>
                `<tr>
                    <td>${h.islem_turu}</td>
                    <td>${h.adet}</td>
                    <td>${h.aciklama || '-'}</td>
                    <td>${h.plaka || '-'}</td>
                    <td>${new Date(h.tarih).toLocaleString()}</td>
                </tr>`
            );
            tbody.innerHTML = rows.join("");
        })
        .catch(err => {
            console.error("Stok hareketleri yüklenemedi:", err);
            document.getElementById("stokHareketleri").innerHTML =
                `<tr><td colspan="5" class="text-danger text-center">Veri yüklenemedi</td></tr>`;
        });
}

// Sayfa yüklendiğinde
document.addEventListener("DOMContentLoaded", function () {
    urunDetayGetir();
    stokHareketleriniGetir();
});
