export function addToSessionStorage(name, content) {
    content = JSON.stringify(content);
    sessionStorage.setItem(name, content);
}

export function checkInSessionStorage(name) {
    if (sessionStorage.getItem(name)) {
        return true;
    } else { return false; }
}

export function getFromSessionStorage(name) {
    if (sessionStorage.getItem(name)) {
        return JSON.parse(sessionStorage.getItem(name));
    }
}

export function removeFromSessionStorage(name) {
    if (sessionStorage.getItem(name)) {
        return sessionStorage.removeItem(name);
    }
}

export function addToLocalStorage(name, content) {
    content = JSON.stringify(content);
    localStorage.setItem(name, content);
}

export function checkInLocalStorage(name) {
    if (localStorage.getItem(name)) {
        return true;
    } else { return false; }
}

export function getFromLocalStorage(name) {
    if (localStorage.getItem(name)) {
        return JSON.parse(localStorage.getItem(name));
    }
}

export function removeFromLocalStorage(name) {
    if (localStorage.getItem(name)) {
        return localStorage.removeItem(name);
    }
}