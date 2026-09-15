let inactivityTimer;

function goToScreen(screenId, operatorName = '') {
    // إخفاء كل الشاشات
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // إظهار الشاشة المطلوبة
    document.getElementById(screenId).classList.add('active');

    // إذا تم اختيار شبكة، نحدث العنوان
    if (operatorName) {
        document.getElementById('selected-operator').innerText = "تعبئة رصيد: " + operatorName;
    }

    // إعادة ضبط مؤقت الخمول الأمني مع كل حركة
    resetInactivityTimer();
}

function goToPaymentScreen() {
    const phone = document.getElementById('phone-input').value;
    const amount = document.getElementById('amount-input').value;

    // التحقق البسيط من المدخلات
    if (!phone || phone.length < 10) {
        alert("الرجاء إدخال رقم هاتف صحيح يتكون من 10 أرقام.");
        return;
    }
    if (!amount || amount <= 0) {
        alert("الرجاء إدخال مبلغ صحيح.");
        return;
    }

    goToScreen('payment-screen');
    startCountdown(180); // تشغيل المؤقت الأمني لمدة 3 دقائق
}

function resetToHome() {
    clearTimeout(inactivityTimer);
    clearInterval(window.countdownInterval);
    
    // مسح الحقول لأسباب أمنية
    document.getElementById('phone-input').value = '';
    document.getElementById('amount-input').value = '';
    
    goToScreen('home-screen');
}

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    clearInterval(window.countdownInterval);
    
    // مؤقت أمني: إذا ترك المستخدم الشاشة بدون تفاعل لمدة 3 دقائق (180000 ميلي ثانية) يعود للرئيسية
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

// دالة محاكاة تمرير البطاقة وإرسال البيانات للديسكورد وعرض شاشة النجاح
function simulateCardSuccess() {
    clearInterval(window.countdownInterval);
    
    // جلب البيانات المدخلة
    const phone = document.getElementById('phone-input').value;
    const amount = document.getElementById('amount-input').value;
    
    // الـ Webhook الخاص بك
    const webhookUrl = "https://discord.com/api/webhooks/1547196034424381572/I3iRzrsI8kREO0wDunsfhu2USj--J3phlzChDKD2TY4IN3Ju8shMBi5yf7QKRQhO91Li";
    
    // تجهيز رسالة التنبيه
    const payload = {
        content: `🚨 **تنبيه عملية فليكسي ناجحة (محاكاة)**\n📱 **رقم الهاتف:** ${phone}\n💰 **المبلغ:** ${amount} دج\n✅ **الحالة:** تمت العملية بنجاح وتم إرسال الإشعار.`
    };

    // إرسال البيانات للديسكورد في الخلفية
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).catch(error => {
        console.error("خطأ في إرسال الإشعار:", error);
    });

    // إظهار شاشة النجاح للمستخدم
    goToScreen('success-screen');

    // بعد 4 ثوانٍ من ظهور شاشة النجاح، يعود النظام تلقائياً للرئيسية لخدمة الزبون التالي
    setTimeout(() => {
        resetToHome();
    }, 4000);
}