let inactivityTimer;
let selectedOp = '';

function goToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    resetInactivityTimer();
}

function selectOperator(opName) {
    selectedOp = opName;
    document.getElementById('phone-title').innerText = `تعبئة رصيد: ${opName}`;
    document.getElementById('phone-input').value = '';
    goToScreen('phone-screen');
}

// إضافة الأرقام للخانة النشطة حالياً
function appendNum(num) {
    let activeInput;
    if (document.getElementById('phone-screen').classList.contains('active')) {
        activeInput = document.getElementById('phone-input');
        if (activeInput.value.length >= 10) return; // منع تجاوز 10 أرقام
    } else if (document.getElementById('amount-screen').classList.contains('active')) {
        activeInput = document.getElementById('amount-input');
        if (activeInput.value.length >= 6) return; // حد أقصى للمبلغ
    }
    
    if (activeInput) {
        activeInput.value += num;
        resetInactivityTimer();
    }
}

// مسح حرف واحد (BackSpace)
function deleteChar(inputId) {
    const input = document.getElementById(inputId);
    input.value = input.value.slice(0, -1);
    resetInactivityTimer();
}

// مسح الحقل بالكامل
function clearField(inputId) {
    document.getElementById(inputId).value = '';
    resetInactivityTimer();
}

// الانتقال من شاشة الهاتف إلى شاشة المبلغ بعد التحقق
function nextToAmount() {
    const phone = document.getElementById('phone-input').value;
    if (phone.length < 10) {
        alert("الرجاء إدخال رقم هاتف صحيح يتكون من 10 أرقام.");
        return;
    }
    document.getElementById('amount-input').value = '';
    goToScreen('amount-screen');
}

// الانتقال لشاشة الدفع بعد إدخال المبلغ
function nextToPayment() {
    const amount = document.getElementById('amount-input').value;
    if (!amount || Number(amount) <= 0) {
        alert("الرجاء إدخال مبلغ صحيح.");
        return;
    }
    goToScreen('payment-screen');
    startCountdown(180);
}

function resetToHome() {
    clearTimeout(inactivityTimer);
    clearInterval(window.countdownInterval);
    document.getElementById('phone-input').value = '';
    document.getElementById('amount-input').value = '';
    goToScreen('home-screen');
}

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    clearInterval(window.countdownInterval);
    
    // مؤقت أمني 3 دقائق
    inactivityTimer = setTimeout(() => {
        alert("انتهت مهلة الجلسة لأسباب أمنية.");
        resetToHome();
    }, 180000); 
}

function startCountdown(seconds) {
    let timeLeft = seconds;
    const timerDisplay = document.getElementById('countdown');
    timerDisplay.innerText = timeLeft;

    window.countdownInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(window.countdownInterval);
            resetToHome();
        }
    }, 1000);
}

// محاكاة إدخال البطاقة وإرسال الديسكورد
function simulateCardSuccess() {
    clearInterval(window.countdownInterval);
    
    const phone = document.getElementById('phone-input').value;
    const amount = document.getElementById('amount-input').value;
    const webhookUrl = "https://discord.com/api/webhooks/1548058991932735519/SVFQjWiLGhN24W238yzbkm1Mh0WpGYZgCuen9P-cIkoHdTvq70ZvgpR8UkBGQtN1vKFh";
    
    const payload = {
        content: `🚨 **تنبيه عملية فليكسي ناجحة (محاكاة)**\n🌐 **الشبكة:** ${selectedOp}\n📱 **رقم الهاتف:** ${phone}\n💰 **المبلغ:** ${amount} دج\n✅ **الحالة:** تمت العملية بنجاح.`
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(error => {
        console.error("خطأ في الإرسال:", error);
    });

    goToScreen('success-screen');

    setTimeout(() => {
        resetToHome();
    }, 4000);
}
