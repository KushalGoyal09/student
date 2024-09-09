import express from 'express';
import 'express-async-errors'
import Secret from './utils/secrets';
import notFound from './middleware/notFound';
import errorHandler from './middleware/errorHandler';
const port = Secret.PORT
const app = express();

app.use(express.json());


app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server listening to the port ${port}`)
})