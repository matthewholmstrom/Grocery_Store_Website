// delete_person.js

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

// Function to delete a customer using regular JavaScript/XHR
function deleteCustomer(customerID) {
    // Prepare data to send
    let data = {
        id: customerID
    };
    
    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Remove the customer row from the table
            deleteRow(customerID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            alert("There was an error deleting the customer.");
        }
    }
    // Send request
    xhttp.send(JSON.stringify(data));
}

// Function to delete a row from the table
function deleteRow(customerID){
    let table = document.getElementById("customers-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == customerID) {
            table.deleteRow(i);
            break;
        }
    }
    
    // Remove from dropdown menu if applicable
    deleteDropDownMenu(customerID);
}

// Function to delete a customer from the dropdown menu
function deleteDropDownMenu(customerID){
    // Get the dropdown menu
    let selectMenu = document.getElementById("input-customer-id"); // Updated ID
    // Loop through the options and remove the relevant one 
    for (let i = 0; i < selectMenu.options.length; i++){
        if (Number(selectMenu.options[i].value) === Number(customerID)){
            selectMenu.remove(i);
            break;
        }
    }
}

// Get the objects we need to modify
let addCustomerForm = document.getElementById('add-customer-form-ajax');
let executeDDLForm = document.getElementById('execute-ddl-form-ajax');

if(addCustomerForm){
    // Modify the objects we need
    addCustomerForm.addEventListener("submit", function (e) {
        
        // Prevent the form from submitting
        e.preventDefault();

        // Get form fields we need to get data from
        let inputName = document.getElementById("input-name");
        let inputEmail = document.getElementById("input-email");
        let inputPhone = document.getElementById("input-phone");
        let inputAddress = document.getElementById("input-address");

        // Get the values from the form fields
        let nameValue = inputName.value;
        let emailValue = inputEmail.value;
        let phoneValue = inputPhone.value;
        let addressValue = inputAddress.value;

        // Put our data we want to send in a javascript object
        let data = {
            name: nameValue,
            email: emailValue,
            phone: phoneValue,
            address: addressValue
        }
        
        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/add-customer-ajax", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                // Add the new data to the table
                addRowToTable(JSON.parse(xhttp.response));
                
                // Clear the input fields for another transaction
                inputName.value = '';
                inputEmail.value = '';
                inputPhone.value = '';
                inputAddress.value = '';
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }

        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    });
}

// Modify the objects we need for DDL form
if(executeDDLForm){
    executeDDLForm.addEventListener("submit", function (e) {
        // Existing DDL execution code...
    });
}
