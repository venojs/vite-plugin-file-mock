module.exports = (request) => {
    if (request.method === 'GET') {
        return {
            result: 1,
            method: request.method,
        }
    } else {
        return {
            result: 2,
            method: request.method,
        }
    }
}
