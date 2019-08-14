window.onload = function () {
	document.getElementById("login-form").addEventListener("submit", login);
}

function login(e) {
	let url = "https://workflowy.com/ajax_login";
	const data = new URLSearchParams();
	data.append('username', e.target.email.value);
	data.append('password', e.target.password.value);
	data.append('next', "");

	postData(url, data)
		.then(data => console.log(data))
		.catch(error => console.error(error));

}

function postData(url = '', data = {}) {
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: data
	})
	.then(response => response.json());
}