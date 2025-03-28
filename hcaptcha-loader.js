// 根據配置動態加載 hCaptcha
(function() {
  if (CONFIG.HCAPTCHA.ENABLED) {
    const script = document.createElement('script');
    script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    
    script.onload = function() {
      if (window.hcaptcha) {
        window.hcaptcha.render('hcaptcha', {
          sitekey: CONFIG.HCAPTCHA.SITE_KEY,
          callback: onHcaptchaSuccess,
          'expired-callback': onHcaptchaExpire,
          'error-callback': onHcaptchaError
        });
      }
    };
    
    document.head.appendChild(script);
  }
})();

