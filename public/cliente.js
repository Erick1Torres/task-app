// cliente.js
const taskApi = {
    async getAll() {
        const response = await fetch("http://localhost:3000/api/v1/tasks");
        return await response.json();
    },
    async create(taskData) {
        const response = await fetch("http://localhost:3000/api/v1/tasks", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        return await response.json();
    },
    async update(id, updates) {
        const response = await fetch(`http://localhost:3000/api/v1/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        return await response.json();
    },
    async delete(id) {
        await fetch(`http://localhost:3000/api/v1/tasks/${id}`, {
            method: 'DELETE'
        });
    }
};