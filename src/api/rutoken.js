import rutoken from '@aktivco/rutoken-plugin'


var rutokenPlugin = null
var device = null

export function init() {
    return rutoken.ready
        .then(checkRutokenExtensionInstall)
        .then(checkRutokenPluginInstall)
        .then(loadRutokenPlugin)
}

export function readTokenLabel() {
    rutokenPlugin.getDeviceInfo(device, rutokenPlugin.TOKEN_INFO_LABEL)
        .then(function(result) {
            console.log(result);
            return result;
        });
}

export function handleRutokenError(reason) {
    if (isNaN(reason.message)) {
        console.error(reason);
    } else {
        var errorCodes = rutokenPlugin.errorCodes;
        switch (parseInt(reason.message)) {
            case errorCodes.PIN_INCORRECT:
                alert("Неверный PIN");
                break;
            default:
                alert("Неизвестная ошибка #" + reason.message);
        }
    }
}

export function checkRutokenExtensionInstall() {
    if (window.chrome || typeof InstallTrigger !== 'undefined') {
        return rutoken.isExtensionInstalled()
            .then(result => {
                if (result) {
                    console.log("Расширение Рутокен найдено");
                    return result;
                } else {
                    return Promise.reject("Расширение Рутокен не обнаружено");
                }
            });
    } else {
        alert("Браузер не поддерживатся")
        return Promise.reject("Браузер не поддерживатся");
    }
}

export function checkRutokenPluginInstall() {
    return rutoken.isPluginInstalled()
            .then(result => {
                if (result) {
                    console.log("Плагин Rutoken найден");
                    return result
                } else {
                    return Promise.reject("Плагин Rutoken не обнаружен");
                }
            });

}

export function loadRutokenPlugin() {
    return rutoken.loadPlugin()
        .then((plugin) => {rutokenPlugin = plugin});

}

export function findDevice() {
    return rutokenPlugin.enumerateDevices().then(function(devices) {
        if (devices.length > 0) {
            console.log(devices);
            device = devices[0]
            return devices[0];
        } else {
            return Promise.reject("Устройство не обнаружено");
        }
    });
}

export function login(pin) {
    console.log('Авторизация на устройстве:', device, ', pin:', pin);
    return rutokenPlugin.login(device, pin)
}

export function readCertificate() {
    return rutokenPlugin.enumerateCertificates(device, rutokenPlugin.CERT_CATEGORY_UNSPEC)
        .then(certs => {
            if (certs.length === 0) {
                console.log("Сертификаты не найдены");
                Promise.reject("Сертификаты не найдены")
            } else {
                console.log('Сертификаты на устройстве:', certs);
                return certs[0]
            }
        })
        // .then(certs => rutokenPlugin.getKeyByCertificate(device, certs[0]))
        // .then(key => rutokenPlugin.getPublicKeyValue(device, key, {}))
}
