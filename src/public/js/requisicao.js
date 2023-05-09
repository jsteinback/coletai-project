function requisicao(url, options) {
    return fetch(url, options)
    .then(response => {
        if(response.status === 401) {
            window.location.href = '/api/login'
        } else {
            return response.json();
        }
    })
    .catch(error => {
        console.log(error);
    })
}