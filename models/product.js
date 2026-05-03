const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'products.json'
);

const getProductsFromFile = data => {
    fs.readFile(
        p,
        (error, fileContent) => {
            if (error) {
                data([]);
            } else {
                data(JSON.parse(fileContent));
            }
        }
    );
}

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        getProductsFromFile(
            data => {
                data.push(this);
                fs.writeFile(
                    p,
                    JSON.stringify(data),
                    error => {
                        console.log(error);
                    }
                );
            }
        );
    }

    static fecthProducts(data) {
        getProductsFromFile(data);
    }
}
