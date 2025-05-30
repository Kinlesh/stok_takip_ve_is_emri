from django.urls import path
from . import views

urlpatterns = [
    path('',views.index,name='home'),
    path('modul-secimi/', views.modul_secimi, name='modul_secimi'),


    path('is-emri/', views.is_emri_listesi, name='is_emri_listesi'),
    path('is-emri/ekle/', views.is_emri_ekle, name='is_emri_ekle'),
    path('yapilacak-is-ekle/', views.yapilacak_is_ekle, name='yapilacak_is_ekle'),
    path('is-turu-ekle/', views.is_turu_ekle, name='is_turu_ekle'),

    # ÜRÜNLER
    path('urunler/', views.urun_listesi, name='urun_listesi'),
    path('urunler/ekle/', views.urun_ekle, name='urun_ekle'),
    path('urunler/<int:urun_id>/', views.urun_detay, name='urun_detay'),

    # KATEGORİLER
    path('kategoriler/', views.kategori_listesi, name='kategori_listesi'),

    # STOK HAREKETLERİ
    path('stok_ekle/', views.stok_ekle, name='stok_ekle'),  # 🔹 Stok ekleme sayfası için yönlendirme
    path('stok_hareketleri/', views.stok_hareketleri, name='stok_hareketleri'),
    path('lokasyon_ekle/', views.lokasyon_ekle, name='lokasyon_ekle'),
    path('personel_ekle/', views.personel_ekle, name='personel_ekle'),
    path('hurda_kontrol/', views.hurda_kontrol, name='hurda_kontrol'),
]
