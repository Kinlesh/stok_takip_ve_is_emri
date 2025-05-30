let pencereData = [];

function stokHareketleriniGetir() {
    const sirala = document.getElementById("stokSirala")?.value || "";
    let url = "/api/stok_hareketleri/";
    if (sirala) url += `?sirala=${sirala}`;

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("Veri alınamadı.");
            return res.json();
        })
        .then(data => {
            pencereData = data;

            if (!Array.isArray(data)) {
                console.error("Beklenmeyen veri formatı:", data);
                return;
            }

            const tbody = document.getElementById("stokHareketleri");
            if (!tbody) return;

            const rows = data.map(h =>
                `<tr>
                    <td>${h.urun_adi}</td>
                    <td>${h.islem_turu}</td>
                    <td>${h.adet}</td>
                    <td>${h.aciklama || '-'}</td>
                    <td>${h.plaka || '-'}</td>
                    <td>${h.lokasyon_adi || '-'}</td>
                    <td>${h.personel_adi || '-'}</td>
                    <td>${new Date(h.tarih).toLocaleString()}</td>
                </tr>`
            );

            tbody.innerHTML = rows.join("");
            filtreleStok();
        })
        .catch(err => {
            console.error("Stok hareketleri getirme hatası:", err);
            document.getElementById("stokHareketleri").innerHTML =
                `<tr><td colspan="8" class="text-danger text-center">Stok hareketleri yüklenemedi</td></tr>`;
        });
}

function filtreleStok() {
    const input = document.getElementById("stokAra");
    if (!input) return;

    const filter = input.value.toLowerCase();
    const rows = document.querySelectorAll("#stokHareketleri tr");

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
    });
}

function exportExcel() {
    if (!Array.isArray(pencereData) || pencereData.length === 0) {
        alert("Aktarılacak veri yok!");
        return;
    }

    const headers = ["Ürün", "İşlem Türü", "Adet", "Açıklama", "Plaka", "Lokasyon", "Personel", "Tarih"];
    const rows = pencereData.map(h => [
        h.urun_adi,
        h.islem_turu,
        h.adet,
        h.aciklama || "",
        h.plaka || "",
        h.lokasyon_adi || "",
        h.personel_adi || "",
        new Date(h.tarih).toLocaleString()
    ]);

    const bom = "\uFEFF";  // Türkçe karakter desteği için BOM
    const csvString = bom + [headers, ...rows].map(e => e.join(";")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "stok_hareketleri.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
}

document.addEventListener("DOMContentLoaded", () => {
    stokHareketleriniGetir();
    document.getElementById("stokSirala")?.addEventListener("change", stokHareketleriniGetir);
    document.getElementById("stokAra")?.addEventListener("input", filtreleStok);
});
