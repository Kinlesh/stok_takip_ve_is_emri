function kategorileriGetir() {
    fetch("/api/kategoriler/")
        .then(res => res.json())
        .then(data => {
            let rows = data.map(k =>
                `<tr id="kategori-${k.id}">
                    <td>${k.isim}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="kategoriDuzenle(${k.id}, '${k.isim}')">Düzenle</button>
                        <button class="btn btn-danger btn-sm" onclick="kategoriSil(${k.id})">Sil</button>
                    </td>
                </tr>`
            );
            document.getElementById("kategoriler").innerHTML = rows.join("");
        });
}

function kategoriEkle() {
    let kategoriAdi = document.getElementById("kategoriAdi").value.trim();
    if (!kategoriAdi) return alert("Lütfen bir kategori adı girin!");

    fetch("/api/kategoriler/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isim: kategoriAdi })
    })
    .then(() => {
        document.getElementById("kategoriAdi").value = "";
        kategorileriGetir();
    });
}

function kategoriSil(kategoriId) {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;

    fetch(`/api/kategoriler/${kategoriId}/`, { method: "DELETE" })
        .then(() => document.getElementById(`kategori-${kategoriId}`).remove());
}

function kategoriDuzenle(id, isim) {
    document.getElementById("duzenleKategoriId").value = id;
    document.getElementById("duzenleKategoriAdi").value = isim;
    new bootstrap.Modal(document.getElementById("duzenleModal")).show();
}

function kategoriGuncelle() {
    let id = document.getElementById("duzenleKategoriId").value;
    let yeniIsim = document.getElementById("duzenleKategoriAdi").value.trim();

    if (!yeniIsim) return alert("Kategori adı boş olamaz!");

    fetch(`/api/kategoriler/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isim: yeniIsim })
    })
    .then(() => {
        kategorileriGetir();
        bootstrap.Modal.getInstance(document.getElementById("duzenleModal")).hide();
    });
}

document.addEventListener("DOMContentLoaded", kategorileriGetir);
