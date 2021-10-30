const express = require("express");
const bodyParser = require("body-parser");
const Storage = require("./storage");

const fs = require("fs");
const csv = require("csv-parser");
const { resourceLimits } = require("worker_threads");
const { INSPECT_MAX_BYTES } = require("buffer");

const app = express();
const port = 8080;

Storage.create((error, storage) => {
    if (error) {
        console.log("Failed to create storage", error);
        return;
    }

    storage.createTable((errorCreateTable) => {
        if (errorCreateTable) {
            return;
        }

        app.use(bodyParser.json());

        app.get("/getLastRow", (req, res) => {
            storage.selectLast((errorSelect, row) => {
                if (errorSelect) {
                    console.log("Failed to select", errorSelect);
                    res.json({});
                } else {
                    res.json(row);
                }
            });
        });

        app.get("/getCount", (req, res) => {
            storage.selectCount((errorSelect, row) => {
                if (errorSelect) {
                    console.log("Failed to select", errorSelect);
                    res.json({});
                } else {
                    res.json(row);
                }
            });
        });

        app.get("/getStatistics", (req, res) => {
            storage.selectMonthlyExpenses((errorExpenses, expenses) => {
                if (errorExpenses) {
                    console.log("Failed to select expenses", errorExpenses);
                    res.json({});
                } else {
                    storage.selectMonthlyIncomes((errorIncomes, incomes) => {
                        if (errorIncomes) {
                            console.log("Failed to select incomes", errorIncomes);
                            res.json({});
                        } else {
                            const statistics = {};
                            expenses.forEach((expense) => {
                                statistics[expense.date] = {
                                    expenses: expense.amount,
                                    incomes: 0,
                                    economy_rate: 0
                                };
                            });

                            incomes.forEach((income) => {
                                if (statistics[income.date]) {
                                    statistics[income.date].incomes = income.amount;
                                    if (statistics[income.date].expenses === 0) {
                                        statistics[income.date].economy_rate = 100;
                                    } else {
                                        statistics[income.date].economy_rate = Math.floor((income.amount - statistics[income.date].expenses) / income.amount * 100);
                                    }
                                } else {
                                    statistics[income.date] = {
                                        expenses: 0,
                                        incomes: income.amount,
                                        economy_rate: 100
                                    };
                                }

                            });

                            const months = [];
                            for (const month of Object.keys(statistics)) {
                                months.push({
                                    ...statistics[month],
                                    month
                                });
                            }

                            res.json({months});
                        }
                    });
                }
            });
        });

        app.post("/list", (req, res) => {
            storage.list(req.body.limit, req.body.offset, (error, rows) => {
                if (error) {
                    console.log("Failed to list", error);
                    res.json({rows: []});
                } else {
                    res.json({rows});
                }
            });
        });

        app.post("/insertRow", (req, res) => {
            const date = req.body.date;
            const amount = req.body.amount;
            const place = req.body.place ? req.body.place : null;
            const category = req.body.category;
            const subcategory = req.body.subcategory;
            const type = req.body.type;
            const description = req.body.description ? req.body.description : null;
            storage.insert(date, amount, place, category, subcategory, type, description, (error) => {
                if (error) {
                    console.log("Failed to insert", error);
                }

                res.json({});
            });
        });

        app.post("/parseFile", (req, res) => {
            // const items = [];
            // fs.createReadStream('./data/cheltuieli.csv')
            //     .pipe(csv())
            //     .on('data', (data) => {items.push(data);})
            //     .on('end', () => {
            //         const processItem = (index) => {
            //             if (index >= items.length) {
            //                 endFunction();
            //             } else {
            //                 const data = items[index];

            //                 const date = data.Date.split("/").reverse().join("-");
            //                 const amount = data.Amount;
            //                 const place = data.Place !== "" ? data.Place : null;
            //                 const category = data.Category;
            //                 const subcategory = data.Subcategory !== "" ? data.Subcategory : "other";
            //                 const type = data.Type === "cheltuieli" ? 0 : 1;
            //                 const description = data.Description !== "" ? data.Description : null;

            //                 storage.insert(date, amount, place, category, subcategory, type, description, (error) => {
            //                     if (error) {
            //                         console.log("Failed to insert", error);
            //                         endFunction();
            //                     } else {
            //                         processItem(index + 1);
            //                     }
            //                 });
            //             }
            //         };

            //         const endFunction = () => {
            //             res.json({});
            //         };

            //         processItem(0);
            //     });
            res.end();
        });

        app.listen(port, () => {
            console.log("We're listening booy");
        });
    });
});