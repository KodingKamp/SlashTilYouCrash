class Database {
    constructor() {
        this.xhttp;
    }

    // Method for creating a post request and passing the score to the API.
    sendStatsToDatabase(score, level){
        this.xhttp = new XMLHttpRequest();
        this.xhttp.open("POST", "http://localhost/save", "true");
        this.xhttp.setRequestHeader("Score", score);
        this.xhttp.setRequestHeader("Level", level);
        this.xhttp.send();
    }
}
