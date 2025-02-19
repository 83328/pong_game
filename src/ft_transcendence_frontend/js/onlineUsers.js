export class OnlineUsersHandler {
    static async fetchOnlineUsers() {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.log("🚫 Kein Token gefunden, nicht eingeloggt.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/users/online-users/", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("👥 Online User:", data.online_users);

            const userList = document.getElementById("online-users-list");
            if (userList) {
                userList.innerHTML = data.online_users.map(user => `<li>${user.username}</li>`).join("");
            }

        } catch (error) {
            console.error("⚠️ Fehler beim Abrufen der Online-User:", error);
        }
    }

    static startPolling() {
        // Sofort beim Start einmal ausführen
        this.fetchOnlineUsers();
        // Dann alle 10 Sekunden
        this.pollInterval = setInterval(() => this.fetchOnlineUsers(), 10000);
    }

    static stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
        }
    }

    static async removeUserFromOnline() {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        try {
            const response = await fetch("http://localhost:8080/api/users/online/", {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log("👋 User aus Online-Liste entfernt");
            this.stopPolling();
        } catch (error) {
            console.error("⚠️ Fehler beim Entfernen des Users:", error);
            throw error;
        }
    }
} 