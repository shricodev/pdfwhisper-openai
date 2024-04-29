import { IndexList, Pinecone, ServerlessSpecCloudEnum } from "@pinecone-database/pinecone";
import { delay } from "@/lib/utils";

let pineconeClientInstance: Pinecone | null = null;

export async function getPineconeClient() {
  if (!pineconeClientInstance) {
    pineconeClientInstance = await initPineconeClient();
  }
  if (!pineconeClientInstance) throw new Error("Failed to initilaize the pinecone client.")

  return pineconeClientInstance;
}

async function createIndex(client: Pinecone, indexName: string) {
  try {
    const indexInitTimeout = process.env.PINECONE_INDEX_INIT_TIMEOUT;
    if (!indexInitTimeout) return null;
    await client.createIndex({
      name: indexName,
      dimension: 1536,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: process.env.PINECONE_CLOUD_PROVIDER! as ServerlessSpecCloudEnum,
          region: process.env.PINECONE_CLOUD_REGION!
        }
      }
    });
    console.log(
      `INFO: Waiting for ${parseInt(indexInitTimeout, 10) / 1000
      } seconds for index initialization to complete...`,
    );
    await delay(parseInt(indexInitTimeout, 10));
  } catch (error) {
    throw new Error("Index creation failed");
  }
}

// Function to check if an index with a specific name exists
function indexExists(indexes: IndexList, indexName: string) {
  return indexes.indexes?.some((index) => index.name === indexName)
}

// Initialize index and ready to be accessed.
async function initPineconeClient() {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const indexName = process.env.PINECONE_INDEX_NAME;
    if (!indexName) return null;

    const existingIndexes = await pinecone.listIndexes();

    if (!indexExists(existingIndexes, indexName)) {
      createIndex(pinecone, indexName);
    } else {
      console.log("INFO: The index with the name already exists.");
    }

    return pinecone;
  } catch (error) {
    throw new Error("Failed to initialize Pinecone Client");
  }
}
