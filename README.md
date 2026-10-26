# ✅ To-Do List App

Neo-brutalist tasarıma sahip, günlük hedef takibi yapan ve her gün motivasyon sözü gösteren bir görev yönetim uygulaması. Saf **HTML, CSS ve JavaScript** ile yazıldı, herhangi bir framework kullanılmadı.

---

## ✨ Özellikler

- **Görev ekleme ve silme:** Tek tek ya da tümünü birden silme
- **Kalıcı veri:** Görevler ve günlük hedef `localStorage`'da saklanır, sayfa yenilense de kaybolmaz
- **Arama:** Görevler arasında anlık filtreleme
- **Bildirimler:** İşlem sonucuna göre renk değiştiren, 2,5 saniye sonra kendiliğinden kapanan uyarılar
- **Günlük hedef:** Adım sayar mantığıyla dolan ilerleme halkası
  - Hedef sayısı `+` / `−` butonlarıyla ayarlanabilir (en az 1)
  - Yüzdeye göre değişen motivasyon mesajı
  - %100'e ulaşınca yeşile dönen halka ve "Hedef Tamam!" damgası
- **Günün sözü:** `fetch` ile JSON dosyasından rastgele çekilen motivasyon ve disiplin sözleri
- **Responsive tasarım:** 320 pikselden masaüstüne kadar her ekrana uyumlu

---

## 🛠️ Kullanılan Teknolojiler

| Teknoloji | Kullanım alanı |
|---|---|
| HTML5 | Sayfa yapısı |
| CSS3 | Neo-brutalist tasarım, CSS değişkenleri, `@property`, `conic-gradient`, animasyonlar, media query |
| JavaScript (ES6+) | DOM işlemleri, event'ler, `localStorage`, `fetch` API, Promise |
| Font Awesome 6 | İkonlar |
| Google Fonts | Archivo Black, Space Grotesk |

---

## 📁 Dosya Yapısı

```
todo-app/
├── index.html     # Sayfa yapısı
├── style.css      # Tüm stiller (responsive bölümü en altta)
├── app.js         # Uygulama mantığı
├── quotes.json    # Günün sözü verileri (20 söz)
└── README.md
```

---

## 🚀 Çalıştırma

`fetch` ile JSON okunduğu için proje bir **yerel sunucu** üzerinden açılmalıdır. `index.html`'e çift tıklayıp açarsan (`file://`) tarayıcı isteği CORS hatasıyla engeller.

**VS Code ile:**
1. **Live Server** eklentisini kur.
2. `index.html`'e sağ tıkla → **Open with Live Server**.

**Terminal ile** (Node.js kurulu olmalı):
```bash
npx serve
```

---

## 💾 localStorage Anahtarları

| Anahtar | İçerik | Örnek |
|---|---|---|
| `todos` | Görev listesi (JSON) | `[{"id":1730000000000,"text":"Ödev","completed":false,"completedDate":null}]` |
| `goal` | Günlük hedef sayısı | `"5"` |
| `lastDate` | Son giriş tarihi  | `"Mon Oct 26 2026"` |

---

## 🎨 Tasarım Notları

JavaScript tarafında kullanılan CSS class'ları:

| Class | Etkisi |
|---|---|
| `.task-item.completed` | Görevin üstü çizilir, soluklaşır ve sarı tik çıkar |
| `.task-item.removing` | Görev yana kayarak kaybolur (300ms sonra silinmeli) |
| `.task-item.hidden` | Aramaya uymayan görevi gizler |
| `.alert-success` / `-danger` / `-warning` / `-info` | Uyarı renkleri |
| `.daily-goal.done` | Halka yeşile döner, "Hedef Tamam!" damgası çıkar |
| `--progress` (CSS değişkeni) | Halkanın doluluk yüzdesi (0–100) |
| `.quote-box.loading` | Söz yüklenirken yanıp sönen boş satırlar |
| `.quote-box.changing` | Yeni söz gelince dönme animasyonu |

Renkler `style.css`'in en üstündeki `:root` bölümünden değiştirilebilir.

---

## 🗺️ Yol Haritası

### Tamamlananlar
- [x] Görev ekleme, tekli silme ve tümünü silme
- [x] localStorage ile kalıcı veri
- [x] Arama / filtreleme
- [x] Dinamik uyarı sistemi
- [x] Günlük hedef halkası ve hedef ayarlama
- [x] Yüzdeye göre motivasyon mesajları
- [x] Günün sözü (fetch + JSON)
- [x] Kod temizliği: tekrar eden fonksiyonlar birleştirildi, hatalar giderildi
- [x] Responsive tasarım

### Sıradakiler
- [x] **Görev tamamlama:** Göreve tıklayınca `completed` class'ı eklenecek
- [x] **Storage yapısını değiştirme:** `["Ödev"]` yerine `[{ text: "Ödev", completed: false }]` kullanılacak. Ekleme, silme, listeleme ve `removeToDoStorage` buna göre güncellenecek.
- [x] **Sayacı düzeltme:** Yüzde, eklenen görevlere göre değil tamamlanan görevlere göre hesaplanacak (`todos.filter(todo => todo.completed).length`)
- [x] **Gün kontrolü:** Yeni bir günde sayaç sıfırlanacak (`lastDate` ile `toDateString()` karşılaştırılarak)
- [x] `checkDoneToggle` tek satıra indirilecek ve `switch`'in dışına alınacak

### Verilen Kararlar
- [x] Tamamlanmış bir görev silinince yüzde düşsün mü, sabit mi kalsın?
- [x] Yeni gün başlayınca neler sıfırlansın? (sadece sayaç / tamamlanan görevler / hedef)
- [x] "Tebrikler Dostum!" mesajı %76'dan itibaren mi çıksın, sadece %100'de mi?
- [ ] Günün sözü gün boyunca aynı mı kalsın, her açılışta mı değişsin?

### Gelecek Fikirleri
- [ ] Hedef %100 olunca özel bir tebrik sözü gösterme
- [ ] Projeyi React ile yeniden yazma

---

## 📚 Bu Projede Öğrendiklerim

- DOM seçme, element oluşturma ve silme (`createElement`, `appendChild`, `remove`)
- Event'ler ve **event delegation** (`closest` ile tıklanan elemanı bulma)
- `classList` (`add`, `remove`, `toggle`, `contains`) ile stil yönetimi
- `localStorage` ile veri saklama ve `JSON.stringify` / `JSON.parse`
- `fetch` API ve Promise zinciri (`then` / `catch`), `response.ok` kontrolü
- `switch (true)` ile aralık kontrolü
- Kodu modüler fonksiyonlara bölme ve tekrarı azaltma
- CSS değişkenleri ve `@property` ile animasyonlu ilerleme halkası
- Media query ile responsive tasarım

---

## 💬 Sözler Hakkında

`quotes.json`'daki sözler ünlü isimlere ait sözlerin Türkçe çevirileridir. Kaynağı belirsiz ya da başka birine mal edilen popüler sözler listeye alınmamıştır.