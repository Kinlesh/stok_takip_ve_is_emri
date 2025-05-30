from django.urls import path
from . import views

urlpatterns = [
    # 📦 KATEGORİLER
    path('kategoriler/', views.kategori_listesi_ve_ekle, name='kategori_listesi_ve_ekle'),
    path('kategoriler/<int:pk>/', views.kategori_detay, name='kategori_detay'),

    # 📦 ÜRÜNLER
    path('urunler/', views.urun_listesi_ve_ekle, name='urun_listesi_ve_ekle'),
    path('urunler/<int:pk>/', views.urun_detay, name='urun_detay'),
    path('urunler/<int:pk>/stok-hareketleri/', views.urun_stok_hareketleri, name='urun_stok_hareketleri'),

    # 📦 STOK HAREKETLERİ
    path('stok_hareketleri/', views.stok_hareketleri, name='stok_hareketleri'),

    # 📢 KRİTİK STOK
    path('kritik_urunler/', views.kritik_urunler, name='kritik_urunler'),

    path('lokasyonlar/', views.lokasyon_listesi_ve_ekle, name='lokasyonlar'),

    path('personeller/', views.personel_listesi_ve_ekle, name='personeller'),

]
