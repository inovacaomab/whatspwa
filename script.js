document.addEventListener('DOMContentLoaded', function () {
    var phoneNumberInput = document.querySelector('#phoneNumber');
    var iti = window.intlTelInput(phoneNumberInput, {
        initialCountry: "br",
        preferredCountries: ['br', 'us'],
        separateDialCode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
    });

    window.openWhatsApp = function() {
        var message = encodeURIComponent(document.querySelector('#messageText').value);
        var phoneNumber = phoneNumberInput.value.replace(/\D/g,'');
        if (phoneNumber) {
            var countryData = iti.getSelectedCountryData();
            var dialCode = countryData.dialCode;
            phoneNumber = '+' + dialCode + phoneNumber;
            var url = `https://wa.me/${phoneNumber}`;
            if (message) {
                url += `?text=${message}`;
            }
            window.open(url, '_blank');
        } else {
            alert('Por favor, insira um número de telefone.');
        }
    }

    // Registrar o Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('Service Worker registrado com sucesso:', registration);
            })
            .catch(function(error) {
                console.log('Falha ao registrar o Service Worker:', error);
            });
    }

    // Lógica para o botão de instalação do PWA
    let deferredPrompt;
    const installButton = document.getElementById('installPWA');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installButton.style.display = 'block';
    });

    installButton.addEventListener('click', (e) => {
        installButton.style.display = 'none';
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuário aceitou a instalação do A2HS');
            } else {
                console.log('Usuário recusou a instalação do A2HS');
            }
            deferredPrompt = null;
        });
    });
});