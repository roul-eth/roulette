storage = require('nft.storage');
fs = require('fs-extra');
dotenv = require('dotenv');

dotenv.config(
    {
        path: '../.env'
    }
);

var args = process.argv.slice(2);
var name = args[0];
var image = args[1];
var desc = args[2];

console.log("name: " + name);
console.log("image: " + image);
console.log("description: " + desc);

/** Script to upload new NFT metadata to IPFS using the NFT.Storage service
*   the resulting ipfs url would be used when minting the NFT
*   usage: node nft-storage-upload.js <name> <image_path> <description>
*/
async function main() {
    // setup nft storage client
    const nftStorageClient = new storage.NFTStorage({ token: process.env.NFTSTORAGE_KEY });
    const metadata = await nftStorageClient.store({
        name: name,
        description: desc,
        image: new storage.File([await fs.promises.readFile(image)], name, { type: 'image/jpg' })
    })
    console.log('IPFS URL:', metadata.url)
    console.log('json contents:\n', metadata.data)
    console.log(
        'json contents with IPFS gateway URLs:\n',
        metadata.embed()
    )
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });