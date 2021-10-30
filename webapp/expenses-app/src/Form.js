import * as React from "react";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";

function Form(props) {
    const categoryOptions = React.useMemo(() => [
        {label: "Categ1"},
        {label: "Categ2"}
    ], []);

    const subcategoryOptions = React.useMemo(() => [
        {label: "Subcategory1"},
        {label: "Subcategory2"}
    ], []);

    const [amount, setAmount] = React.useState();
    const [category, setCategory] = React.useState();
    const [subcategory, setSubcategory] = React.useState();

    const onAmountChange = React.useCallback((event) => {
        setAmount(event.target.value);
    }, [setAmount]);

    const onCategoryChange = React.useCallback((event, newValue) => {
        setCategory(newValue);
    }, [setCategory]);

    const onSubcategoryChange = React.useCallback((event, newValue) => {
        setSubcategory(newValue);
    }, [setSubcategory]);

    const onFormSubmit = React.useCallback((event) => {
        // props.client.addExpense({});
        alert({
            amount,
            category,
            subcategory
        });
        event.preventDefault();
    }, [amount, category, subcategory]);

    return (
        <form onSubmit={onFormSubmit}>
            <TextField
                label="Amout"
                type="number"
                value={amount} onChange={onAmountChange}
            />
            <Autocomplete
                disablePortal
                options={categoryOptions}
                value={category}
                onChange={onCategoryChange}
                renderInput={(params) => <TextField {...params} label="Category" />}
            />
            <Autocomplete
                disablePortal
                options={subcategoryOptions}
                value={subcategory}
                onChange={onSubcategoryChange}
                renderInput={(params) => <TextField {...params} label="Subcategory" />}
            />
            <Button label="Submit" type="submit" />
        </form>
    );
}

export default Form;