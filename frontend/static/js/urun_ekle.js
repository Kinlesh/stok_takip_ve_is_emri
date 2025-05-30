document.getElementById("urunEkleForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let urun = {
        adi: document.getElementById("adi").value,
        kategori: document.getElementById("kategori").value,
        aciklama1: document.getElementById("aciklama1").value,
        aciklama2: document.getElementById("aciklama2").value,
        aciklama3: document.getElementById("aciklama3").value,
        ybs_malzeme_ismi: document.getElementById("ybs_malzeme_ismi").value,
        ybs_malzeme_kodu: document.getElementById("ybs_malzeme_kodu").value,

    };

    fetch("/api/urunler/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(urun)
    })
    .then(() => window.location.href = "/urunler/");
});

function kategorileriGetir() {
    fetch("/api/kategoriler/")
        .then(res => res.json())
        .then(data => {
            let kategoriSecenekleri = data.map(k => `<option value="${k.id}">${k.isim}</option>`);
            document.getElementById("kategori").innerHTML += kategoriSecenekleri.join("");
        });
}

document.addEventListener("DOMContentLoaded", kategorileriGetir);
