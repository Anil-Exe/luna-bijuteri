# Luna Bijuteri

**Ürün kataloğu ve alışveriş sepeti deneyimi**

| Alan | Ayrıntı |
| --- | --- |
| Proje türü | Statik mağaza arayüzü demosu |
| Teknolojiler | HTML · CSS · JavaScript |
| Geliştirici | Anıl Polat |

---

HTML, CSS ve JavaScript ile hazırlanmış ürün kataloğu ve alışveriş sepeti arayüzü.

## Özellikler

- Kolye, bileklik, küpe ve yüzük kategorileri
- Ürün detay sayfaları
- localStorage ile tarayıcıda saklanan sepet
- Statik ürün görselleri ve ortak stil dosyası

## Çalıştırma

Proje dizininde yerel bir statik sunucu açın:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Ardından `http://127.0.0.1:8000` adresini açın.

Bu proje bir mağaza arayüzü demosudur. Gerçek ödeme, sipariş işleme veya sunucu tarafı müşteri/veritabanı sistemi içermez. Kart veya müşteri bilgisi toplamak için kullanılmamalıdır.

Sepet sayfasındaki marka adı diğer sayfalarla tutarlı hâle getirildi. Görsellerin dosya metaverileri paylaşım kopyasından temizlendi. Tarayıcıda uçtan uca etkileşim testi bu incelemede yapılmadı.
