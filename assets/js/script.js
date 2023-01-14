// JSHint API - My personal key: CfZphzcUplq2fVcP9SqcGCTDqnk {"expiry":"13-01-2024","status_code":200}

const API_KEY = "CfZphzcUplq2fVcP9SqcGCTDqnk";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

//wire up the button with a standard event listener

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

async function postForm(e) {
    const form = new FormData(document.getElementById("checksform"));

    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                                    "Authorization": API_KEY,
                                 },
                        body: form
                        });
    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error);
    };
}

//Asynchronous function - to handle a promise, wrap the promises in an async function and await the promise coming true.
async function getStatus(e) {
    // the query string will consist of the URL and the parameters 
    // that we need to send over to the API with the GET request
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    const response = await fetch(queryString);

    // await instructions - when the response comes back, we need to 
    // convert it to json().  The json() method returns a response too
    // so we'll have to await that too.
    const data = await response.json();

    // if everything has gone well, a property is set on the response object
    // and this property is the "ok" property.
    // If the server returns a response of HTTP status code 200, our request
    // has been successful and the "ok" property will be set to True.

    if (response.ok) {
        displayStatus(data); 
        // or use dot notation to drill down for specific result like console.log(data.expiry) to get the API Key expiry date
    } else {
        throw new Error(data.error);
    }

}

function displayErrors(data) {
    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no-errors">No Errors Reported!</div>`;
    } else {
        results =  `<div>Total Errors: <span class="error-count">${data.total_errors}</span></span></div>`;
        for (let error of data.error_list) {
            results += `<div>At Line <span class="line">${error.line}</span>,  `;
            results += `column <span class="columns">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }
}

function displayStatus(data) {

    let heading = "API KEY status";
    let results = `Your key is valid until ${data.expiry}`;
    // `<div>Your key is valid until</div>`;
    // 
    // results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}


