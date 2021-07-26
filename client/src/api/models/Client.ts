import Dataset from "./Dataset";

type Client = {
    id: string;
    name: string;
    datasets: Dataset[];
};

export default Client;