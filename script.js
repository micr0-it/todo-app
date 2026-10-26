//Elementleri Seçmek
const form = document.querySelector("#addTaskForm");

const addInput = document.querySelector("#txtTaskName");
const taskList = document.querySelector("#task-list");
const clearButton = document.querySelector("#btnDeleteAll");
const alertContainer = document.querySelector("#alertContainer"); //alerContainer yazım hatasını düzelttik
const taskContainer = document.querySelector(".task-container"); //removeToDo yerine taskContainer dedik, silme işlemi değil elemanın kendisi
const filterInput = document.querySelector("#txtSearch");
const addGoalCount = document.querySelector("#btnGoalPlus");
const removeGoalCount = document.querySelector("#btnGoalMinus");
const goalPercent = document.querySelector("#goalPercent");
const dailyGoal = document.querySelector("#dailyGoal");

//Hedef sayaç spanları -- birçok fonksiyonda tekrar tekrar seçiyorduk, bir kere burada seçtik
const spanGoalDone = document.querySelector("#goalDone");
const spanGoalValue = document.querySelector("#goalValue");
const spanGoalTotal = document.querySelector("#goalTotal");
const spanGoalMessage = document.querySelector("#goalMessage");

//Motivasyon Sözleri için API Adresi ve Buton
const api = "quotes.json";
const quoteBtn = document.querySelector("#btnNewQuote");
console.log(quoteBtn);



let goalValue = 1; //günlük hedef SAYISI (en az 1 olmalı yoksa 0'a bölme hatası alırız)
let todos = []; //bunu neden global olarak tanımladık şimdi iki ayrı fonksiyon da kullandım
//biri sürekli kontrol etmektense modüler bir yapıda giderek bir kontrol metodunda
//bir de ana ekleme metodum da lazım bana
//bu yüzden let olarak tanımladık globalde

runEvents();
function runEvents() {
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded",showToDosUI); //sayfa yüklendiğinde (domloaded) benim showToDosUI metodumu calıstır)
    taskContainer.addEventListener("click", removeToDoUI);
    taskContainer.addEventListener("click", completeToDoUI)
    addGoalCount.addEventListener("click", function(){ changeGoalCounter(1); }); //artı butonu +1 gönderiyor
    removeGoalCount.addEventListener("click", function(){ changeGoalCounter(-1); }); //eksi butonu -1 gönderiyor
    clearButton.addEventListener("click", removeToDoALL);
    quoteBtn.addEventListener("click", function(){ apiGetQuotes(api)});
    filterInput.addEventListener("input",filterToDo); //keyup yerine input: yazma, silme, mouse ile yapıştırma hepsinde calısır
    
}

//Metodlarda e parametresine ıhtıyacın varsa yaz
//Mesela tümünü silmede ihtiyacım yoktu fakat
//Tekli silmelerde direk o butona basıldı mı i tagına basıldımı ya bakmam ıcın lazımdı
//filtreleme de lazım cunku inputa basıldı mı girilidimi yazıldı mı falan için


function filterToDo(e) {
    const filterValue = e.target.value.toLowerCase().trim(); //verilen değerleri liste ile karsılastırmak ıcın ve boslukları ezmek ıcın hepsini kucuk harfe cevır ve boslukları sil
    const toDoList = document.querySelectorAll(".task-item");
    if (toDoList.length>0) {
        toDoList.forEach(function(todo){
            if (todo.textContent.toLowerCase().trim().includes(filterValue)) {
                todo.classList.remove("hidden");
            } else {
                todo.classList.add("hidden");
            }
        });
    }else if (alertContainer.children.length === 0) {
        //ekranda zaten uyarı varsa yenisini basma, yoksa her harfte yeni uyarı çıkıyordu
        showAlert("danger","Filtreleme işlemi için en az 1 adet görev ekleyin...");
    }
}   



function removeToDoALL() {
    const toDoList = document.querySelectorAll(".task-item");
    if (toDoList.length>0) {

        //Arayüzden silme -- tek tek forEach ile dönmek yerine listenin içini direk boşalttık
        taskList.innerHTML = "";
        
        //Storageden Silme İşlemi
        todos = [];
        localStorage.setItem("todos",JSON.stringify(todos));//Direk boş dizi verdik sildik

        //Hedef sayacını da sıfırla, eskiden sayfayı yenileyene kadar eski sayı kalıyordu
        updateGoalDone();
    }
    else{
        showAlert("danger","Silme işlemi için en az 1 adet görev ekleyin...");
    }
}





function completeToDoUI(e) {   
    const deleteButton = e.target.closest(".delete-item");
    if (deleteButton)
        {
            return;
        }
    const toDoLitag = e.target.closest(".task-item");
    if(!toDoLitag){
        return;
    }
    toDoLitag.classList.toggle("completed");
    const isCompleted = toDoLitag.classList.contains("completed"); // tamamlandıysa bize true dönecek
    updateToDoCompleteStorage(Number(toDoLitag.dataset.id), isCompleted); // storage de tamamlandı olarak güncellenecek
}



function updateGoalDone() {
    const doneCount = getDoneCount();   //eskiden: checkToDosFromStorage() + todos.length
    spanGoalDone.textContent = doneCount;
    changeGoalCircle(doneCount, goalValue);
}

function removeToDoUI(e) {
    //eskiden className==="fa-solid fa-xmark" ile bakıyorduk, sadece ikona tam basınca calısıyordu
    //closest ile i'ye de basılsa a'ya da basılsa silme butonunu (a) buluyoruz
    const deleteButton = e.target.closest(".delete-item");
    if (deleteButton) {
        e.preventDefault(); //href="#" sayfayı en üste zıplatmasın
        
        const todoLiTag = deleteButton.parentElement; //a'nın parenti direk li
        todoLiTag.remove(); //li ye eriştik ve sildi
        
        //Burada Storage'den sileceğiz bize value değer lazım bunu da todoLiTag'teki text contenti alarak yapalım
        removeToDoStorage(Number(todoLiTag.dataset.id));
        /**
         * Number neden şart? Storage’daki id bir sayı (1730000000000). 
         * dataset ise her zaman yazı döner ("1730000000000"). 
         * Bir sonraki adımda === ile karşılaştıracağız. 
         * === hem değere hem türe baktığı için 1730000000000 === "1730000000000" sonucu false olur ve görev hiç bulunamaz.
         */
        showAlert("success","Görev Başarıyla Silindi...");
    }
}


function removeToDoStorage(removeToDoId) {
    checkToDosFromStorage();//storage ıle ısleem yapacaksak sureklı guncel degerı alıyoruz bu da bize let todos=[] atyıor ve uzerıdne  ıslem yapıyoruz
    
    //eskiden forEach ile dönüp splice yapıyorduk:
    //aynı isimde iki görev varsa ikisi de siliniyordu, bir de forEach içinde splice dizi kaydığı için eleman atlatıyordu
    //indexOf sadece İLK eşleşenin indexini verir, bulamazsa -1 döner
    const index = todos.findIndex(function (todo) {
        return todo.id === removeToDoId;
    });
    if (index !== -1) {
        todos.splice(index,1) //burada splice bize nerden baslayacagını ve nereye kadar sılecegını sordu bız kendi indexini verip 1 yazarsak direk kendini silecek
    }
    //silme işlemi tamamlandı yeni arrayi storage'a atamak ıcın json'a çevirip verdik
    localStorage.setItem("todos",JSON.stringify(todos));
    updateGoalDone();
}

function showGoalCountsUI() {
    checkGoalCounterFromStorage(); //storage'daki hedefi globaldeki goalValue'ya attı
    spanGoalTotal.textContent = goalValue;
    spanGoalValue.textContent = goalValue;

    updateGoalDone(); //tamamlanan sayısını yazdı ve halkayı güncelledi
}

function showToDosUI() {
    
    checkToday(); //günlük söz veya sayaç sıfırlama gibi şeyler için lazım
    checkToDosFromStorage(); //Bunu çağırdık global scopeta olan todosumuza bu fonksiyon kaydedilen todosları array olarak atadı
    todos.forEach(function(todo) {
        addTodoUIPage(todo); //todolarımızıa ui ekledik modüler bir metot sayesinde
    });      
    showGoalCountsUI(); //todos zaten global oldugu ıcın parametre olarak göndermeye gerek yok
}

function addTodo(e) {
    e.preventDefault(); //Submit farklı bir sayfaya yönlendirmesin diye yaptık. En başa aldık, aşağıda hata olsa bile sayfa yenilenmesin
    const inputText = addInput.value.trim();
    if (inputText === "") { //trim her zaman string döner, null kontrolüne gerek yok
        showAlert("danger","Görev giriniz...");
    }
    else{
        const newTodo = { id: Date.now(), text: inputText, completed: false, completedDate: null };
        //Arayüz eklenmesi
        addTodoUIPage(newTodo);
        //Storage ekleme
        addToDoStorage(newTodo);
        //Bilgilendirme -- iki parametre alacak , içindeki mesaj ve alertin rengi için type
        showAlert("success","Görev başarıyla eklendi!");
        updateGoalDone();
    }
}


//plusToGoalCounterUI ve minusToGoalCounterUI neredeyse aynıydı, tek fark +1 ve -1
//tek fonksiyonda topladık: artı butonu 1, eksi butonu -1 gönderiyor (runEvents'e bak)
function changeGoalCounter(amount){
    const newGoal = goalValue + amount;

    //hedef 1'in altına inmesin, 0 olursa bölme işleminde Infinity / NaN çıkıyordu
    if (newGoal < 1) {
        showAlert("danger","Günlük hedef en az 1 olmalı...");
        return; //aşağıya devam etmesin
    }

    goalValue = newGoal;
    spanGoalValue.textContent = goalValue;
    spanGoalTotal.textContent = goalValue;
    saveGoalToStorage();
    updateGoalDone(); //yeni hedefe göre halkayı güncelle
}


//plusToGoalCounterStorage ve minusToGoalCounterStorage birebir aynıydı, tek fonksiyon yaptık
function saveGoalToStorage(){
    localStorage.setItem("goal", goalValue); //hedef sayısını storage'a kaydettik
}


//addGoalCounter ve removeGoalCounter birebir aynıydı, tek fonksiyon yaptık
//NOT: şu an EKLENEN görev sayısını sayıyor, tamamlama özelliği gelince burayı değiştir ** değiştirildi


function addToDoStorage(newTodo) {
    
    checkToDosFromStorage();   
    // let objTodo = {
    //     id : Date.now(),
    //     completed: false,
    //     completedDate : null
    // }
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos)); //Burada da array olarak alınan todosa klavyeye ekleyerek alınan değeri jsona çevirerek ekledik
    updateGoalDone();
}



function updateToDoCompleteStorage(todoID, isCompleted){
    
    // checkToDosFromStorage();
    const foundToDo = todos.find((todo) => todo.id === todoID);
    
    //1) DEĞİŞTİRMEDEN ÖNCE: bu görev bugün mü tamamlanmıştı?
    const today = new Date().toDateString();
    const wasCompletedToday = foundToDo.completedDate === today;
    
    
    //2) görevin durumunu ve tarihini güncelle
    if(isCompleted){
        foundToDo.completedDate = today;
    }
    else {
        foundToDo.completedDate = null; //geri alındıysa tarihi sil
    }
    
    foundToDo.completed = isCompleted;
    const count = Math.max(0, getDoneCount() - 1);
    
    
    if (isCompleted) {
        saveDoneCount(getDoneCount() + 1);
    } else if (wasCompletedToday) {
        saveDoneCount(Math.max(0, getDoneCount() - 1)); //bugün tamamlanmış görev geri alındı -> -1
    }

    localStorage.setItem("todos", JSON.stringify(todos));
    updateGoalDone();
}

function getDoneCount(){   
    //storage'da yoksa null gelir, Number(null) = 0 olur
    //bozuk bir değer gelirse NaN olur, || 0 ile onu da 0 yaptık
    return Number(localStorage.getItem("doneCount")) || 0;
}
function saveDoneCount(count) {
    localStorage.setItem("doneCount", count);
}


function checkToDosFromStorage() {
    //Storage dolu duruyor olabilir
    //hiç yoksa 0 dan array setleyip newTodoya koymalıyız
    //varsa var olanı al uzerın koyup ver diyeceğiz

    //Burada soruyor ki localStorage de todos keyine sahip bir şey var mı?
    if (localStorage.getItem("todos")===null) {
        todos = []; //Yoksa boş başlat
    }
    try {
        todos = JSON.parse(localStorage.getItem("todos")); //araya çevrilmiş şekilde todosumu aldım
    } catch (err) {
        todos = []; //storage'daki veri JSON değilse (bozuksa) uygulama çökmesin, boş başlat
    }
    //gelen şey dizi değilse (tek obje vb.) boş diziyle başla
    if (!Array.isArray(todos)) {
        todos = [];
    }

    //eski formatta yazı olarak kaydedilmiş görevleri ("Ödev") yeni obje formatına çevir
    todos = todos.map(function (todo, index) {
        if (typeof todo === "string") {
            return { id: Date.now() + index, text: todo, completed: false, completedDate: null };
        }
        return todo; //zaten objeyse olduğu gibi bırak
    });
}
function checkGoalCounterFromStorage(){
    //getItem ya string ("5") ya da null döner, hiçbir zaman 0 sayısını dönmez
    //o yüzden eskiden === 0 kontrolü hiç calısmıyordu ve null geliyordu
    if (localStorage.getItem("goal")===null) {
        goalValue = 1; //hiç hedef kaydedilmemişse 1 ile başlat
    } else {
        goalValue = Number(localStorage.getItem("goal")); //storage string döndürdüğü için sayıya çevirdik
    }

    //eski kodda hedef 0'ın altına inebildiği için storage'da "0", "-2" ya da "NaN" kalmış olabilir
    if (isNaN(goalValue) || goalValue < 1) {
        goalValue = 1;
    }
}



function checkNewDay() {
    
}


function showAlert(type, message){
    
    // <div class="alert alert-succes"> 
    //                 <span class="alert-text">Görev başarıyla eklendi!</span>
    //                 <button type="button" class="alert-close"><i class="fa-solid fa-xmark"></i></button>
    //             </div>
    const div = document.createElement("div");
    div.className="alert alert-" + type;
    // div.className=`alert alert-${type}`; //literal template kullanımı
    const span = document.createElement("span");
    span.className="alert-text";
    span.textContent = message;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "alert-close";
    const i = document.createElement("i");
    i.className = "fa-solid fa-xmark";
    button.appendChild(i);
    div.appendChild(span);
    div.appendChild(button);
    alertContainer.appendChild(div);

    //kapatma butonuna basılınca uyarıyı beklemeden kaldır
    button.addEventListener("click", function () {
        div.remove();
    });
    

    setTimeout(function () {
        div.remove();
    }, 2500); //bu sayede uyarı 2,5 saniye sonra gidecek -- olusturdugumuz div gidecek
}



function changeGoalCircle(finishedGoal, waitingGoal){
    // <!-- Adım sayar halkası -->
    // <div class="goal-ring">
    //     <div class="goal-ring-inner">
    //         <span class="goal-percent" id="goalPercent">60%</span>
    //         <span class="goal-label">Tamam</span>
    //     </div>
    // </div>

    //artık iki parametre de sayı olarak geliyor, parseInt'e gerek kalmadı
    let yuzde = Math.min(100, Math.round(finishedGoal / waitingGoal * 100))
    goalPercent.textContent = yuzde + "%"; //yüzde işaretini ekledik
    dailyGoal.style.setProperty("--progress", yuzde);
    checkDoneToggle(yuzde)
    switch (true) {
        case (yuzde < 25):
            spanGoalMessage.textContent = "Sen bu değilsin!";
            break;
        case (yuzde < 50):
            //buraya geldiyse zaten 25 ve üstü, alt sınırı tekrar yazmaya gerek yok
            spanGoalMessage.textContent = "Hadi ama yapabilirsin!";
            break;
        case (yuzde <= 75):
            spanGoalMessage.textContent = "Az kaldı, devam et!";
            break;
        case (yuzde <= 100):
            spanGoalMessage.textContent = "Tebrikler Dostum!";
            break;
        default:
            console.log("hata"); //yüzde 0-100 dışında bir şey geldiyse
            break;
    }
}

function checkDoneToggle(yuzde){
    //2. parametre true ise "done" ekler, false ise kaldırır. Zaten varsa ya da yoksa da kendisi halleder
    dailyGoal.classList.toggle("done", yuzde >= 100);
}

function apiGetQuotes(api){
    fetch(`${api}/`).then(response => {
    console.log("1) Response geldi, status:", response.status);
    return response.json();   
    })
    .then( quotes =>{
        const randomQuoteIndex = Math.floor(Math.random() * quotes.length);
        randomQuote = quotes[randomQuoteIndex];

        
        document.querySelector("#quoteText").textContent = randomQuote.quote;
        document.querySelector("#quoteAuthor").textContent = randomQuote.author;
        
        
    })

    .catch(function (err) {
        //dosya bulunamazsa, json bozuksa ya da Live Server açık değilse buraya düşer
        console.error("Söz yüklenemedi:", err);
        document.querySelector("#quoteText").textContent = "Söz yüklenemedi...";    
});
}

function checkToday() {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem("lastDate");
    if (lastDate !== today) {
        localStorage.setItem("lastDate", today);
        saveDoneCount(0);
    }
}


function addTodoUIPage(newTodo) {
    // <li class="task-item">
    //     <span>Örnek Görev</span>
    //     <a href="#" class="delete-item">
    //         <i class="fa-solid fa-xmark"></i>
    //     </a>
    // </li> 
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = newTodo.id;
    if(newTodo.completed) li.classList.add("completed");
    const span = document.createElement("span");
    span.textContent = newTodo.text;
    const a = document.createElement("a");
    a.className = "delete-item";
    a.href = "#";
    const i = document.createElement("i");
    i.className = "fa-solid fa-xmark";
    a.appendChild(i);
    li.appendChild(span);
    li.appendChild(a);

    taskList.appendChild(li); // listemize en son li objemizi ekledik zaten yukarıdan almıstık
    addInput.value=""; //ekleme işlemi yaptıktan sonra inputun içini boşalttık
}