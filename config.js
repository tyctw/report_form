// 設定檔案，用於儲存使用者可能想要修改的值
const CONFIG = {
  // API 端點
  API_ENDPOINT: 'https://script.google.com/macros/s/AKfycbxQcTd_LzijWQokSEEgy9QQB6v70ftcJt00GNDJeWQ2FPGgNnY-pr1Cs--QZyBpI8OJnQ/exec',
  
  // hCaptcha設定
  HCAPTCHA: {
    SITE_KEY: 'ceced506-fc3a-4214-976e-9514bf1eea48', // 替換為您的 hCaptcha site key
    ENABLED: true
  },
  
  // 報告代碼設定
  REPORT_CODE: {
    LENGTH: 8,
    CHARS: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  },
  
  // 表單驗證
  VALIDATION: {
    MIN_DESCRIPTION_LENGTH: 10,
    EMAIL_REGEX: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  
  // 頁面動畫速度 (毫秒)
  ANIMATION: {
    MENU_ITEM_DELAY: 100,
    FORM_TRANSITION: 300,
    DIALOG_ANIMATION: 400
  }
};