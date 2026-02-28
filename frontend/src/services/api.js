// ============================================================
// Cliente HTTP centralizado
// Autor: Lucas Pignataro
// ============================================================
const BASE_URL = '/api';
function getToken() {
    return localStorage.getItem('authToken');
}
function buildHeaders(withAuth = true) {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (withAuth) {
        const token = getToken();
        if (token)
            headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}
async function request(method, path, body, withAuth = true) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: buildHeaders(withAuth),
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (res.status === 204)
        return undefined;
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message ?? `Error ${res.status}`);
    }
    return data;
}
export const api = {
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body),
    put: (path, body) => request('PUT', path, body),
    delete: (path) => request('DELETE', path),
    // Auth (sin token en el header)
    auth: {
        login: (body) => request('POST', '/auth/login', body, false),
        register: (body) => request('POST', '/auth/register', body, false),
    },
};
