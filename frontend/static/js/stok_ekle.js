document.getElementById("stokEkleForm").addEventListener("submit", stokHareketiEkle);
function stokHareketiEkle(event) {
    event.preventDefault();

    let hareket = {
        urun: document.getElementById("stokUrun").value,
        islem_turu: document.getElementById("stokIslem").value,
        adet: document.getElementById("stokAdet").value,
        aciklama: document.getElementById("stokAciklama").value,
        plaka: document.getElementById("stokPlaka").value,
        lokasyon: document.getElementById("stokLokasyon").value,
        personel: document.getElementById("stokPersonel").value,


    };

    fetch("/api/stok_hareketleri/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hareket)
    }).then(() => {
        alert("Stok hareketi eklendi!");
        document.getElementById("stokEkleForm").reset();
    });
}
function urunleriGetir() {
    fetch("/api/urunler/")
        .then(res => res.json())
        .then(data => {
            let stokUrun = document.getElementById("stokUrun");
            stokUrun.innerHTML = '<option value="">Ürün Seç</option>';

            if (data.length === 0) {
                stokUrun.innerHTML = '<option value="">Ürün Bulunamadı</option>';
            } else {

                let urunSecenekleri = data.map(u => `<option value="${u.id}">${u.adi ||''}  (${u.aciklama1 || ''}) - (${u.aciklama2 || ''}) - (${u.aciklama3 || ''})</option>`);

                stokUrun.innerHTML += urunSecenekleri.join("");
            }
        })
        .catch(error => console.error("Ürünleri getirme hatası:", error));
}



document.addEventListener("DOMContentLoaded", urunleriGetir);

function lokasyonlariGetir() {
    fetch("/api/lokasyonlar/")
        .then(res => res.json())
        .then(data => {
            let select = document.getElementById("stokLokasyon");
            select.innerHTML = '<option value="">Lokasyon Seç</option>';
            let options = data.map(l => `<option value="${l.id}">${l.isim}</option>`);
            select.innerHTML += options.join("");
        })
        .catch(err => console.error("Lokasyonlar yüklenemedi:", err));
}



function personelleriGetir() {
    fetch("/api/personeller/")
        .then(res => res.json())
        .then(data => {
            let select = document.getElementById("stokPersonel");
            select.innerHTML = '<option value="">Personel Seç</option>';
            let options = data.map(p => `<option value="${p.id}">${p.isim}</option>`);
            select.innerHTML += options.join("");
        });
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener("DOMContentLoaded", () => {
    urunleriGetir();
    lokasyonlariGetir();
    personelleriGetir();  // 👈 bu eklenecek
});