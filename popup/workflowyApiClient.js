class WorkflowyApiClient {
    clientVersion = 18;
    clientId = null;
    lastTransactionId = null;

    urls = {
        login: 'https://workflowy.com/ajax_login',
        meta: 'https://workflowy.com/get_initialization_data?client_version=' + this.clientVersion,
        update: 'https://workflowy.com/push_and_poll'
    };

    constructor() {
    }

    async login(username, password) {
        let data = new URLSearchParams();
        data.append('username', username);
        data.append('password', password);

        let loginResult;
        try {
           await fetch(this.urls.login, {method: 'POST', headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }, body: data});

            return  true;
        } catch (e) {
            console.log(e);
            return  false;
        }
    }

    async refresh() {
        try {
            let metaInfo = await (await fetch(this.urls.meta)).json();
            this.clientId = metaInfo.projectTreeData.clientId;
            this.lastTransactionId = metaInfo.projectTreeData.mainProjectTreeInfo.initialMostRecentOperationTransactionId;
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

    async create(parentId, name) {
        let projectId = uuidv4();
        let operations = [
            {
                type: "create",
                data: {
                    projectid: projectId,
                    parentid: parentId,
                    priority:  0
                },
            },
            {
                type: "edit",
                data: {
                    projectid: projectId,
                    name: name,
                    description: null
                }
            }
        ];
        try {
            await this.update(operations, this.clientId, this.lastTransactionId);
        }
        catch (e) {
            console.log(e);
        }

    }

    async update(operations, clientId, lastTransactionId) {
        for (let i = 0; i < operations.length; i++) {
            operations[i].client_timestamp = 140101232;
        }

        let pollId = (Math.random() + 1).toString(36).substr(2, 8);

        let data = new URLSearchParams();
        data.append("client_id", clientId);
        data.append("client_version", this.clientVersion.toString());
        data.append("push_poll_id", pollId);
        data.append("push_poll_data", JSON.stringify([
            {
                most_recent_operation_transaction_id: lastTransactionId,
                operations: operations
            }
        ]));

        await fetch(this.urls.update, {method: 'POST', headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            }, body: data});
    }
}