let hurdaData = [];

document.getElementById("hurdaForm").addEventListener("submit", hurdaEkle);

function urunleriGetir() {
    fetch("/api/urunler/")
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById("hurdaUrun");
            if (!data.length) {
                select.innerHTML = `<option disabled>Ürün bulunamadı</option>`;
                return;
            }
            select.innerHTML = data.map(u =>
                `<option value="${u.id}">${u.adi || ''} (${u.aciklama1 || ''}) - (${u.aciklama2 || ''}) - (${u.aciklama3 || ''})</option>`
            ).join("");
        })
        .catch(err => console.error("Ürünler yüklenemedi:", err));
}

function lokasyonlariGetir() {
    fetch("/api/lokasyonlar/")
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById("hurdaLokasyon");
            select.innerHTML = data.map(l => `<option value="${l.id}">${l.isim}</option>`).join("");
        })
        .catch(err => console.error("Lokasyonlar yüklenemedi:", err));
}

function hurdaEkle(e) {
    e.preventDefault();

    const veri = {
        urun: document.getElementById("hurdaUrun").value,
        adet: document.getElementById("hurdaAdet").value,
        aciklama: document.getElementById("hurdaAciklama").value,
        lokasyon: document.getElementById("hurdaLokasyon").value,
        islem_turu: "Çıkış",
        plaka: "HURDA"
    };

    fetch("/api/stok_hareketleri/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(veri)
    })
    .then(res => {
        if (!res.ok) throw new Error("Hurda işlemi başarısız");
        alert("Hurdaya gönderildi!");
        document.getElementById("hurdaForm").reset();
        hurdaListesiniGetir();
    })
    .catch(err => alert("Hata: " + err.message));
}

function hurdaListesiniGetir() {
    fetch("/api/stok_hareketleri/")
        .then(res => res.json())
        .then(data => {
            const hurdaHareketler = data.filter(h => h.plaka === "HURDA" && h.islem_turu === "Çıkış");
            hurdaData = hurdaHareketler;

            const tbody = document.getElementById("hurdaListe");
            if (!hurdaHareketler.length) {
                tbody.innerHTML = `<tr><td colspan="5" class="text-center">Henüz hurda gönderimi yapılmamış.</td></tr>`;
                return;
            }

            const rows = hurdaHareketler.map(h => `
                <tr>
                    <td>${h.urun_adi}</td>
                    <td>${h.adet}</td>
                    <td>${h.aciklama || '-'}</td>
                    <td>${h.lokasyon_adi || '-'}</td>
                    <td>${new Date(h.tarih).toLocaleString()}</td>
                </tr>
            `);
            tbody.innerHTML = rows.join("");
        })
        .catch(err => {
            console.error("Hurda hareketleri yüklenemedi:", err);
            document.getElementById("hurdaListe").innerHTML =
                `<tr><td colspan="5" class="text-danger text-center">Hurda listesi yüklenemedi</td></tr>`;
        });
}

function exportHurdaExcel() {
    if (!hurdaData.length) return alert("Aktarılacak hurda kaydı yok.");

    const headers = ["Ürün", "Adet", "Açıklama", "Lokasyon", "Tarih"];
    const rows = hurdaData.map(h => [
        h.urun_adi,
        h.adet,
        h.aciklama || "",
        h.lokasyon_adi || "",
        new Date(h.tarih).toLocaleString()
    ]);

    const csv = "\uFEFF" + [headers, ...rows].map(r => r.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "hurda_listesi.csv";
    link.click();
}

document.addEventListener("DOMContentLoaded", () => {
    urunleriGetir();
    lokasyonlariGetir();
    hurdaListesiniGetir();

    const exportBtn = document.getElementById("hurdaExportBtn");
    if (exportBtn) exportBtn.addEventListener("click", exportHurdaExcel);
});
