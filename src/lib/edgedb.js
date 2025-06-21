import { createClient } from "edgedb";

const client = createClient(); // ✅ only declare once

export default client;
