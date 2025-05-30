function lokasyonlariGetir() {
    fetch("/api/lokasyonlar/")
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById("lokasyonlar");
            tbody.innerHTML = data.map(l =>
                `<tr id="lokasyon-${l.id}">
                    <td>${l.isim}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="lokasyonDuzenle(${l.id}, '${l.isim}')">Düzenle</button>
                        <button class="btn btn-danger btn-sm" onclick="lokasyonSil(${l.id})">Sil</button>
                    </td>
                </tr>`
            ).join("");
        });
}

function lokasyonEkle() {
    const isim = document.getElementById("lokasyonAdi").value.trim();
    if (!isim) return alert("Lütfen lokasyon adı girin!");

    fetch("/api/lokasyonlar/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isim })
    })
    .then(res => {
        if (!res.ok) throw new Error("Eklenemedi");
        return res.json();
    })
    .then(() => {
        document.getElementById("lokasyonAdi").value = "";
        lokasyonlariGetir();
    });
}

function lokasyonSil(id) {
    if (!confirm("Bu lokasyonu silmek istediğinizden emin misiniz?")) return;

    fetch(`/api/lokasyonlar/${id}/`, { method: "DELETE" })
        .then(() => {
            document.getElementById(`lokasyon-${id}`).remove();
        });
}

function lokasyonDuzenle(id, isim) {
    document.getElementById("duzenleLokasyonId").value = id;
    document.getElementById("duzenleLokasyonAdi").value = isim;
    new bootstrap.Modal(document.getElementById("duzenleLokasyonModal")).show();
}

function lokasyonGuncelle() {
    const id = document.getElementById("duzenleLokasyonId").value;
    const yeniIsim = document.getElementById("duzenleLokasyonAdi").value.trim();

    if (!yeniIsim) return alert("İsim boş olamaz!");

    fetch(`/api/lokasyonlar/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isim: yeniIsim })
    })
    .then(() => {
        bootstrap.Modal.getInstance(document.getElementById("duzenleLokasyonModal")).hide();
        lokasyonlariGetir();
    });
}

document.addEventListener("DOMContentLoaded", lokasyonlariGetir);
