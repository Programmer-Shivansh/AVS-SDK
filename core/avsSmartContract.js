const Web3 = require('web3');
const fs = require('fs');

class AVSSmartContract {
    constructor(contractName, providerUrl) {
        this.contractName = contractName;
        this.web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
        this.contract = null;
    }

    async deploy(contractPath, constructorArgs) {
        const contractSource = fs.readFileSync(contractPath, 'utf8');
        const compiledContract = await this.web3.eth.compile.solidity(contractSource);

        const contractInstance = new this.web3.eth.Contract(compiledContract.abi);
        const deployOptions = {
            data: compiledContract.evm.bytecode.object,
            arguments: constructorArgs,
        };

        const accounts = await this.web3.eth.getAccounts();
        const deployTx = contractInstance.deploy(deployOptions);

        const receipt = await deployTx.send({
            from: accounts[0],
            gas: 1500000,
            gasPrice: '30000000000'
        });

        this.contract = receipt;
        console.log(`Contract deployed at address: ${this.contract.options.address}`);
    }

    async registerOperator(operatorAddress) {
        if (!this.contract) {
            console.log("Contract not deployed.");
            return;
        }

        // Assuming a method `registerOperator` exists in the registry contract
        const tx = await this.contract.methods.registerOperator(operatorAddress).send({ from: accounts[0] });
        console.log(`Operator registered with transaction hash: ${tx.transactionHash}`);
    }

    async submitTask(taskData) {
        const tx = await this.contract.methods.createNewTask(taskData).send({ from: accounts[0] });
        console.log(`Task submitted with transaction hash: ${tx.transactionHash}`);
    }

    async getTaskResult(taskId) {
        const result = await this.contract.methods.getTaskResult(taskId).call();
        console.log(`Task result: ${result}`);
        return result;
    }
}

module.exports = AVSSmartContract;

// const Web3 = require('web3');
// const fs = require('fs');

// class AVSSmartContract {
//     constructor(contractName, providerUrl) {
//         this.contractName = contractName;
//         this.web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
//         this.contract = null;
//     }

//     async deploy(contractPath, constructorArgs) {
//         const contractSource = fs.readFileSync(contractPath, 'utf8');
//         const compiledContract = await this.web3.eth.compile.solidity(contractSource);

//         const contractInstance = new this.web3.eth.Contract(compiledContract.abi);
//         const deployOptions = {
//             data: compiledContract.evm.bytecode.object,
//             arguments: constructorArgs,
//         };

//         const accounts = await this.web3.eth.getAccounts();
//         const deployTx = contractInstance.deploy(deployOptions);
        
//         const receipt = await deployTx.send({
//             from: accounts[0],
//             gas: 1500000,
//             gasPrice: '30000000000'
//         });

//         this.contract = receipt;
//         console.log(`Contract deployed at address: ${this.contract.options.address}`);
//     }

//     async callFunction(functionName, args) {
//         if (!this.contract) {
//             console.log("Contract not deployed.");
//             return;
//         }

//         const result = await this.contract.methods[functionName](...args).call();
//         console.log(`Result from ${functionName}:`, result);
//         return result;
//     }
// }

// module.exports = AVSSmartContract;
