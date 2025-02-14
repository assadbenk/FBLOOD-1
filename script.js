// تهيئة Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBMBGaGDrVO7iTl21IQK2sLovYniqi3EuM",
    authDomain: "fblood-app.firebaseapp.com",
    projectId: "fblood-app",
    storageBucket: "fblood-app.appspot.com",
    messagingSenderId: "521581045159",
    appId: "1:521581045159:web:8e3e54085f23cc4b584282",
    measurementId: "G-X6XLEVE2JG"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// بيانات الولايات والمدن لكل دولة
const data = {
    dz: {
        "أدرار": ["أدرار", "تيميمون", "رقان", "زاوية كنتة"],
        "الشلف": ["الشلف", "وادي الفضة", "تنيرة", "بوقادير"],
        // ... (بقية البيانات)
    },
    eg: {
        "القاهرة": ["مدينة نصر", "المعادي", "الزمالك"],
        "الإسكندرية": ["وسط البلد", "سموحة", "العجمي"],
        // ... (بقية البيانات)
    },
    ma: {
        "الرباط": ["أكدال", "حسان", "يعقوب المنصور"],
        "الدار البيضاء": ["المعاريف", "أنفا", "عين السبع"],
        // ... (بقية البيانات)
    },
    sa: {
        "الرياض": ["العليا", "الملز", "النسيم"],
        "جدة": ["التحلية", "الحمراء", "النهضة"],
        // ... (بقية البيانات)
    }
};

function loadStates() {
    let country = document.getElementById("country").value;
    let stateSelect = document.getElementById("state");
    let citySelect = document.getElementById("city");

    stateSelect.innerHTML = '<option value="">اختر الولاية</option>';
    citySelect.innerHTML = '<option value="">اختر المدينة</option>';
    stateSelect.disabled = true;
    citySelect.disabled = true;

    if (data[country]) {
        stateSelect.disabled = false;
        for (let state in data[country]) {
            let option = document.createElement("option");
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
        }
    }
}

function loadCities() {
    let country = document.getElementById("country").value;
    let state = document.getElementById("state").value;
    let citySelect = document.getElementById("city");

    citySelect.innerHTML = '<option value="">اختر المدينة</option>';
    citySelect.disabled = true;

    if (data[country] && data[country][state]) {
        citySelect.disabled = false;
        data[country][state].forEach(city => {
            let option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}

function registerDonor() {
    let donorName = document.getElementById("donor-name").value;
    let bloodType = document.getElementById("donor-blood-type").value;
    let country = document.getElementById("country").value;
    let state = document.getElementById("state").value;
    let city = document.getElementById("city").value;
    let contact = document.getElementById("donor-contact").value;

    if (!donorName || !bloodType || !country || !state || !city || !contact) {
        alert("⚠️ الرجاء ملء جميع الحقول!");
        return;
    }

    // إنشاء كائن المتبرع
    let donor = {
        name: donorName,
        bloodType: bloodType,
        country: country,
        state: state,
        city: city,
        contact: contact
    };

    // إرسال البيانات إلى Firebase
    database.ref('donors').push(donor)
        .then(() => {
            alert("✅ تم تسجيل المتبرع بنجاح!");
        })
        .catch((error) => {
            alert("❌ حدث خطأ أثناء التسجيل: " + error.message);
        });
}

function searchDonors() {
    let searchBloodType = document.getElementById("blood-type").value;
    let searchCity = document.getElementById("city-search").value.trim();

    // قراءة البيانات من Firebase
    database.ref('donors').once('value', (snapshot) => {
        let donors = [];
        snapshot.forEach((childSnapshot) => {
            let donor = childSnapshot.val();
            donors.push(donor);
        });

        // تصفية المتبرعين
        let matchingDonors = donors.filter(donor => 
            donor.bloodType === searchBloodType && donor.city.includes(searchCity)
        );

        let resultsDiv = document.getElementById("results");
        resultsDiv.style.display = 'block';

        if (matchingDonors.length > 0) {
            resultsDiv.innerHTML = "<h3>🔎 النتائج:</h3>";
            matchingDonors.forEach(donor => {
                resultsDiv.innerHTML += `
                    <p>🩸 <strong>${donor.name}</strong> - ${donor.city}, ${donor.state}, ${donor.country}</p>
                    <p>📞 ${donor.contact}</p>
                `;
            });
        } else {
            resultsDiv.innerHTML = "<p>❌ لا يوجد متبرعين متطابقين!</p>";
        }
    });
}

function switchLanguage() {
    alert("🚀 ميزة تغيير اللغة قيد التطوير!");
}