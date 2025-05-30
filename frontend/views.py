from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect


# İş Emri View'ları
from is_emri.models import IsEmri, YapilacakIs, IsTuru
from urunler.models import Lokasyon, Personel
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required

@login_required
def is_emri_listesi(request):
    is_emirleri = IsEmri.objects.all()
    return render(request, 'frontend/is_emri_listesi.html', {'is_emirleri': is_emirleri})

@login_required
@require_http_methods(["GET", "POST"])
def is_emri_ekle(request):
    if request.method == "POST":
        lokasyon_id = request.POST.get("lokasyon")
        ilce = request.POST.get("ilce")
        yapilacak_isler_ids = request.POST.getlist("yapilacak_isler")
        is_turleri_ids = request.POST.getlist("is_turleri")
        personel1_id = request.POST.get("personel1")
        personel2_id = request.POST.get("personel2")
        personel3_id = request.POST.get("personel3")
        personel4_id = request.POST.get("personel4")
        aciklama = request.POST.get("aciklama")
        sonuc = request.POST.get("sonuc")
        baslangic_foto = request.FILES.get("baslangic_fotograf")
        bitis_foto = request.FILES.get("bitis_fotograf")

        is_emri = IsEmri.objects.create(
            lokasyon_id=lokasyon_id,
            ilce=ilce,
            personel1_id=personel1_id,
            personel2_id=personel2_id or None,
            personel3_id=personel3_id or None,
            personel4_id=personel4_id or None,
            aciklama=aciklama,
            sonuc=sonuc,
            baslangic_fotograf=baslangic_foto,
            bitis_fotograf=bitis_foto,
        )
        is_emri.yapilacak_isler.set(yapilacak_isler_ids)
        is_emri.is_turleri.set(is_turleri_ids)
        is_emri.save()
        return redirect('is_emri_listesi')

    context = {
        "lokasyonlar": Lokasyon.objects.all(),
        "personeller": Personel.objects.all(),
        "yapilacak_isler": YapilacakIs.objects.all(),
        "is_turleri": IsTuru.objects.all(),
    }
    return render(request, 'frontend/is_emri_ekle.html', context)
from django.contrib.auth.decorators import user_passes_test

def modul_secimi(request):
    return render(request, 'frontend/modul_secimi.html')
def admin_kontrol(user):
    return user.is_authenticated and user.is_admin

@user_passes_test(admin_kontrol)
def yapilacak_is_ekle(request):
    if request.method == "POST":
        isim = request.POST.get("isim")
        if isim:
            YapilacakIs.objects.create(isim=isim)
            return redirect('yapilacak_is_ekle')
    return render(request, 'frontend/yapilacak_is_ekle.html')

@user_passes_test(admin_kontrol)
def is_turu_ekle(request):
    if request.method == "POST":
        isim = request.POST.get("isim")
        if isim:
            IsTuru.objects.create(isim=isim)
            return redirect('is_turu_ekle')
    return render(request, 'frontend/is_turu_ekle.html')

def index(request):
    return render(request, 'frontend/urun_listesi.html')

### 📌 ÜRÜNLER
def urun_listesi(request):
    """Ürünlerin listelendiği sayfa"""
    return render(request, 'frontend/urun_listesi.html')

def urun_ekle(request):
    """Yeni ürün ekleme sayfası"""
    return render(request, 'frontend/urun_ekle.html')

def urun_detay(request, urun_id):
    """Belirli bir ürünün detaylarını gösteren sayfa"""
    return render(request, 'frontend/urun_detay.html', {'urun_id': urun_id})

### 📌 KATEGORİLER
def kategori_listesi(request):
    """Kategorilerin listelendiği sayfa"""
    return render(request, 'frontend/kategori_listesi.html')

### 📌 STOK HAREKETLERİ
def stok_ekle(request):
    """Yeni stok hareketi ekleme sayfası"""
    return render(request, 'frontend/stok_ekle.html')

def stok_hareketleri(request):
    """Tüm stok hareketlerinin listelendiği sayfa"""
    return render(request, 'frontend/stok_hareketleri.html')
def lokasyon_ekle(request):
    return render(request, 'frontend/lokasyon_ekle.html')
def personel_ekle(request):
    return render(request, 'frontend/personel_ekle.html')
def hurda_kontrol(request):
    return render(request, "frontend/hurda_kontrol.html")
def modul_secimi(request):
    return render(request, 'frontend/modul_secimi.html')