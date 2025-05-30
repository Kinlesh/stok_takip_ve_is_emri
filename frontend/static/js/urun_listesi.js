let urunData = [];

function urunleriGetir() {
    const sirala = document.getElementById("siralaSelect")?.value || "";
    let url = "/api/urunler/";
    if (sirala) url += `?sirala=${sirala}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            urunData = data;
            if (!Array.isArray(data)) {
                console.error("API yanlış formatta veri döndü:", data);
                return;
            }

            const tbody = document.getElementById("urunler");
            if (data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="9" class="text-center text-danger">Ürün Bulunamadı</td></tr>`;
                return;
            }

            const rows = data.map(u =>
                `<tr>
                    <td>${u.adi}</td>
                    <td>${u.kategori_adi || '-'}</td>
                    <td><strong>${u.stok_miktari || 0}</strong></td>
                    <td>${u.aciklama1 || '-'}</td>
                    <td>${u.aciklama2 || '-'}</td>
                    <td>${u.aciklama3 || '-'}</td>
                    <td>${u.ybs_malzeme_ismi || '-'}</td>
                    <td>${u.ybs_malzeme_kodu || '-'}</td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm" onclick="stokSayfasinaGit()">📦</button>
                        <button class="btn btn-outline-info btn-sm" onclick="urunDetaySayfasinaGit(${u.id})">🔍</button>
                    </td>
                </tr>`
            );

            tbody.innerHTML = rows.join("");
            filtreleUrunler();
        })
        .catch(err => {
            console.error("Ürünleri getirme hatası:", err);
            document.getElementById("urunler").innerHTML =
                `<tr><td colspan="9" class="text-danger text-center">Ürünler yüklenemedi</td></tr>`;
        });
}

function filtreleUrunler() {
    const input = document.getElementById("urunAra");
    if (!input) return;

    const filter = input.value.toLowerCase();
    const rows = document.querySelectorAll("#urunler tr");

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
    });
}

function exportUrunlerExcel() {
    if (!urunData.length) return alert("Aktarılacak ürün yok.");

    const headers = [
        "Ürün", "Kategori", "Stok",
        "Marka", "Model", "Açıklama",
        "YBS Malzeme İsmi", "YBS Malzeme Kodu",
    ];

    const rows = urunData.map(u => [
        u.adi, u.kategori_adi, u.stok_miktari,
        u.aciklama1 || "", u.aciklama2 || "", u.aciklama3 || "",
        u.ybs_malzeme_ismi || "", u.ybs_malzeme_kodu || "",
    ]);

    const csvContent = "\uFEFF" + [headers, ...rows].map(row => row.join(";")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "urunler.csv";
    link.click();
}

function stokSayfasinaGit() {
    window.location.href = "/stok_ekle/";
}

function urunDetaySayfasinaGit(id) {
    window.location.href = `/urunler/${id}/`;
}

document.addEventListener("DOMContentLoaded", () => {
    urunleriGetir();
    document.getElementById("urunAra")?.addEventListener("input", filtreleUrunler);
    document.getElementById("siralaSelect")?.addEventListener("change", urunleriGetir);
});
