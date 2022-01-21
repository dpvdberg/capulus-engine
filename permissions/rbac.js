const RBAC = require('easy-rbac');
const rbac = new RBAC({
    bartender: {
        can: [
            'bartender',
            'orders:notifications',
            'orders:list',
            'orders:modify',
            'ingredients:list',
            'ingredients:modify',
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
