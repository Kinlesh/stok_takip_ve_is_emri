function personelleriGetir() {
    fetch("/api/personeller/")
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById("personeller");
            tbody.innerHTML = data.map(p =>
                `<tr id="personel-${p.id}">
                    <td>${p.isim}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="personelDuzenle(${p.id}, '${p.isim}')">Düzenle</button>
                        <button class="btn btn-danger btn-sm" onclick="personelSil(${p.id})">Sil</button>
                    </td>
                </tr>`
            ).join("");
        });
}

function personelEkle() {
    const isim = document.getElementById("personelAdi").value.trim();
    if (!isim) return alert("Lütfen personel adı girin!");

    fetch("/api/personeller/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isim })
    })
    .then(res => {
        if (!res.ok) throw new Error("Personel eklenemedi");
        return res.json();
    })
    .then(() => {
        document.getElementById("personelAdi").value = "";
        personelleriGetir();
    });
}

function personelSil(id) {
    if (!confirm("Bu personeli silmek istediğinizden emin misiniz?")) return;

    fetch(`/api/personeller/${id}/`, { method: "DELETE" })
        .then(() => {
            document.getElementById(`personel-${id}`).remove();
        });
}

function personelDuzenle(id, isim) {
    document.getElementById("duzenlePersonelId").value = id;
    document.getElementById("duzenlePersonelAdi").value = isim;
    new bootstrap.Modal(document.getElementById("duzenlePersonelModal")).show();
}

function personelGuncelle() {
    const id = document.getElementById("duzenlePersonelId").value;
    const yeniIsim = document.getElementById("duzenlePersonelAdi").value.trim();

    if (!yeniIsim) return alert("İsim boş olamaz!");

    fetch(`/api/personeller/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isim: yeniIsim })
    })
    .then(() => {
        bootstrap.Modal.getInstance(document.getElementById("duzenlePersonelModal")).hide();
        personelleriGetir();
    });
}

document.addEventListener("DOMContentLoaded", personelleriGetir);
