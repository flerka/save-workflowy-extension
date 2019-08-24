window.onload = async function () {
	window.client = new WorkflowyApiClient();
	chrome.storage.local.get('isLogged', function(item) {
		if(item.isLogged) {
			hideLogin();
		}
		else {
			showLogin();
		}
	});

	document.getElementById("login-form").addEventListener("submit", login);
	document.getElementById("add-to-worklowy-form").addEventListener("submit", addToWorkflowy);
};

async function login(e) {
	e.preventDefault();

	let loginResult = await window.client.login(e.target.email.value, e.target.password.value);
	if (loginResult) {
		chrome.storage.local.set({ 'isLogged' : true });
		hideLogin();
	}
}

async function addToWorkflowy(e) {
	e.preventDefault();

	let refreshResult = await window.client.refresh();
	if (!refreshResult) {
		showLogin();

		chrome.storage.local.set({ 'isLogged' : false });
		return;
	}

	// TODO add project selection here or some default project
	let projectId = "";
	await window.client.create(projectId, window.location.href);
}

function hideLogin() {
	document.getElementById(Constants.authContainerId).setAttribute("hidden", true);
	document.getElementById(Constants.addToWorklowyContainerId).removeAttribute("hidden");
}

function showLogin() {
	document.getElementById(Constants.addToWorklowyContainerId).setAttribute("hidden", true);
	document.getElementById(Constants.authContainerId).removeAttribute("hidden");
}

class Constants {
	static isLoggedStorageKey = "isLogged";
	static authContainerId = "auth-container";
	static addToWorklowyContainerId = "add-to-worklowy-container";
}