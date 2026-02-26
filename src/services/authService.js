/**
 * Authentication service for handling secure user sessions using localStorage.
 * This simulates a persistent login session.
 */
export const AuthService = {
    /**
     * Simulates a login request.
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<boolean>}
     */
    login: async (email, password) => {
        return new Promise((resolve) => {
            // Simulate network request delay
            setTimeout(() => {
                // Mock validation: accept any email that is not empty
                if (email && password) {
                    const mockToken = `token_${Math.random().toString(36).substring(2)}`;
                    const mockUser = {
                        user_id: 'usr_' + Math.floor(Math.random() * 1000000000),
                        name: email.split('@')[0] || 'Student',
                        email: email,
                        target_score: 79,
                        overall_average: 68
                    };

                    // Store session data persistently
                    localStorage.setItem('pte_auth_token', mockToken);
                    localStorage.setItem('pte_user', JSON.stringify(mockUser));
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 500);
        });
    },

    /**
     * Simulates a registration request.
     * @param {string} name 
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<boolean>}
     */
    register: async (name, email, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (name && email && password) {
                    const mockToken = `token_${Math.random().toString(36).substring(2)}`;
                    const mockUser = {
                        user_id: 'usr_' + Math.floor(Math.random() * 1000000000),
                        name: name,
                        email: email,
                        target_score: 79,
                        overall_average: 0
                    };

                    localStorage.setItem('pte_auth_token', mockToken);
                    localStorage.setItem('pte_user', JSON.stringify(mockUser));
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 500);
        });
    },

    /**
     * Logs out the user by clearing the persistent storage.
     */
    logout: () => {
        localStorage.removeItem('pte_auth_token');
        localStorage.removeItem('pte_user');
    },

    /**
     * Checks if the user has an active persistent session.
     * @returns {boolean}
     */
    isAuthenticated: () => {
        const token = localStorage.getItem('pte_auth_token');
        return !!token; // Returns true if token exists
    },

    /**
     * Gets the currently logged in user info.
     * @returns {Object|null}
     */
    getUser: () => {
        const userStr = localStorage.getItem('pte_user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                return null;
            }
        }
        return null;
    }
};
