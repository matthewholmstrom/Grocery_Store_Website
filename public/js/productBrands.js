// productBrands.js

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

// Function to delete a product brand using regular JavaScript/XHR
function deleteProductBrand(brandID) {
    let data = { id: brandID };
    
    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-productBrand-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            deleteRow(brandID);
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            alert("There was an error deleting the product brand.");
        }
    }
    xhttp.send(JSON.stringify(data));
}

// Function to delete a row from the table
function deleteRow(brandID) {
    let table = document.getElementById("productBrands-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == brandID) {
            table.deleteRow(i);
            break;
        }
    }
}

// Function to update the table row without reloading
function updateRow(brand) {
    const table = document.getElementById("productBrands-table").getElementsByTagName('tbody')[0];
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == brand.brandID) {
            table.rows[i].cells[2].innerHTML = brand.brandID;
            table.rows[i].cells[3].innerHTML = brand.brandName;
            table.rows[i].cells[4].innerHTML = brand.brandCountry;
            break;
        }
    }
}