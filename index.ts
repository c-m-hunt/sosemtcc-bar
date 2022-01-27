import { Client, Environment } from 'square'

require('dotenv').config()

const client = new Client({
    environment: Environment.Production,
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
  })


const getItems = async () => {
    const catalogApi = client.catalogApi;
    const items = await catalogApi.listCatalog();
    return items;
}


getItems().then(items => {
    if (items.result.objects) {
        const filteredItems = items.result.objects.filter(item => 1===1);
        for (const obj of filteredItems) {
            console.log(obj)
        }
    }
});