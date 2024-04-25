let nameInput = document.getElementById("nameInput") as HTMLInputElement;
let addPlayer = document.getElementById("addPlayer") as HTMLButtonElement;
interface IPlayer {
    id: number;
    name: string;
    score: number;
}
class Player implements IPlayer {
    id: number;
    name: string;
    score: number;
    players: IPlayer[];

    constructor(players: IPlayer[], id: number, name: string, score: number) {
        this.players = players;
        const storedPlayers = localStorage.getItem("players");
        this.players = storedPlayers ? JSON.parse(storedPlayers) : [];
        this.id = id;
        this.name = name;
        this.score = score;
    }
    renderPlayer(): void {
        checkQuantity2();
        const listStudent = document.getElementById("listStudent") as HTMLTableElement;
        listStudent.innerHTML = "";
        this.players.forEach((item: IPlayer) => {
            const row = document.createElement("tr");
            row.innerHTML =
                `
                <td id="close">
                    <span class="material-symbols-outlined">close</span>
                </td>
                <td id="premium">
                    <span class="material-symbols-outlined">workspace_premium</span>
                </td>
                <td id="name">${item.name}</td>
                <td id="reduce">-</td>
                <td id="quantity">${item.score}</td>
                <td id="raise">+</td>
                <td id="fix">Sửa</td>
            `;
            listStudent.appendChild(row);
        });
        // Nút xóa
        let deleteButtons = document.querySelectorAll("#close");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", function () {
                let row = button.closest("tr") as HTMLTableRowElement;
                let name = row.querySelector("#name")!.textContent!;
                let score = parseInt(row.querySelector("#quantity")!.textContent!);
                row.remove();
                playerManager.deletePlayer(name, score);
            });
        });
        // Nút giảm
        let reduceButtons = document.querySelectorAll("#reduce");
        reduceButtons.forEach((button) => {
            button.addEventListener("click", function () {
                let row = button.closest("tr") as HTMLTableRowElement;
                let quantityElement = row.querySelector("#quantity") as HTMLElement;
                let score = parseInt(quantityElement.textContent!);
                if (score > 0) {
                    score -= 1;
                    quantityElement.textContent = score.toString();
                    updatePlayerQuantity(row, score);
                    checkQuantity2();
                } else {
                    alert("Không thể giảm số lượng");
                }
            });
        });
        // Nút tăng
        let raiseButtons = document.querySelectorAll("#raise");
        raiseButtons.forEach((button) => {
            button.addEventListener("click", function () {
                let row = button.closest("tr") as HTMLTableRowElement;
                let quantityElement = row.querySelector("#quantity") as HTMLElement;
                let score = parseInt(quantityElement.textContent!);
                score += 1;
                quantityElement.textContent = score.toString();
                updatePlayerQuantity(row, score);
                checkQuantity2();
            });
        });
        // Nút sửa
        let fixButton = document.querySelectorAll("#fix");
        fixButton.forEach((button) => {
            button.addEventListener("click", function () {
                let row = button.closest("tr") as HTMLTableRowElement;
                let name = row.querySelector("#name") as HTMLElement;
                let playerName = name.textContent!;
                let index = playerManager.players.findIndex(player => player.name === playerName);
                if (index !== -1) {
                    nameInput.value = playerName;
                    playerManager.players.splice(index, 1);
                    playerManager.renderPlayer();
                }
            });
        });
    }
    createPlayer(name: string): void {
        let isExist = this.players.some(person => person.name === name);
        if (!isExist) {
            const newPlayer: IPlayer = { id: Math.random(), name: name, score: 0 };
            this.players.push(newPlayer);
            localStorage.setItem("players", JSON.stringify(this.players));
            this.renderPlayer();
        } else {
            alert("Tên người chơi đã tồn tại");
        }
    }
    updatePlayer(name: string, newScore: number): void {
        const playerIndex = this.players.findIndex(player => player.name === name);
        if (playerIndex !== -1) {
            this.players[playerIndex].score = newScore;
            localStorage.setItem("players", JSON.stringify(this.players));
            this.renderPlayer();
        }
    }
    deletePlayer(name: string, score: number): void {
        this.players = this.players.filter(player => player.name !== name || player.score !== score);
        localStorage.setItem("players", JSON.stringify(this.players));
        this.renderPlayer();
    }
}
const storedPlayers: IPlayer[] = JSON.parse(localStorage.getItem("players") || '[]');
const playerManager = new Player(storedPlayers, Math.random(), nameInput.value, 0);
addPlayer.onclick = function () {
    playerManager.createPlayer(nameInput.value);
};
window.onload = function () {
    playerManager.renderPlayer();
    checkQuantity2();
};
function updatePlayerQuantity(row: HTMLTableRowElement, score: number) {
    let name = row.querySelector("#name")!.textContent!;
    let playerIndex = playerManager.players.findIndex(player => player.name === name);
    if (playerIndex !== -1) {
        playerManager.players[playerIndex].score = score;
        localStorage.setItem("players", JSON.stringify(playerManager.players));
    }
}
function checkQuantity2() {
    storedPlayers.forEach((item, index) => {
        for (let i = index + 1; i < storedPlayers.length; i++) {
            if (item.score === storedPlayers[i].score) {
                console.log(item.name, item.score, storedPlayers[i].name, storedPlayers[i].score);
            }
        }
    });
}
