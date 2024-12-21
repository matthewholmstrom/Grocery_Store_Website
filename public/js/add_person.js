// add_person.js

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

/*
 * DDL Execution Implementation:
 * - Source: CS 340 Node.js Starter App (Step 8)
 * - URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
 * - Changes: Added validation and error handling for DDL statements 
 *          based on MDN Web Docs and previous courses
*/
function executeDDL(ddlStatements) {
    // Prepare the data to send
    let data = {
        ddl: ddlStatements
            .split(';')
            .map(statement => statement.trim())
            .filter(statement => statement.length > 0)
    };
    
    // Setup AJAX request
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/execute-ddl", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            console.log("DDL statements executed successfully");
            alert("DDL statements executed successfully");
        }
        else if (xhttp.readyState === 4 && xhttp.status !== 200) {
            console.log("There was an error with the DDL input.");
            alert("There was an error with the DDL input.");
        }
    }

    // Send the request
    xhttp.send(JSON.stringify(data));
}

// Handle DDL form submission
const executeDDLForm = document.getElementById('execute-ddl-form-ajax');

// End of add_person.js
if (executeDDLForm) {
    executeDDLForm.addEventListener("submit", function (e) {
        // Prevent default form submission
        e.preventDefault();

        // Get DDL input value
        const inputDDL = document.getElementById("input-ddl");
        const ddlValue = inputDDL.value;

        /*
         * DDL Execution Implementation:
         * - Source: CS 340 Node.js Starter App (Step 8)
         * - URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
         * - Changes: Added success/error handling and routing based on MDN Web Docs and previous courses
         * - Usage: runs the DDL statements and displays the appropriate message
         */

        // Execute DDL statements
        executeDDL(ddlValue)
            .then(data => {
                if (data.success) {
                    window.location.href = `/${routeName}?successMessage=Deleted successfully`;
                } else {
                    alert('Failed to delete item.');
                }
            });
    });
}
