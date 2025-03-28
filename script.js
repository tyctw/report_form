let captchaText = '';
let captchaAttempts = 0;
let hcaptchaToken = ''; // 存儲 hCaptcha 令牌

// 驗證電子郵件
function validateEmail(email) {
  return CONFIG.VALIDATION.EMAIL_REGEX.test(String(email).toLowerCase());
}

// 顯示錯誤訊息
function showError(inputElement, errorMessage) {
  const errorElement = document.getElementById(inputElement.id + 'Error');
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.style.display = 'block';
    inputElement.classList.add('invalid');
  }
}

// 隱藏錯誤訊息
function hideError(inputElement) {
  const errorElement = document.getElementById(inputElement.id + 'Error');
  if (errorElement) {
    errorElement.style.display = 'none';
    inputElement.classList.remove('invalid');
  }
}

// 產生報告代碼
function generateReportCode() {
  let result = '';
  for (let i = 0; i < CONFIG.REPORT_CODE.LENGTH; i++) {
    result += CONFIG.REPORT_CODE.CHARS.charAt(Math.floor(Math.random() * CONFIG.REPORT_CODE.CHARS.length));
  }
  return result;
}

// 顯示確認對話框
function showConfirmDialog(callback) {
  const confirmDialog = document.getElementById('confirmDialog');
  const confirmYes = document.getElementById('confirmYes');
  const confirmNo = document.getElementById('confirmNo');
  const dialogContent = document.querySelector('.confirm-dialog-content');

  confirmDialog.style.display = 'flex';
  setTimeout(() => {
    confirmDialog.classList.add('active');
    dialogContent.classList.add('active');
  }, 10);

  confirmYes.onclick = function() {
    dialogContent.classList.remove('active');
    setTimeout(() => {
      confirmDialog.classList.remove('active');
      setTimeout(() => {
        confirmDialog.style.display = 'none';
        callback();
      }, CONFIG.ANIMATION.DIALOG_ANIMATION);
    }, 100);
  };

  confirmNo.onclick = function() {
    dialogContent.classList.remove('active');
    setTimeout(() => {
      confirmDialog.classList.remove('active');
      setTimeout(() => {
        confirmDialog.style.display = 'none';
      }, CONFIG.ANIMATION.DIALOG_ANIMATION);
    }, 100);
  };

  confirmDialog.onclick = function(event) {
    if (event.target === confirmDialog) {
      dialogContent.classList.remove('active');
      setTimeout(() => {
        confirmDialog.classList.remove('active');
        setTimeout(() => {
          confirmDialog.style.display = 'none';
        }, CONFIG.ANIMATION.DIALOG_ANIMATION);
      }, 100);
    }
  };
  
  // Add hover effects for buttons
  const buttons = confirmDialog.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.classList.add('hover');
    });
    button.addEventListener('mouseleave', function() {
      this.classList.remove('hover');
    });
  });
}

// 顯示載入中狀態
function showLoading(isLoading) {
  const submitLoader = document.getElementById('submitLoader');
  const submitText = document.getElementById('submitText');
  const submitBtn = document.getElementById('submitBtn');
  
  if (isLoading) {
    submitLoader.style.display = 'block';
    submitText.textContent = '提交中...';
    submitBtn.disabled = true;
  } else {
    submitLoader.style.display = 'none';
    submitText.textContent = '提交回報';
    submitBtn.disabled = false;
  }
}

// 複製報告代碼到剪貼簿
function copyReportCode() {
  const reportCode = document.getElementById('reportCode').textContent;
  navigator.clipboard.writeText(reportCode)
    .then(() => {
      alert('已複製報告代碼: ' + reportCode);
    })
    .catch(err => {
      console.error('複製失敗:', err);
    });
}

// 切換選菜顯示
function toggleMenu() {
  const fullPageMenu = document.getElementById('fullPageMenu');
  const navItems = document.querySelectorAll('.nav-item');
  
  fullPageMenu.classList.toggle('active');
  document.body.style.overflow = fullPageMenu.classList.contains('active') ? 'hidden' : '';
  
  if (fullPageMenu.classList.contains('active')) {
    navItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, index * CONFIG.ANIMATION.MENU_ITEM_DELAY);
    });
  } else {
    navItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(20px)';
    });
  }
}

// 提交表單
function submitForm() {
  showLoading(true);
  
  const email = document.getElementById('email').value;
  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value;
  const reportCode = generateReportCode();

  const data = {
    email: email,
    category: category,
    description: description,
    reportCode: reportCode,
    timestamp: new Date().toISOString(),
    hcaptchaToken: hcaptchaToken // 添加 hCaptcha 令牌
  };

  fetch(CONFIG.API_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    if(data.result === 'success') {
      document.getElementById('reportCode').textContent = reportCode;
      document.getElementById('successMessage').style.display = 'block';
      document.getElementById('errorMessage').style.display = 'none';
      document.getElementById('reportForm').reset();
    } else {
      throw new Error('Submission failed');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    document.getElementById('errorMessage').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
  })
  .finally(() => {
    showLoading(false);
  });
}

// 驗證表單
function validateForm() {
  let isValid = true;

  const email = document.getElementById('email');
  const category = document.getElementById('category');
  const description = document.getElementById('description');

  // 驗證電子郵件
  if (!validateEmail(email.value)) {
    showError(email, '請輸入有效的電子郵件地址');
    isValid = false;
  } else {
    hideError(email);
  }

  // 驗證類別
  if (category.value === '') {
    showError(category, '請選擇異常類別');
    isValid = false;
  } else {
    hideError(category);
  }

  // 驗證描述
  if (description.value.trim().length < CONFIG.VALIDATION.MIN_DESCRIPTION_LENGTH) {
    showError(description, `問題描述至少需要${CONFIG.VALIDATION.MIN_DESCRIPTION_LENGTH}個字符`);
    isValid = false;
  } else {
    hideError(description);
  }

  // 驗證 hCaptcha
  if (CONFIG.HCAPTCHA.ENABLED && !hcaptchaToken) {
    document.getElementById('hcaptchaError').style.display = 'block';
    isValid = false;
  } else {
    document.getElementById('hcaptchaError').style.display = 'none';
  }

  return isValid;
}

// hCaptcha 回調函數
function onHcaptchaSuccess(token) {
  hcaptchaToken = token;
  document.getElementById('hcaptchaError').style.display = 'none';
}

function onHcaptchaExpire() {
  hcaptchaToken = '';
}

function onHcaptchaError() {
  hcaptchaToken = '';
  document.getElementById('hcaptchaError').style.display = 'block';
  document.getElementById('hcaptchaError').textContent = 'hCaptcha 驗證發生錯誤，請重試';
}

// 頁面載入後的初始化
document.addEventListener('DOMContentLoaded', function() {
  // 如果啟用了 hCaptcha，則顯示 hCaptcha 容器
  if (CONFIG.HCAPTCHA.ENABLED) {
    document.getElementById('hcaptchaContainer').style.display = 'block';
  }
  
  // 表單提交事件
  document.getElementById('reportForm').addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // 顯示確認對話框
    showConfirmDialog(submitForm);
  });

  // 報告代碼點擊複製
  document.getElementById('reportCode').addEventListener('click', copyReportCode);

  // 輸入欄位事件
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      const label = this.parentElement.querySelector('label');
      if (label) {
        label.style.color = '#4a90e2';
      }
    });
    input.addEventListener('blur', function() {
      const label = this.parentElement.querySelector('label');
      if (label) {
        label.style.color = '#333';
      }
    });
    input.addEventListener('input', function() {
      hideError(this);
    });
  });

  // 選菜事件
  document.getElementById('menuIcon').addEventListener('click', toggleMenu);
  document.getElementById('closeMenuButton').addEventListener('click', toggleMenu);

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('fullPageMenu').classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // 關閉視窗大小改變時的選菜
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && document.getElementById('fullPageMenu').classList.contains('active')) {
      document.getElementById('fullPageMenu').classList.remove('active');
      document.body.style.overflow = '';
      document.querySelectorAll('.nav-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(20px)';
      });
    }
  });

  // 容器動畫效果
  const container = document.querySelector('.container');
  container.addEventListener('mousemove', (e) => {
    const { offsetX, offsetY } = e;
    const { offsetWidth, offsetHeight } = container;
    const moveX = (offsetX / offsetWidth - 0.5) * 10;
    const moveY = (offsetY / offsetHeight - 0.5) * 10;
    container.style.transform = `translateY(-5px) translateX(${moveX}px) translateY(${moveY}px)`;
  });

  container.addEventListener('mouseleave', () => {
    container.style.transform = 'translateY(-5px)';
  });

  // 安全措施
  document.addEventListener('copy', function(e) {
    const reportCode = document.getElementById('reportCode');
    const selection = window.getSelection();
    
    // 只阻止非報告代碼的複製
    if (selection && !selection.containsNode(reportCode, true)) {
      e.preventDefault();
      return false;
    }
  });

  document.addEventListener('keyup', function(e) {
    if (e.key == 'PrintScreen') {
      navigator.clipboard.writeText('');
      alert('截圖功能已被禁用');
    }
  });

  document.addEventListener('contextmenu', function(e) {
    // 允許在報告代碼上右鍵
    if (e.target.id === 'reportCode') {
      return true;
    }
    e.preventDefault();
  });

  // 限制文字選擇
  document.addEventListener('selectstart', function(e) {
    // 允許在表單和報告代碼中選擇文字
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.id === 'reportCode') {
      return true;
    }
    e.preventDefault();
  });
  
  // 確認對話框動畫效果
  const confirmDialog = document.getElementById('confirmDialog');
  const dialogContent = document.querySelector('.confirm-dialog-content');
  
  confirmDialog.addEventListener('click', function(e) {
    if (e.target === confirmDialog) {
      dialogContent.classList.add('shake');
      setTimeout(() => {
        dialogContent.classList.remove('shake');
      }, 500);
    }
  });

  // 重置 hCaptcha (當表單重置時)
  document.getElementById('reportForm').addEventListener('reset', function() {
    if (CONFIG.HCAPTCHA.ENABLED && window.hcaptcha) {
      window.hcaptcha.reset();
      hcaptchaToken = '';
    }
  });
});