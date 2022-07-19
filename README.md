# P3-NFT
storage nft metadata with IPFS

## 使用方法
1. 选择使用的图片
2. 填写生成的nft的metadata的name和description
3. 点击upload，图片将会上传到IPFS，返回图片的地址，然后返回一个metadata.json的文件的在IPFS中的rul
4. 拷贝这个url
5. 粘贴到constract/scripts/mint-nft.js中，作为的mintNFT方法的入参
6. 先使用编译合约
```js
npx hardhat compile
```
7. 然后部署合约
```js
npx hardhat --network goerli run scripts/deploy.js 
```
8. 最后先拷贝合约生成的abi文件路径作为mint-nft.js中contract引用路径；根据返回的合约的hash修改mint-nft.js文件中的contractAddress值，使用脚本mint fnt
```js
node scripts/mint-nft.js 
```