// orders.js

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

// Function to delete an order using regular JavaScript/XHR
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to delete buttons
    document.querySelectorAll('.delete-order').forEach(button => {
        button.addEventListener('click', function() {
            const orderID = this.dataset.orderId;
            if (confirm('Are you sure you want to delete this order?')) {
                deleteOrder(orderID);
            }
        });
    });

    // Add event listener to update buttons
    document.querySelectorAll('.update-order').forEach(button => {
        button.addEventListener('click', function() {
            const order = JSON.parse(this.dataset.order);
            populateUpdateForm(order);
        });
    });
});

// Function to delete an order using fetch API
function deleteOrder(orderID) {
    fetch('/delete-order-ajax', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: orderID }),
    })
    // Handle response
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirect to orders page with success message
            window.location.href = '/orders?successMessage=Deleted successfully';
        } else {
            alert('Failed to delete order.');
        }
    })
    // Handle errors
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to delete order.');
    });
}

// Function to populate the update form with the selected order's data
function populateUpdateForm(order) {
    // Populate the form fields with the order data
    document.getElementById('currentOrderID').value = order.orderID;
    document.getElementById('newOrderID').value = order.orderID;
    document.getElementById('updateCustomerID').value = order.customerID;
    document.getElementById('updateLocationID').value = order.locationID;

    // Format the saleDate to yyyy-MM-ddThh:mm
    const saleDate = new Date(order.saleDate);
    const formattedDate = saleDate.toISOString().slice(0, 16);
    document.getElementById('updateSaleDate').value = formattedDate;

    // Format the totalPrice to 2 decimal places
    document.getElementById('updateTotalPrice').value = order.totalPrice;
    document.getElementById('updateOrderForm').scrollIntoView();
}
