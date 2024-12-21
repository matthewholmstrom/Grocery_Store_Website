// App.js

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

// SETUP
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 8099;

// Handlebars setup
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars');

app.engine('.hbs', engine({ extname: ".hbs" }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Register the json helper
Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

// Register a date formatting helper
Handlebars.registerHelper('formatDate', function(date) {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
});

// Database connection
const db = require('./database/db-connector');

// Middleware setup
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded requests
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory
app.use(express.static('public'));


//ROUTES------------------------------------------------------------

// Customer Routes-------------------------------------------------
// Home route to display customers
app.get('/', (req, res) => {
    const query = `SELECT * FROM Customers ORDER BY customerID ASC`;
    db.pool.query(query, (error, rows, fields) => {
        if (error) {
            console.error("Database query error:", error);
            res.render('index', { errorMessage: "Error fetching customers." });
        } else {
            // Retrieve successMessage from query parameters
            const successMessage = req.query.successMessage;
            res.render('index', { data: rows, successMessage: successMessage });
        }
    });
});

// Route to add a customer with HTML form
app.post('/add-customer-form', (req, res) => {
    const { name, email, phone, address } = req.body;
    // Add customer to the database
    const query = `INSERT INTO Customers (name, email, phone, address) VALUES (?, ?, ?, ?)`;
    db.pool.query(query, [name, email, phone, address], (error, results) => {
        if (error) {
            console.error("Error adding customer:", error);
            res.status(500).send("Error adding customer.");
        } else {
            res.redirect('/?successMessage=Added successfully');
        }
    });
});

// Route to delete a customer with AJAX
app.delete('/delete-customer-ajax', (req, res) => {
    const customerID = parseInt(req.body.id);
    const query = `DELETE FROM Customers WHERE customerID = ?`;
    db.pool.query(query, [customerID], (error, results) => {
        if (error) {
            console.error("Error deleting customer:", error);
            res.status(500).json({ error: "Failed to delete customer." });
        } else {
            res.status(200).json({ success: true, message: 'Deleted successfully' });
        }
    });
});

// Route to handle updating a customer with form submission
app.post('/update-customer-form', (req, res) => {
    const { currentCustomerID, newCustomerID, name, email, phone, address } = req.body;
    const query = `UPDATE Customers SET customerID = ?, name = ?, email = ?, phone = ?, address = ? WHERE customerID = ?`;
    db.pool.query(query, [newCustomerID, name, email, phone, address, currentCustomerID], (error, results) => {
        if (error) {
            console.error("Error updating customer:", error);
            res.status(500).send("Error updating customer.");
        } else {
            res.redirect('/?successMessage=Updated successfully');
        }
    });
});

// Product Routes-------------------------------------------------
// Route to display product brands
app.get('/productBrands', (req, res) => {
    const query = `SELECT * FROM ProductBrands ORDER BY brandID ASC`;
    db.pool.query(query, (error, rows, fields) => {
        if (error) {
            console.error("Database query error:", error);
            res.render('productBrands', { errorMessage: "Error fetching product brands." });
        } else {
            const successMessage = req.query.successMessage;
            res.render('productBrands', { data: rows, successMessage: successMessage });
        }
    });
});

// Route to add a product brand with HTML form
app.post('/add-productBrand-form', (req, res) => {
    const { brandID, brandName, brandCountry } = req.body;

    if (!brandID || !brandName) {
        console.error("Validation Error: Brand ID and Brand Name are required.");
        return res.status(400).send("Brand ID and Brand Name are required.");
    }

    // Add the product brand
    const query = `INSERT INTO ProductBrands (brandID, brandName, brandCountry) VALUES (?, ?, ?)`;
    db.pool.query(query, [brandID, brandName, brandCountry || null], (error, results) => {
        if (error) {
            console.error("Error adding product brand:", error);
            res.status(500).send("Error adding product brand.");
        } else {
            res.redirect('/productBrands?successMessage=Added successfully');
        }
    });
});

// Route to delete a product brand with AJAX
app.delete('/delete-productBrand-ajax', (req, res) => {
    const brandID = parseInt(req.body.id);
    const query = `DELETE FROM ProductBrands WHERE brandID = ?`;
    db.pool.query(query, [brandID], (error, results) => {
        if (error) {
            console.error("Error deleting product brand:", error);
            res.status(500).json({ error: "Failed to delete product brand." });
        } else {
            res.status(200).json({ success: true, message: 'Deleted successfully' });
        }
    });
});

// Route to handle updating a product brand with form submission
app.post('/update-productBrand-form', (req, res) => {
    const { currentBrandID, newBrandID, brandName, brandCountry } = req.body;

    // Validate currentBrandID, newBrandID, and brandName
    if (!currentBrandID || !newBrandID || !brandName) {
        console.error("Validation Error: Current Brand ID, New Brand ID, and Brand Name are required.");
        return res.status(400).send("Current Brand ID, New Brand ID, and Brand Name are required.");
    }

    const currentID = parseInt(currentBrandID);
    const newID = parseInt(newBrandID);

    if (isNaN(currentID) || isNaN(newID)) {
        console.error("Validation Error: Brand IDs must be numbers.");
        return res.status(400).send("Brand IDs must be valid numbers.");
    }

    // Check if the new Brand ID already exists
    const checkQuery = `SELECT * FROM ProductBrands WHERE brandID = ?`;
    db.pool.query(checkQuery, [newID], (checkError, checkResults) => {
        if (checkError) {
            console.error("Error checking new Brand ID:", checkError);
            return res.status(500).send("Error updating product brand.");
        }

        if (checkResults.length > 0 && newID !== currentID) {
            console.error("Validation Error: New Brand ID already exists.");
            return res.status(400).send("New Brand ID already exists. Please choose a different ID.");
        }

        // Update the product brand
        const updateQuery = `UPDATE ProductBrands SET brandID = ?, brandName = ?, brandCountry = ? WHERE brandID = ?`;
        db.pool.query(updateQuery, [newID, brandName, brandCountry || null, currentID], (updateError, updateResults) => {
            if (updateError) {
                console.error("Error updating product brand:", updateError);
                res.status(500).send("Error updating product brand.");
            } else if (updateResults.affectedRows === 0) {
                console.error("No product brand found with the given Current Brand ID.");
                res.status(404).send("Product brand not found.");
            } else {
                res.redirect('/productBrands?successMessage=Updated successfully');
            }
        });
    });
});

// OrderHasProducts Routes-------------------------------------------------
// Route to display OrderHasProducts
app.get('/orderHasProducts', (req, res) => {
    const query = `SELECT * FROM OrderHasProducts ORDER BY orderID ASC, productID ASC`;
    const ordersQuery = `SELECT orderID FROM Orders`;
    const productsQuery = `SELECT productID FROM Products`;

    // Fetch OrderHasProducts
    db.pool.query(query, (error, rows, fields) => {
        if (error) {
            console.error("Database query error:", error);
            res.render('orderHasProducts', { errorMessage: "Error fetching OrderHasProducts." });
        } else {
            db.pool.query(ordersQuery, (ordersError, ordersRows) => {
                if (ordersError) {
                    console.error("Database query error:", ordersError);
                    res.render('orderHasProducts', { errorMessage: "Error fetching Orders." });
                } else {
                    db.pool.query(productsQuery, (productsError, productsRows) => {
                        if (productsError) {
                            console.error("Database query error:", productsError);
                            res.render('orderHasProducts', { errorMessage: "Error fetching Products." });
                        } else {
                            const successMessage = req.query.successMessage;
                            res.render('orderHasProducts', { data: rows, orders: ordersRows, products: productsRows, successMessage: successMessage });
                        }
                    });
                }
            });
        }
    });
});

// Route to add an OrderHasProduct with HTML form
app.post('/add-orderHasProduct-form', (req, res) => {
    const { orderID, productID } = req.body;
    const query = `INSERT INTO OrderHasProducts (orderID, productID) VALUES (?, ?)`;
    db.pool.query(query, [orderID || null, productID || null], (error, results) => {
        if (error) {
            console.error("Error adding OrderHasProduct:", error);
            res.status(500).send("Error adding OrderHasProduct.");
        } else {
            // Display success message
            res.redirect('/orderHasProducts?successMessage=Added successfully');
        }
    });
});

// Route to delete an OrderHasProduct with AJAX
app.delete('/delete-orderHasProduct-ajax', (req, res) => {
    // Split the ID into orderID and productID
    const [orderID, productID] = req.body.id.split('-').map(Number);
    const query = `DELETE FROM OrderHasProducts WHERE orderID = ? AND productID = ?`;
    // Execute the query
    db.pool.query(query, [orderID, productID], (error, results) => {
        if (error) {
            console.error("Error deleting OrderHasProduct:", error);
            res.status(500).json({ error: "Failed to delete OrderHasProduct." });
        } else {
            res.status(200).json({ 
                success: true,
                message: 'Deleted successfully'
            });
        }
    });
});

// Route to handle updating an OrderHasProduct with form submission
app.post('/update-orderHasProduct-form', (req, res) => {
    const { currentOrderID, currentProductID, newOrderID, newProductID } = req.body;

    // Update the OrderHasProduct
    const query = `UPDATE OrderHasProducts SET orderID = ?, productID = ? WHERE orderID = ? AND productID = ?`;
    db.pool.query(query, [newOrderID || null, newProductID || null, currentOrderID, currentProductID], (error, results) => {
        if (error) {
            res.json({ error: 'Failed to update OrderHasProduct.' });
        } else {
            res.json({ success: true });
        }
    });
});

// Location Routes-------------------------------------------------
// Route to display product locations
app.get('/storeLocations', (req, res) => {
    const query = `SELECT * FROM StoreLocations ORDER BY locationID ASC`;
    db.pool.query(query, (error, rows, fields) => {
        if (error) {
            console.error("Database query error:", error);
            res.render('storeLocations', { errorMessage: "Error fetching product locations." });
        } else {
            const successMessage = req.query.successMessage;
            res.render('storeLocations', { data: rows, successMessage: successMessage });
        }
    });
});

// Route to add a product location with HTML form
app.post('/add-storeLocation-form', (req, res) => {
    const { locationID, locationName, address, phone, openHours } = req.body;

    // Validate locationID and locationName
    if (!locationID || !locationName) {
        console.error("Validation Error: Location ID and Location Name are required.");
        return res.status(400).send("Location ID and Location Name are required.");
    }

    // Add the store location
    const query = `INSERT INTO StoreLocations (locationID, locationName, address, phone, openHours) VALUES (?, ?, ?, ?, ?)`;
    db.pool.query(query, [locationID, locationName, address || null, phone || null, openHours || null], (error, results) => {
        if (error) {
            console.error("Error adding store location:", error);
            res.status(500).send("Error adding store location.");
        } else {
            res.redirect('/storeLocations?successMessage=Added successfully');
        }
    });
});

// Route to delete a product location with AJAX
app.delete('/delete-storeLocation-ajax', (req, res) => {
    const locationID = parseInt(req.body.id);
    const query = `DELETE FROM StoreLocations WHERE locationID = ?`;
    db.pool.query(query, [locationID], (error, results) => {
        if (error) {
            console.error("Error deleting product location:", error);
            res.status(500).json({ error: "Failed to delete product location." });
        } else {
            res.status(200).json({ success: true, message: 'Deleted successfully' });
        }
    });
});

// Route to handle updating a product location with form submission
app.post('/update-storeLocation-form', (req, res) => {
    const { currentLocationID, newLocationID, locationName, address, phone, openHours } = req.body;

    // Validate locationID, newLocationID, and locationName
    if (!currentLocationID || !newLocationID || !locationName) {
        console.error("Validation Error: Current Location ID, New Location ID, and Location Name are required.");
        return res.status(400).send("Current Location ID, New Location ID, and Location Name are required.");
    }

    const currentID = parseInt(currentLocationID);
    const newID = parseInt(newLocationID);

    if (isNaN(currentID) || isNaN(newID)) {
        console.error("Validation Error: Location IDs must be numbers.");
        return res.status(400).send("Location IDs must be valid numbers.");
    }

    // Check if the new Location ID already exists
    const checkQuery = `SELECT * FROM StoreLocations WHERE locationID = ?`;
    db.pool.query(checkQuery, [newID], (checkError, checkResults) => {
        if (checkError) {
            console.error("Error checking new Location ID:", checkError);
            return res.status(500).send("Error updating store location.");
        }

        if (checkResults.length > 0 && newID !== currentID) {
            console.error("Validation Error: New Location ID already exists.");
            return res.status(400).send("New Location ID already exists. Please choose a different ID.");
        }

        // Update the store location
        const updateQuery = `UPDATE StoreLocations SET locationID = ?, locationName = ?, address = ?, phone = ?, openHours = ? WHERE locationID = ?`;
        db.pool.query(updateQuery, [newID, locationName, address || null, phone || null, openHours || null, currentID], (updateError, updateResults) => {
            if (updateError) {
                console.error("Error updating store location:", updateError);
                res.status(500).send("Error updating store location.");
            } else if (updateResults.affectedRows === 0) {
                console.error("No store location found with the given Current Location ID.");
                res.status(404).send("Store location not found.");
            } else {
                res.redirect('/storeLocations?successMessage=Updated successfully');
            }
        });
    });
});

// Order Routes-------------------------------------------------
// Route to display orders
app.get('/orders', (req, res) => {
    const query = `SELECT * FROM Orders ORDER BY orderID ASC`;
    const customersQuery = `SELECT customerID FROM Customers`;
    const locationsQuery = `SELECT locationID FROM StoreLocations`;

    // Fetch orders
    db.pool.query(query, (error, rows, fields) => {
        if (error) {
            console.error("Error fetching orders:", error);
            res.status(500).send("Error fetching orders.");
            return;
        }

        // Fetch customers
        db.pool.query(customersQuery, (customersError, customersRows, customersFields) => {
            if (customersError) {
                console.error("Error fetching customers:", customersError);
                res.status(500).send("Error fetching customers.");
                return;
            }

            // Fetch locations
            db.pool.query(locationsQuery, (locationsError, locationsRows, locationsFields) => {
                if (locationsError) {
                    console.error("Error fetching locations:", locationsError);
                    res.status(500).send("Error fetching locations.");
                    return;
                }

                // Display the orders page with the data
                res.render('orders', {
                    data: rows,
                    customers: customersRows,
                    locations: locationsRows,
                    successMessage: req.query.successMessage,
                    errorMessage: req.query.errorMessage
                });
            });
        });
    });
});

// Route to add an order with HTML form
app.post('/add-order-form', (req, res) => {
    const { orderID, customerID, locationID, saleDate, totalPrice } = req.body;
    
    // Validate orderID is positive
    if (orderID <= 0) {
        return res.status(400).send("Order ID must be a positive number.");
    }

    // Set customerID to NULL if it's an empty string
    const query = `INSERT INTO Orders (orderID, customerID, locationID, saleDate, totalPrice) VALUES (?, ?, ?, ?, ?)`;
    db.pool.query(query, [orderID, customerID, locationID, saleDate, totalPrice], (error, results) => {
        if (error) {
            console.error("Error adding order:", error);
            res.status(500).send("Error adding order.");
        } else {
            res.redirect('/orders?successMessage=Added successfully');
        }
    });
});

// Route to delete an order using AJAX
app.delete('/delete-order-ajax', (req, res) => {
    const orderID = parseInt(req.body.id);
    const query = `DELETE FROM Orders WHERE orderID = ?`;
    // Execute the query
    db.pool.query(query, [orderID], (error, results) => {
        if (error) {
            console.error("Error deleting order:", error);
            res.status(500).json({ error: "Failed to delete order." });
        } else {
            res.status(200).json({ success: true, message: 'Deleted successfully' });
        }
    });
});

// Route to get orders
app.get('/get-orders', (req, res) => {
    const query = `SELECT orderID FROM Orders`;
    db.pool.query(query, (error, rows, fields) => {
        if (error) {
            res.status(500).json({ error: 'Failed to fetch orders.' });
        } else {
            res.json({ orders: rows });
        }
    });
});

// Product Routes-------------------------------------------------
// Route to display orders
app.get('/products', (req, res) => {
    const query = `SELECT * FROM Products ORDER BY productID ASC`;
    const brandsQuery = `SELECT brandID FROM ProductBrands`;

    // Fetch orders
    db.pool.query(query, (error, rows, fields) => {
        if (error) {
            console.error("Error fetching orders:", error);
            res.status(500).send("Error fetching orders.");
            return;
        }

        // Fetch brands
        db.pool.query(brandsQuery, (brandsError, brandsRows, brandsFields) => {
            if (brandsError) {
                console.error("Error fetching brands:", brandsError);
                res.status(500).send("Error fetching brands.");
                return;
            }


                // Display the products page with the data
                res.render('products', {
                    data: rows,
                    brands: brandsRows,
                    successMessage: req.query.successMessage,
                    errorMessage: req.query.errorMessage
                });
            });
        });
    });


// Route to add a product with HTML form
app.post('/add-product-form', (req, res) => {
    // Destructure all required fields from request body
    const { productID, productName, price, quantityInStock, quantitySold, productCategory, brandID } = req.body;
    
    // Handle brandID - convert empty string to null
    const brandIDValue = brandID === '' ? null : brandID;

    // SQL query
    const query = `INSERT INTO Products 
        (productID, productName, price, quantityInStock, quantitySold, productCategory, brandID) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    // Query parameters in correct order
    const params = [
        productID,
        productName,
        price,
        quantityInStock,
        quantitySold,
        productCategory,
        brandIDValue
    ];

    // Execute query
    db.pool.query(query, params, (error, results) => {
        if (error) {
            console.error("Error adding product:", error);
            res.status(500).send("Error adding product.");
        } else {
            res.redirect('/products?successMessage=Added successfully');
        }
    });
});

// Route to get products
app.get('/get-products', (req, res) => {
    const query = `SELECT productID FROM Products`;
    db.pool.query(query, (error, rows, fields) => {
        if (error) {
            res.status(500).json({ error: 'Failed to fetch products.' });
        } else {
            res.json({ products: rows });
        }
    });
});

// Route to handle updating an order with form submission
app.post('/update-order-form', (req, res) => {
    const { currentOrderID, newOrderID, customerID, locationID, saleDate, totalPrice } = req.body;

    // Validate newOrderID is positive
    if (newOrderID <= 0) {
        return res.status(400).send("New Order ID must be a positive number.");
    }

    // Set customerID to NULL if it's an empty string
    const customerIDValue = customerID === '' ? null : customerID;

    // Update the order
    const query = `UPDATE Orders SET orderID = ?, customerID = ?, locationID = ?, saleDate = ?, totalPrice = ? WHERE orderID = ?`;
    db.pool.query(query, [newOrderID, customerIDValue, locationID, saleDate, totalPrice, currentOrderID], (error, results) => {
        if (error) {
            console.error("Error updating order:", error);
            res.status(500).send("Error updating order.");
        } else {
            res.redirect('/orders?successMessage=Updated successfully');
        }
    });
});

// Route to manage links
app.get('/manageLinks', (req, res) => {
    res.render('manageLinks', {
        errorMessage: null,
        successMessage: null
    });
});

// Route to delete an order with AJAX
app.delete('/delete-product-ajax', (req, res) => {
    const productID = parseInt(req.body.id);
    const query = `DELETE FROM Products WHERE productID = ?`;
    db.pool.query(query, [productID], (error, results) => {
        if (error) {
            console.error("Error deleting product:", error);
            res.status(500).json({ error: "Failed to delete product." });
        } else {
            res.status(200).json({ success: true, message: 'Deleted successfully' });
        }
    });
});

// Route to get orders
app.get('/get-products', (req, res) => {
    const query = `SELECT productID FROM Products`;
    // Execute the query
    db.pool.query(query, (error, rows, fields) => {
        if (error) {
            res.status(500).json({ error: 'Failed to fetch products.' });
        } else {
            res.json({ products: rows });
        }
    });
});

// Route to get products
app.get('/get-products', (req, res) => {
    const query = `SELECT productID FROM Products`;
    db.pool.query(query, (error, rows, fields) => {
        if (error) {
            res.status(500).json({ error: 'Failed to fetch products.' });
        } else {
            res.json({ products: rows });
        }
    });
});

// Route to handle updating an product with form submission
app.post('/update-product-form', (req, res) => {
    const { currentProductID, newProductID, productName, price, quantityInStock, quantitySold, productCategory, brandID } = req.body; // Fix: Added brandID to the list of parameters

    // Set brandID to NULL if it's an empty string
    const brandIDValue = brandID === '' ? null : brandID;

    const query = `UPDATE Products SET productID = ?, productName = ?, price = ?, quantityInStock = ?, quantitySold = ?, productCategory = ?, brandID = ? WHERE productID = ?`;
    db.pool.query(query, [newProductID, productName, price, quantityInStock, quantitySold, productCategory, brandIDValue, currentProductID], (error, results) => {
        if (error) {
            console.error("Error updating product:", error);
            res.status(500).send("Error updating product.");
        } else {
            res.redirect('/products?successMessage=Updated successfully');
        }
    });
});

//LISTENER----------------------------------------------------------
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});