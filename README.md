# 🧾 Stok Takip ve İş Emri Yönetim Sistemi

Django tabanlı bu sistem, sahadaki personelin iş emirlerini ve stok hareketlerini takip etmek amacıyla geliştirilmiştir.

## 🔍 Özellikler
- Admin ve kullanıcı giriş sistemi (Custom User)
- Çoklu personel atamalı iş emirleri
- İş türü ve yapılacak işler seçimi
- Lokasyon ve ilçe bazlı iş kayıtları
- Başlangıç ve bitiş fotoğrafları yüklenebilir
- Stok takibi (ürün, personel, lokasyon, kategori)

## 🧰 Kullanılan Teknolojiler
- Django
- PostgreSQL
- Python 3
- HTML/CSS (Bootstrap)

## ⚙️ Kurulum

```bash
git clone https://github.com/Kinlesh/StokTakip.git
cd StokTakip
pip install -r requirements.txt  # varsa
python manage.py migrate
python manage.py runserver
