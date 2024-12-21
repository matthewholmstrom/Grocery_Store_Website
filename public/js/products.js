// products.js

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

// Function to delete a product using regular JavaScript/XHR
document.addEventListener('DOMContentLoaded', function() {
    // Delete button event listeners
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', function() {
            const productID = this.dataset.productId;
            deleteProduct(productID);
        });
    });

    // Update button event listeners
    document.querySelectorAll('.update-product').forEach(button => {
        button.addEventListener('click', function() {
            const product = JSON.parse(this.dataset.product);
            populateUpdateForm(product);
        });
    });

    // Update form submission handler
    const updateForm = document.getElementById('updateProductForm');
    if (updateForm) {
        updateForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Convert form data to URL encoded format instead of JSON
            const formData = new URLSearchParams(new FormData(this));
            
            fetch('/update-product-form', {
                method: 'POST',
                // Send form data as URL encoded data
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            })
            // Handle response
            .then(response => {
                if (response.redirected) {
                    // Handle redirect from server
                    window.location.href = response.url;
                } else {
                    return response.text().then(text => {
                        throw new Error(text);
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to update product: ' + error.message);
            });
        });
    }
});

// Function to delete a product using fetch API
function deleteProduct(productID) {
    // Show confirmation dialog before deletion
    if (confirm('Are you sure you want to delete this product?')) {
        fetch('/delete-product-ajax', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: productID }),
        })
        // Handle response
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.reload();
            } else {
                alert('Failed to delete product.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete product.');
        });
    }
}

// Function to populate the update form with the selected product's data
function populateUpdateForm(product) {
    // Populate all form fields with existing product data
    document.getElementById('currentProductID').value = product.productID;
    document.getElementById('newProductID').value = product.productID;
    document.getElementById('updateProductName').value = product.productName;
    document.getElementById('updatePrice').value = product.price;
    document.getElementById('updateQuantityInStock').value = product.quantityInStock;
    document.getElementById('updateQuantitySold').value = product.quantitySold;
    document.getElementById('updateProductCategory').value = product.productCategory;
    
    // Handle brandID dropdown
    const brandIDSelect = document.getElementById('updateBrandID');
    if (brandIDSelect) {
        brandIDSelect.value = product.brandID || '';
    }

    // Scroll to the update form
    document.getElementById('updateProductForm').scrollIntoView({
        behavior: 'smooth'
    });
}
