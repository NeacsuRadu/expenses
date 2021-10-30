import {Grid} from "@mui/material";
import {Paper} from "@mui/material";

import List from "./List";
import Form from "./Form";

function Home(props) {
    return (
        <Grid container>
            <Grid item xs={6}><Paper><Form client={props.client} /></Paper></Grid>
            <Grid item xs={6}><Paper><List /></Paper></Grid>
        </Grid>
    );
}

export default Home;