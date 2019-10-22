window.onload = async function () {
	window.client = new WorkflowyApiClient();
	chrome.storage.local.get('isLogged', async function(item) {
		if(item.isLogged) {
			hideLogin();
		}
		else {
			// double check not to show login form if user has already login
			let refreshResult = await window.client.refresh();
			if (refreshResult) {
				hideLogin();
			}
			else {
				showLogin();
			}
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

	// TODO check behavior in multiply windows env
	// TODO handle long url in the future
	let activeTabs = await browser.tabs.query({active: true});
	await window.client.create(activeTabs[0].url);
}

function hideLogin() {
	document.getElementById(authContainerId).setAttribute("hidden", true);
	document.getElementById(addToWorklowyContainerId).removeAttribute("hidden");
}

function showLogin() {
	document.getElementById(addToWorklowyContainerId).setAttribute("hidden", true);
	document.getElementById(authContainerId).removeAttribute("hidden");
}

const isLoggedStorageKey = "isLogged";
const authContainerId = "auth-container";
const addToWorklowyContainerId = "add-to-worklowy-container";