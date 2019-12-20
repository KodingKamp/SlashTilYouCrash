class Database {
    constructor() {
        this.xhttp;
    }

    // Method for creating a post request and passing the score to the API.
    sendScoreToDatabase(score){
        this.xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost/save", "true");
        xhttp.setRequestHeader("Score", score);
        xhttp.send();
    }
}