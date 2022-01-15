const RBAC = require('easy-rbac');
const rbac = new RBAC({
    bartender: {
        can: [
            'orders:list',
        ],
    },
    admin: {
        can: [
            'user:authorize'
        ],
        inherits: ['bartender']
    }
});

module.exports = rbac