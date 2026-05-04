export const sanitize = (req, res, next) => {
    const clean = (obj) => {
        if (obj && typeof obj === 'object') {
            for (const key in obj) {
                if (key.startsWith('$') || key.includes('.')) {
                    delete obj[key]
                } else {
                    clean(obj[key])
                }
            }
        }
    }
    clean(req.body)
    clean(req.params)
    next()
}