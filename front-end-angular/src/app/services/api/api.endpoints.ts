export const API_ENDPOINTS = {
    BASE_URL: 'http://localhost:8000',

    get AUTH_LOGIN() {
        return `${this.BASE_URL}/api/auth/login`;
    },
    get AUTH_REGISTER() {
        return `${this.BASE_URL}/api/auth/register`;
    },
    get AUTH_LOGOUT() {
        return `${this.BASE_URL}/api/admin/auth/logout`;
    },

    get AUTH_USER() {
        return `${this.BASE_URL}/api/admin/auth/user`;
    },

    get AUTH_REFRESH_TOKEN() {
        return `${this.BASE_URL}/api/admin/auth/refresh`;
    },

    get CATEGORIES() {
        return `${this.BASE_URL}/api/admin/categories`;
    },
    get ADMINISTRATION_USERS() {
        return `${this.BASE_URL}/api/admin/administration_user`;
    },

    get COMPANIES() {
        return `${this.BASE_URL}/api/admin/companies`;
    },

    get ROLES() {
        return `${this.BASE_URL}/api/admin/role`;
    },

    get MENU_LINKS() {
        return `${this.BASE_URL}/api/admin/data/menu`;
    },

    get CONFIGURATIONS() {
        return `${this.BASE_URL}/api/admin/configurations`;
    },

    get SENSORES() {
        return `${this.BASE_URL}/api/admin/sensores`;
    }



};