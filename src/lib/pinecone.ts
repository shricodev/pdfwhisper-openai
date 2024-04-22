import { IndexList, Pinecone } from "@pinecone-database/pinecone";
import { delay } from "@/lib/utils";

let pineconeClientInstance: Pinecone | null = null;

export async function getPineconeClient() {
  if (!pineconeClientInstance) {
    pineconeClientInstance = await initPineconeClient();
  }

  return pineconeClientInstance;
}

async function createIndex(client: Pinecone, indexName: string) {
  try {
    const indexInitTimeout = process.env.INDEX_INIT_TIMEOUT_MS;
    if (!indexInitTimeout) return null;
    await client.createIndex({
      name: indexName,
      dimension: 1536,
      metric: "cosine",
    });
    console.log(
      `Waiting for ${
        parseInt(indexInitTimeout, 10) / 1000
      } seconds for index initialization to complete...`,
    );
    await delay(parseInt(indexInitTimeout, 10));
    console.log("Index created !!");
  } catch (error) {
    console.error("error ", error);
    throw new Error("Index creation failed");
  }
}

// Function to check if an index with a specific name exists
function indexExists(indexes: IndexList, indexName: string) {
  return indexes.some((index) => index.name === indexName);
}

// Initialize index and ready to be accessed.
async function initPineconeClient() {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
      environment: process.env.PINECONE_ENVIRONMENT!,
    });
    const indexName = process.env.PINECONE_INDEX_NAME;
    if (!indexName) return null;

    const existingIndexes = await pinecone.listIndexes();

    if (!indexExists(existingIndexes, indexName)) {
      createIndex(pinecone, indexName);
    } else {
      console.log("The index with the name already exists.");
    }

    return pinecone;
  } catch (error) {
    console.error("error", error);
    throw new Error("Failed to initialize Pinecone Client");
  }
}
