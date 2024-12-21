// storeLocations.js

/*
 * Citations and Attributions:
 * 
 * Base Project:
 * - Source: CS 340 Node.js Starter App (Step 8)
 * - URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
 * - Usage: Basic CRUD operations structure
 * 
 * References:
 * - MDN Web Docs - Fetch API (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
 * - Usage: Modern AJAX request handling
*/

// Function to delete a product location using regular JavaScript/XHR
function deleteStoreLocation(locationID) {
    let data = { id: locationID };
    
    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-storeLocation-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            deleteRow(locationID);
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            alert("There was an error deleting the product location.");
        }
    }
    xhttp.send(JSON.stringify(data));
}

// Function to delete a row from the table
function deleteRow(locationID) {
    let table = document.getElementById("storeLocations-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == locationID) {
            table.deleteRow(i);
            break;
        }
    }
}

// Function to update the table row without reloading
function updateRow(location) {
    const table = document.getElementById("storeLocations-table").getElementsByTagName('tbody')[0];
    // Loop through the table rows to find the row with the matching locationID
    for (let i = 0, row; row = table.rows[i]; i++) {
        // If the locationID matches, update the row with the new data
        if (table.rows[i].getAttribute("data-value") == location.locationID) {
            table.rows[i].cells[2].innerHTML = location.locationName;
            table.rows[i].cells[3].innerHTML = location.address;
            table.rows[i].cells[4].innerHTML = location.phone;
            table.rows[i].cells[4].innerHTML = location.openHours;
            break;
        }
    }
}

// Function to populate the update form with the current data of the selected store location
function populateUpdateForm(location) {
    // Populate the form fields with the selected location's data
    document.getElementById('currentLocationID').value = location.locationID;
    document.getElementById('newLocationID').value = location.locationID;
    document.getElementById('locationName').value = location.locationName;
    document.getElementById('address').value = location.address;
    document.getElementById('phone').value = location.phone;
    document.getElementById('openHours').value = location.openHours;
}

// Function to handle the update button click
function handleUpdateButtonClick(locationID) {
    // Get the table and loop through the rows to find the row with the matching locationID
    const table = document.getElementById("storeLocations-table").getElementsByTagName('tbody')[0];
    for (let i = 0, row; row = table.rows[i]; i++) {
        // If the locationID matches, populate the update form with the location's data
        if (table.rows[i].getAttribute("data-value") == locationID) {
            const location = {
                locationID: table.rows[i].getAttribute("data-value"),
                locationName: table.rows[i].cells[1].innerHTML,
                address: table.rows[i].cells[2].innerHTML,
                phone: table.rows[i].cells[3].innerHTML,
                openHours: table.rows[i].cells[4].innerHTML
            };
            populateUpdateForm(location);
            break;
        }
    }
}
