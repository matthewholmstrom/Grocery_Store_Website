// update_person.js

/*
 * Citations and Attributions:
 * 
 * Base Project:
 * - Source: CS 340 Node.js Starter App (Step 8)
 * - URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
 * - Usage: Based on this Step. Basic CRUD operations structure
 * 
 * References:
 * - MDN Web Docs - Fetch API (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
 * - Usage: Modern AJAX request handling
*/

// Get the objects we need to modify
let updatePersonForm = document.getElementById('update-person-form-ajax');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullName = document.getElementById("mySelect");
    let inputHomeworld = document.getElementById("input-homeworld-update");

    // Get the values from the form fields
    let fullNameValue = inputFullName.value;
    let homeworldValue = inputHomeworld.value;
    
    // This shouldn't be needed, but I'm too scared to remove it
    if (isNaN(homeworldValue)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        fullname: fullNameValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-person-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, fullNameValue);

        }
        // If there was an error, log it
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Function to update the table row
function updateRow(data, personID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("people-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == personID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}

// Get the update customer form
let updateCustomerForm = document.getElementById('update-customer-form-ajax');

// Modify the objects we need
updateCustomerForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting the traditional way
    e.preventDefault();

    // Get form fields
    let inputCustomerID = document.getElementById("input-customer-id");
    let inputName = document.getElementById("input-name");
    let inputEmail = document.getElementById("input-email");
    let inputPhone = document.getElementById("input-phone");
    let inputAddress = document.getElementById("input-address");

    // Get values
    let customerID = inputCustomerID.value.trim();
    let name = inputName.value.trim();
    let email = inputEmail.value.trim();
    let phone = inputPhone.value.trim();
    let address = inputAddress.value.trim();

    // Basic validation
    if (!customerID || !name || !email) {
        alert("Customer ID, Name, and Email are required.");
        return;
    }

    // Prepare data to send
    let data = {
        id: customerID,
        name: name,
        email: email,
        phone: phone,
        address: address
    };

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                let updatedCustomer = JSON.parse(xhttp.response);
                updateRow(updatedCustomer, customerID);

                // Clear the form fields
                inputCustomerID.value = '';
                inputName.value = '';
                inputEmail.value = '';
                inputPhone.value = '';
                inputAddress.value = '';

                // Optionally display a success message
                alert("Customer updated successfully.");
            } else {
                let response = JSON.parse(xhttp.response);
                alert(response.error || "Error updating customer.");
            }
        }
    };

    // Send the request
    xhttp.send(JSON.stringify(data));
});

// Function to update the table row
function updateRow(customer, customerID) {
    let table = document.getElementById("customers-table").getElementsByTagName('tbody')[0];
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (row.getAttribute("data-value") == customerID) {
            row.cells[1].innerHTML = customer.name;
            row.cells[2].innerHTML = customer.email;
            row.cells[3].innerHTML = customer.phone || '';
            row.cells[4].innerHTML = customer.address || '';
            break;
        }
    }
}

/*
 * DDL Execution Implementation:
 * - Source: CS 340 Node.js Starter App (Step 8)
 * - URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
 * - Changes: Added validation and error handling for DDL statements 
 *          based on MDN Web Docs and previous courses
*/

// Function to execute DDL statements with AJAX
function executeDDL(ddlStatements) {
    // Put our data we want to send in a javascript object
    let data = {
        ddl: ddlStatements.split(';').map(statement => statement.trim()).filter(statement => statement.length > 0)
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/execute-ddl", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log("DDL statements executed successfully");
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the DDL input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

// Function to update a customer via AJAX
function updateCustomer(event) {
    event.preventDefault();

    // Get form data
    const customerID = document.querySelector('form[action="/update-customer-form"] input[name="customerID"]').value.trim();
    const name = document.querySelector('form[action="/update-customer-form"] input[name="name"]').value.trim();
    const email = document.querySelector('form[action="/update-customer-form"] input[name="email"]').value.trim();
    const phone = document.querySelector('form[action="/update-customer-form"] input[name="phone"]').value.trim();
    const address = document.querySelector('form[action="/update-customer-form"] input[name="address"]').value.trim();

    // Validation
    if (!customerID || !name || !email) {
        alert("Customer ID, Name, and Email are required.");
        return;
    }

    // Prepare data to send
    const data = {
        id: customerID,
        name: name,
        email: email,
        phone: phone,
        address: address
    };

    // Send the request using fetch API
    fetch('/update-customer-ajax', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    // Handle the response
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(`Error: ${data.error}`);
        } else {
            alert('Customer updated successfully.');
            window.location.reload();
        }
    })
    // Show any errors
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while updating the customer.');
    });
}

// Attach event listener to the update customer form
const updateForm = document.querySelector('form[action="/update-customer-form"]');

// Add event listener to the update form
if (updateForm) {
    updateForm.addEventListener('submit', updateCustomer);
}

// Function to update the table row without reloading
function updateRow(customer) {
    const table = document.getElementById("customers-table").getElementsByTagName('tbody')[0];
    for (let i = 0, row; row = table.rows[i]; i++) {
        // Check if the row matches the customer ID
        if (table.rows[i].getAttribute("data-value") == customer.customerID) {
            table.rows[i].cells[2].innerHTML = customer.customerID;
            table.rows[i].cells[3].innerHTML = customer.name;
            table.rows[i].cells[4].innerHTML = customer.email;
            table.rows[i].cells[5].innerHTML = customer.phone;
            table.rows[i].cells[6].innerHTML = customer.address;
            break;
        }
    }
}

// Client-side validation for the update customer form
document.addEventListener('DOMContentLoaded', () => {
    const updateForm = document.querySelector('form[action="/update-customer-form"]');
    
    // Add event listener to the update form
    if (updateForm) {
        updateForm.addEventListener('submit', function(event) {
            // Prevent the form from submitting
            const customerID = document.querySelector('input[name="customerID"]').value.trim();
            const name = document.querySelector('input[name="name"]').value.trim();
            const email = document.querySelector('input[name="email"]').value.trim();
            
            // Validate required fields
            if (!customerID || !name || !email) {
                alert("Customer ID, Name, and Email are required.");
                event.preventDefault();
            }
        });
    }
});