from rest_framework import serializers
from .models import Urun, Kategori, StokHareketi, Lokasyon, Personel

class KategoriSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kategori
        fields = '__all__'

class UrunSerializer(serializers.ModelSerializer):
    kategori_adi = serializers.CharField(source="kategori.isim", read_only=True)

    class Meta:
        model = Urun
        fields = '__all__'

class StokHareketiSerializer(serializers.ModelSerializer):
    urun_adi = serializers.CharField(source="urun.adi", read_only=True)
    lokasyon_adi = serializers.CharField(source='lokasyon.isim', read_only=True)
    personel_adi = serializers.CharField(source='personel.isim', read_only=True)

    class Meta:
        model = StokHareketi
        fields = '__all__'

class LokasyonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lokasyon
        fields = '__all__'

class PersonelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personel
        fields = '__all__'
