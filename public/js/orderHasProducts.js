// orderHasProducts.js

/*
 * Citations and Attributions:
 * 
 * Base Project:
 * - Source: CS 340 Node.js Starter App (Step 8) [wasn't used much in this file in the end]
 * - URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
 * - Usage: Basic CRUD operations structure
 * 
 * References:
 * - MDN Web Docs - Fetch API (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
 * - Usage: Modern AJAX request handling
*/

// Add event listener that runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get all delete buttons on the page
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    // Add click event listener to each delete button
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Show confirmation dialog before deletion
            if (!confirm('Are you sure you want to delete this Product Order?')) {
                return;
            }

            // Get the M:N ID (orderID-productID) from the button's attribute
            const id = event.target.getAttribute('data-id');
            
            // Send DELETE request to server using fetch API
            fetch('/delete-orderHasProduct-ajax', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id }),
            })
            .then(response => {
                // Check if response is successful
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Find and remove the table row WITHOUT reloading the page
                    const row = event.target.closest('tr');
                    if (row) {
                        row.remove();
                    }
                    // Show a success message
                    window.location.href = '/orderHasProducts?successMessage=Deleted successfully';
                } else {
                    alert('Failed to delete Product Order.'); // Show an error message
                }
            })
            .catch(error => {
                // Show any errors during the deletion
                console.error('Error:', error);
                alert('Failed to delete Product Order.');
            });
        });
    });

    // Handle update form submission
    const updateForm = document.getElementById('update-form');
    updateForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        // Convert form data to object
        const formData = new FormData(updateForm);
        const data = Object.fromEntries(formData.entries());

        // Debug log (always good to have)
        console.log('Form Data:', data);

        // Send POST request to update the order-product relationship using the fetch API
        fetch('/update-orderHasProduct-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        // Handle response then data from server
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                // Redirect with success message
                window.location.href = `/orderHasProducts?successMessage=Updated successfully`;
            }
        })
        // Show any errors during the fetch request
        .catch(error => console.error('Error:', error));
    });
});
