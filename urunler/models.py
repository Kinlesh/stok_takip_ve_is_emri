from django.db import models

class Personel(models.Model):
    isim = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.isim

class Lokasyon(models.Model):
    isim = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.isim
class Kategori(models.Model):
    isim = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.isim

class Urun(models.Model):
    adi = models.CharField(max_length=255)
    kategori = models.ForeignKey(Kategori, on_delete=models.CASCADE)
    minimum_stok = models.PositiveIntegerField(default=0)
    stok_miktari = models.IntegerField(default=0)

    ybs_malzeme_ismi = models.CharField(max_length=255, blank=True, null=True)
    ybs_malzeme_kodu = models.CharField(max_length=255, blank=True, null=True)

    aciklama1 = models.TextField("Marka",blank=True, null=True)
    aciklama2 = models.TextField("Model",blank=True, null=True)
    aciklama3 = models.TextField("Açıklama",blank=True, null=True)

    def __str__(self):
        return self.adi

    def guncelle_stok(self):
        toplam_giris = StokHareketi.objects.filter(urun=self, islem_turu="Giriş").aggregate(models.Sum('adet'))['adet__sum'] or 0
        toplam_cikis = StokHareketi.objects.filter(urun=self, islem_turu="Çıkış").aggregate(models.Sum('adet'))['adet__sum'] or 0
        self.stok_miktari = toplam_giris - toplam_cikis
        self.save()

class StokHareketi(models.Model):
    ISLEM_TURLERI = [
        ("Giriş", "Giriş"),
        ("Çıkış", "Çıkış"),
    ]

    urun = models.ForeignKey(Urun, on_delete=models.CASCADE)
    islem_turu = models.CharField(max_length=10, choices=ISLEM_TURLERI)
    adet = models.PositiveIntegerField()
    aciklama = models.TextField(blank=True, null=True)
    plaka = models.CharField(max_length=20, blank=True, null=True)
    tarih = models.DateTimeField(auto_now_add=True)
    lokasyon = models.ForeignKey(Lokasyon, on_delete=models.SET_NULL, null=True, blank=True)
    personel = models.ForeignKey(Personel, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.urun.adi} - {self.islem_turu} - {self.adet}"

