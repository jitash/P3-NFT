require("dotenv").config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const {createAlchemyWeb3} = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/P3NFT.sol/P3NFT.json");
const contractAddress = "0x1b406EdDF8376FBB32E82a31C63ee02D69c274A6"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest');
    const tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': '500000',
        'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
    }

    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    signPromise.then((signedTx) => {
        web3.eth.sendSignedTransaction(
            signedTx.rawTransaction,
            function (err, txHash) {
                if (!err) {
                    console.log(
                        "The hash of your transaction is: ",
                        txHash,
                        "\nCheck Alchemy's Mempool to view the status of your transaction!"
                    )
                } else {
                    console.log(
                        "Something went wrong when submitting your transaction:",
                        err
                    )
                }
            })
    }).catch((err) => {
        console.log(" Promise failed: ", err)
    });
}
mintNFT("ipfs://bafybeiga2gniu3dvh45jinah3zycalfn4akkz5dc6ux4m6bdjcgxkrdy2q/metadata.json")