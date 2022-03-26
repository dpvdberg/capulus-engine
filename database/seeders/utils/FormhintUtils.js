let cache = {}
async function findFormhintId(queryInterface, formhint) {
    if (formhint in cache) {
        return cache[formhint]
    }

    return queryInterface.rawSelect('formhints', {
        where: {
            name: formhint,
        },
    }, ['id'])
        .then((fh_id) => {
            if (!fh_id) {
                console.error(`Form hint '${formhint}' not found`)
                return null
            }
            cache[formhint] = fh_id
            return fh_id
        })
}

module.exports = {
    findFormhintId
}
