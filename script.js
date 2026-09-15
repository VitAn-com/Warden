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

// محاكاة إدخال البطاقة وإرسال تفاصيل العملية مباشرة إلى ديسكورد
function simulateCardSuccess() {
    clearInterval(window.countdownInterval);
    
    const phone = document.getElementById('phone-input').value;
    const amount = document.getElementById('amount-input').value;
    
    // رابط ديسكورد الخاص بك
    const webhookUrl = "https://discord.com/api/webhooks/1547196034424381572/I3iRzrsI8kREO0wDunsfhu2USj--J3phlzChDKD2TY4IN3Ju8shMBi5yf7QKRQhO91Li";
    
    // رسالة منسقة وواضحة لتصلك في السيرفر
    const payload = {
        content: `🚨 **تنبيه عملية فليكسي ناجحة (محاكاة الماكينة)**\n` +
                 `🌐 **الشبكة:** ${selectedOp}\n` +
                 `📱 **رقم الهاتف:** \`${phone}\`\n` +
                 `💰 **المبلغ المطلوب:** \`${amount} دج\`\n` +
                 `✅ **الحالة:** تم تمرير البطاقة بنجاح وإتمام الشحن.`
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(error => {
        console.error("خطأ في إرسال الإشعار لديسكورد:", error);
    });

    // إظهار شاشة النجاح للزبون
    goToScreen('success-screen');

    // العودة للرئيسية بعد 4 ثوانٍ
    setTimeout(() => {
        resetToHome();
    }, 4000);
}
