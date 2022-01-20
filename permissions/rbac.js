const RBAC = require('easy-rbac');
const rbac = new RBAC({
    bartender: {
        can: [
            'bartender',
            'orders:notifications',
            'orders:list',
            'orders:modify',
            'ingredients:list',
        ],
    },
    admin: {
        can: [
            'user:authorize'
        ],
        inherits: ['bartender']
    }
});

module.exports = rbac;
