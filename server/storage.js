const sqlite = require("sqlite3");

class Expenses {
    constructor(database) {
        this.database = database;
    }

    static create(callback) {
        new sqlite.Database("./data/expenses.db", sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE, function(error) {
            if (error) {
                console.log("Failed to open the database", error);
                callback(error);
            } else {
                console.log("Successfuly opened the database");
                callback(null, new Expenses(this));
            }
        });
    }

    createTable(callback) {
        this.database.run(`
            CREATE TABLE IF NOT EXISTS expense (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date DATE NOT NULL,
                amount FLOAT(32,2) NOT NULL,
                place VARCHAR(100) NULL DEFAULT NULL,
                category VARCHAR(100) NOT NULL,
                subcategory VARCHAR(100) NOT NULL,
                type VARCHAR(100) NOT NULL,
                description VARCHAR(100) NULL DEFAULT NULL
            )
        `, (result, error) => {
            if (error) {
                console.log("Failed to create table", error);
                callback(error);
            } else {
                console.log("Successful", result);
                callback(null);
            }
        });
    }

    insert(date, amount, place, category, subcategory, type, description, callback) {
        this.database.run(`
            INSERT INTO expense (date, amount, place, category, subcategory, type, description) values (?, ?, ?, ?, ?, ?, ?)
        `, [date, amount, place, category, subcategory, type, description], function(error) {
            if (error) {
                console.log("Insert failed", error);
                callback(error);
            } else {
                console.log("Insert succeeded", this.last_id);
                callback(null);
            }
        });
    }

    selectLast(callback) {
        this.database.get(`
            SELECT *
            FROM expense
            ORDER BY id DESC
            LIMIT 1
        `, function(error, row) {
            if (error) {
                callback(error);
            } else {
                callback(null, row);
            }
        });
    }

    selectCount(callback) {
        const query = `
            SELECT COUNT(id) AS count
            FROM expense
        `;

        this.database.get(query, function(error, row) {
            if (error) {
                callback(error);
            } else {
                callback(null, row);
            }
        });
    }

    selectMonthlyExpenses(callback) {
        const query = `
            SELECT
                SUM(amount) as amount,
                STRFTIME('%m/%Y', date) as date
            FROM expense
            WHERE type = 0
            GROUP BY STRFTIME('%m/%Y', date)
            ORDER BY STRFTIME('%m/%Y', date)
        `;

        this.database.all(query, function(error, rows) {
            if (error) {
                callback(error);
            } else {
                callback(null, rows);
            }
        });
    }

    selectMonthlyIncomes(callback) {
        const query = `
            SELECT
                SUM(amount) as amount,
                STRFTIME('%m/%Y', date) as date
            FROM expense
            WHERE type = 1
            GROUP BY STRFTIME('%m/%Y', date)
            ORDER BY STRFTIME('%m/%Y', date)
        `;

        this.database.all(query, function(error, rows) {
            if (error) {
                callback(error);
            } else {
                callback(null, rows);
            }
        });
    }

    list(limit, offset, callback) {
        const query = `SELECT * FROM expense ORDER BY id DESC LIMIT ? OFFSET ?`;

        this.database.all(query, [limit, offset], function(error, rows) {
            if (error) {
                callback(error);
            } else {
                callback(null, rows);
            }
        });
    }
}

module.exports = Expenses;