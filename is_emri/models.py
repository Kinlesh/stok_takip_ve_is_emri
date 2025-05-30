# is_emri/models.py
from django.db import models
from urunler.models import Lokasyon, Personel

class YapilacakIs(models.Model):
    isim = models.CharField(max_length=255)

    def __str__(self):
        return self.isim

class IsTuru(models.Model):
    isim = models.CharField(max_length=255)

    def __str__(self):
        return self.isim

class IsEmri(models.Model):
    SONUC_SECENEKLERI = [
        ("olumlu", "Olumlu"),
        ("olumsuz", "Olumsuz"),
    ]

    lokasyon = models.ForeignKey(Lokasyon, on_delete=models.SET_NULL, null=True)
    ilce = models.CharField(max_length=255)
    yapilacak_isler = models.ManyToManyField(YapilacakIs)
    is_turleri = models.ManyToManyField(IsTuru)

    personel1 = models.ForeignKey(Personel, on_delete=models.SET_NULL, null=True, related_name='personel1')
    personel2 = models.ForeignKey(Personel, on_delete=models.SET_NULL, null=True, blank=True, related_name='personel2')
    personel3 = models.ForeignKey(Personel, on_delete=models.SET_NULL, null=True, blank=True, related_name='personel3')
    personel4 = models.ForeignKey(Personel, on_delete=models.SET_NULL, null=True, blank=True, related_name='personel4')

    aciklama = models.TextField(blank=True, null=True)
    sonuc = models.CharField(max_length=10, choices=SONUC_SECENEKLERI)
    baslangic_fotograf = models.ImageField(upload_to='is_emri/baslangic/', blank=True, null=True)
    bitis_fotograf = models.ImageField(upload_to='is_emri/bitis/', blank=True, null=True)

    def __str__(self):
        return f"İş Emri - {self.lokasyon} - {self.ilce}"
