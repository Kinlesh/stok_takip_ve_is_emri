document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/kritik_urunler/")
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                const list = data.map(u =>
                    `<li><strong>${u.adi}</strong> (Stok: ${u.stok_miktari || 0}, Minimum: ${u.minimum_stok})</li>`
                ).join("");
                document.getElementById("kritikUrunler").innerHTML =
                    `<strong>Dikkat!</strong> Minimum stok altındaki ürünler:<ul>${list}</ul>`;
                document.getElementById("kritikUrunler").style.display = "block";
            }
        })
        .catch(err => console.error("Kritik ürün yüklenemedi:", err));
});
