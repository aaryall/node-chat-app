import {server} from './server.js';
import { connectToDatabase } from './config.js';
server.listen(3000, () => {
    console.log("Listening on port 3000");
    connectToDatabase();
});