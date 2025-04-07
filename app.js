document.addEventListener('DOMContentLoaded', () => {
    const form = {
        idInstance: document.getElementById('idInstance'),
        apiToken: document.getElementById('apiTokenInstance'),
        phone: document.getElementById('phoneNumber'),
        message: document.getElementById('message'),
        phoneFile: document.getElementById('phoneNumberFile'),
        fileUrl: document.getElementById('fileUrl'),
        response: document.getElementById('response')
    };

    const errors = {
        idInstance: document.getElementById('idInstance-error'),
        apiToken: document.getElementById('apiTokenInstance-error'),
        phone: document.getElementById('phoneNumber-error'),
        message: document.getElementById('message-error'),
        phoneFile: document.getElementById('phoneNumberFile-error'),
        fileUrl: document.getElementById('fileUrl-error')
    };

    const savedIdInstance = localStorage.getItem('idInstance');
    const savedApiToken = localStorage.getItem('apiTokenInstance');

    if (savedIdInstance) form.idInstance.value = savedIdInstance;
    if (savedApiToken) form.apiToken.value = savedApiToken;

    function saveCredentials() {
        localStorage.setItem('idInstance', form.idInstance.value);
        localStorage.setItem('apiTokenInstance', form.apiToken.value);
    }

    function showError(input, errorElement) {
        input.classList.add('error');
        errorElement.classList.add('visible');
        return false;
    }

    function hideError(input, errorElement) {
        input.classList.remove('error');
        errorElement.classList.remove('visible');
    }

    function validate(input, errorElement) {
        return input.value.trim() ? (hideError(input, errorElement), true) : showError(input, errorElement);
    }

    form.idInstance.addEventListener('input', () => hideError(form.idInstance, errors.idInstance));
    form.apiToken.addEventListener('input', () => hideError(form.apiToken, errors.apiToken));
    form.phone.addEventListener('input', () => hideError(form.phone, errors.phone));
    form.message.addEventListener('input', () => hideError(form.message, errors.message));
    form.phoneFile.addEventListener('input', () => hideError(form.phoneFile, errors.phoneFile));
    form.fileUrl.addEventListener('input', () => hideError(form.fileUrl, errors.fileUrl));

    async function callApi(method, endpoint, data = null) {
        const validId = validate(form.idInstance, errors.idInstance);
        const validToken = validate(form.apiToken, errors.apiToken);

        if (!validId || !validToken) {
            return;
        }

        saveCredentials();

        const idInstance = form.idInstance.value;
        const apiTokenInstance = form.apiToken.value;
        const url = `https://7105.api.greenapi.com/waInstance${idInstance}/${endpoint}/${apiTokenInstance}`;

        try {
            form.response.value = 'Отправка запроса...';

            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (data) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);
            const result = await response.json();

            form.response.value = JSON.stringify(result, null, 2);
        } catch (error) {
            form.response.value = `Ошибка: ${error.message}`;
        }
    }

    document.getElementById('getSettings').addEventListener('click', () => {
        callApi('GET', 'getSettings');
    });

    document.getElementById('getStateInstance').addEventListener('click', () => {
        callApi('GET', 'getStateInstance');
    });

    document.getElementById('sendMessage').addEventListener('click', () => {
        const validPhone = validate(form.phone, errors.phone);
        const validMessage = validate(form.message, errors.message);

        if (!validPhone || !validMessage) {
            return;
        }

        const data = {
            chatId: `${form.phone.value}@c.us`,
            message: form.message.value
        };

        callApi('POST', 'sendMessage', data);
    });

    document.getElementById('sendFileByUrl').addEventListener('click', () => {
        const validPhone = validate(form.phoneFile, errors.phoneFile);
        const validUrl = validate(form.fileUrl, errors.fileUrl);

        if (!validPhone || !validUrl) {
            return;
        }

        const data = {
            chatId: `${form.phoneFile.value}@c.us`,
            urlFile: form.fileUrl.value,
            fileName: form.fileUrl.value.split('/').pop()
        };

        callApi('POST', 'sendFileByUrl', data);
    });
}); 