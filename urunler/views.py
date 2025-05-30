from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Urun, Kategori, StokHareketi, Lokasyon, Personel
from .serializers import UrunSerializer, KategoriSerializer, StokHareketiSerializer, LokasyonSerializer, PersonelSerializer

### 📌 KATEGORİ CRUD
@api_view(['GET', 'POST'])
def kategori_listesi_ve_ekle(request):
    if request.method == 'GET':
        kategoriler = Kategori.objects.all()
        serializer = KategoriSerializer(kategoriler, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = KategoriSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def kategori_detay(request, pk):
    kategori = get_object_or_404(Kategori, pk=pk)

    if request.method == 'GET':
        serializer = KategoriSerializer(kategori)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = KategoriSerializer(kategori, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        kategori.delete()
        return Response({"message": "Kategori silindi"}, status=status.HTTP_204_NO_CONTENT)

### 📌 ÜRÜN CRUD
@api_view(['GET', 'POST'])
def urun_listesi_ve_ekle(request):
    if request.method == 'GET':
        kategori_id = request.GET.get('kategori')
        sirala = request.GET.get('sirala')  # e.g. adi, -stok_miktari
        urunler = Urun.objects.filter(kategori_id=kategori_id) if kategori_id else Urun.objects.all()
        if sirala:
            urunler = urunler.order_by(sirala)
        serializer = UrunSerializer(urunler, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = UrunSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def urun_detay(request, pk):
    urun = get_object_or_404(Urun, pk=pk)

    if request.method == 'GET':
        serializer = UrunSerializer(urun)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UrunSerializer(urun, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        urun.delete()
        return Response({"message": "Ürün silindi"}, status=status.HTTP_204_NO_CONTENT)

### 📌 STOK HAREKETLERİ CRUD
@api_view(['GET', 'POST'])
def stok_hareketleri(request):
    """
    GET: Stok hareketlerini listele (opsiyonel sıralama).
    POST: Yeni stok hareketi ekle ve stok miktarını güncelle.
    """
    if request.method == 'GET':
        sirala = request.GET.get('sirala')  # ?sirala=-tarih veya ?sirala=adet gibi

        hareketler = StokHareketi.objects.all()

        if sirala in ['tarih', '-tarih', 'adet', '-adet', 'islem_turu', '-islem_turu']:
            hareketler = hareketler.order_by(sirala)
        else:
            hareketler = hareketler.order_by('-tarih')  # Default: tarihe göre azalan

        serializer = StokHareketiSerializer(hareketler, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        try:
            adet = int(request.data.get("adet", 0))
            urun_id = request.data.get("urun")
            islem_turu = request.data.get("islem_turu")

            if not urun_id or not islem_turu:
                return Response({"error": "Ürün ve işlem türü zorunludur."}, status=status.HTTP_400_BAD_REQUEST)

            urun = get_object_or_404(Urun, pk=urun_id)

            # Çıkış işlemi ise stok yeterliliğini kontrol et
            if islem_turu == "Çıkış" and adet > urun.stok_miktari:
                return Response(
                    {"error": f"Yetersiz stok. Mevcut: {urun.stok_miktari}, Azaltmak istenen: {adet}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer = StokHareketiSerializer(data=request.data)
            if serializer.is_valid():
                stok_hareketi = serializer.save()
                stok_hareketi.urun.guncelle_stok()  # Otomatik güncelleme
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except ValueError:
            return Response({"error": "Adet sayısı geçerli bir sayı olmalıdır."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def urun_stok_hareketleri(request, pk):
    urun = get_object_or_404(Urun, pk=pk)
    stok_hareketleri = StokHareketi.objects.filter(urun=urun).order_by('-tarih')
    serializer = StokHareketiSerializer(stok_hareketleri, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def kritik_urunler(request):
    kritikler = Urun.objects.filter(minimum_stok__gt=0)
    kritikler = [u for u in kritikler if u.stok_miktari < u.minimum_stok]
    serializer = UrunSerializer(kritikler, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
def lokasyon_listesi_ve_ekle(request):
    if request.method == 'GET':
        lokasyonlar = Lokasyon.objects.all()
        serializer = LokasyonSerializer(lokasyonlar, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = LokasyonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def personel_listesi_ve_ekle(request):
    if request.method == 'GET':
        personeller = Personel.objects.all()
        serializer = PersonelSerializer(personeller, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = PersonelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
