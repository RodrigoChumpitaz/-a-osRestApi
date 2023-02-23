import app from "./app";


app.listen(app.get('port'), () => {
    try {
        console.log(`Server on port ${app.get('port')}`);
    } catch (error) {
        process.exit(1);
    }
});