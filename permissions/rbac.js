const RBAC = require('easy-rbac');
const rbac = new RBAC({
    bartender: {
        can: [
            'bartender',
            'orders:list',
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