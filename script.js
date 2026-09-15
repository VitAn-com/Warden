let activeInputId = 'phone-input'; // الخانة الافتتاحية النشطة

// تحديد أي خانة يضغط عليها المستخدم حالياً
function setActiveInput(inputId) {
    activeInputId = inputId;
    document.getElementById('phone-input').classList.remove('active-field');
    document.getElementById('amount-input').classList.remove('active-field');
    document.getElementById(inputId).classList.add('active-field');
}

// إضافة الرقم للخانة النشطة
function appendNumber(num) {
    const inputField = document.getElementById(activeInputId);
    if (activeInputId === 'phone-input' && inputField.value.length >= 10) return; // منع تجاوز 10 أرقام للهاتف
    inputField.value += num;
    resetInactivityTimer();
}

// مسح حرف واحد (BackSpace)
function deleteLast() {
    const inputField = document.getElementById(activeInputId);
    inputField.value = inputField.value.slice(0, -1);
    resetInactivityTimer();
}

// مسح الخانة النشطة بالكامل
function clearInput() {
    document.getElementById(activeInputId).value = '';
    resetInactivityTimer();
}
