# CloudPhone Mini Games

CloudPhone Mini Games, eski model telefonların 120×160 piksel ekranlarını andıran bir canvas üzerinde çalışan küçük tarayıcı oyunları koleksiyonudur. Arayüz, oyunlar arasında dolaşmak için bir menü sunar ve hiçbir ek kütüphane gerektirmez.

## Oyunlar
- **Snake** – 15×20 karelik alanda ilerleyen klasik yılan.
- **Pong** – Raketi sağa sola hareket ettirip topu sektirin.
- **Breakout** – Tüm tuğlaları kırmak için topu kullanın.
- **Flappy** – Borular arasından uçarak ilerleyin.
- **Dodge** – Yukarıdan düşen engellerden kaçın.

## Kontroller
### Menü
- ↑/↓: Seçim değiştirme
- Enter: Seçilen oyunu başlatma
- Esc veya 0: Menüye dönme
- 1–5: İlgili oyunu hızlıca başlatma

### Oyun İçinde
- Ok tuşları: Çoğu oyunda hareket
- `Flappy` için ↑ veya boşluk: Kanat çırpma

## Başlangıç
Projeyi çalıştırmak için modern bir tarayıcı yeterlidir. Dosyaları klonladıktan sonra `index.html` dosyasını açın veya basit bir HTTP sunucusu ile yayınlayın:

```bash
# Python
python3 -m http.server

# ya da Node.js ile
npx serve .
```
Ardından tarayıcınızdan `http://localhost:8000` (veya kullanılan porta) gidin.

## Yapı
- `index.html`: Canvas ve temel sayfa yapısı.
- `main.js`: Menü, klavye kontrolü ve oyun yükleme mantığı.
- `games/`: Her oyunun `start`, `stop` ve `handleKey` fonksiyonlarını döndüren modülleri.
- `style.css`: Piksel mükemmel görünüm ve küçük ekran uyumu için stiller.

## Yeni Oyun Eklemek
1. `games/` klasöründe yeni bir dosya oluşturun ve bir oyun fabrikası döndürün:
   ```js
   export default function createYeniOyun(ctx, W, H, onExit) { /* ... */ }
   ```
2. `main.js` dosyasında bu modülü içe aktarın ve `games` dizisine ekleyin.

## Lisans
Bu depo için şu anda belirlenmiş bir lisans bulunmamaktadır.
