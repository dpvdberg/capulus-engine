const RBAC = require('easy-rbac');
const rbac = new RBAC({
    bartender: {
        can: [
            'bartender',
            'orders:list',
            'orders:modify',
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

module.exports = rbac