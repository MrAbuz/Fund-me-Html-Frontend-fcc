//in nodejs we been using the require() keyword to import dependencies.
//in frontend javascript you can't use require. we use the 'import' keyword which is really the better way to do this
//this is one of the first differences between nodejs and frontend js

//we don't want to install ethers with a node modules package because we're doing the raw html/javascript way.
//In future lessons with node.js we're gonna do yarn add ethers kinda like we normaly seen. For frameworks like react and nextjs that we're gonna use, they'll automatically
//convert those yarn add packages into their frontend versions. But for this section, this is how we'll import our ethers package.
//Nós podemos importar o ethers package através de node js, ou no web browser, copiar a ethers library(front end edition) para o nosso webserver.
//Ou seja, criar o nosso próprio ficheiro ethers (ethers-5.6.esm.min.js) e importar daí:

import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "Connected!"
    } else {
        fundButton.innerHTML = "Please install metamask!"
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        document.getElementById("balanceLabel").innerHTML =
            ethers.utils.formatEther(balance)
        console.log(ethers.utils.formatEther(balance)) //ethers.utils.formatEther() is "to make reading ethers formatted numbers much easier to read"
        //não percebi a 100% mas testei sem isto (apenas com 'balance') e devolveu um bigNumber.
    }
}
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        //to send a transaction we always need:
        // 1) a provider/connection to the blockchain;
        // 2) signer/wallet;
        // 3) contract with the ABI and the address
        const provider = new ethers.providers.Web3Provider(window.ethereum) //web3provider really similar to JsonRpcProvider, but to connect to wallets
        const signer = provider.getSigner() //returns the wallet that is connected at that moment to the metamask
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
                //we want the frontend to give the users some indication if the transaction went through:
                // 1) we can either, listen for the tx to be mined; (we'll use this in this one)
                // 2) listen for an event (we'll learn in the next lesson)
            })
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}
async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    //we dont want this to be an async function, we're gonna use javascript's promise
    //we're gonna use the await when we call the function in fund()
    console.log(`Mining ${transactionResponse.hash}...`)

    //provider.once(eventName, listener) -> the way this works is we listen for some event, and once that event fires, we call other function that we've defined (isto veio dos ethers docs)
    //here we'll wait for the transactionReceipt and once it fires, we call some listener function that we'll define.
    //so once this provider.once sees that there is an transaction hash, its gonna give the transactionReceipt as an input parameter to our listener function
    //we're gonna use a promise() and a promise takes a function itself as an input parameter
    //resolve -> if this function works correctly call this resolve function
    //we're not gonna write the reject function but in the future if we were to run this into production we'd add some timeout as the reject parameter.
    //this promise is gonna be done when the listener finishes listening (and calls the resolve()), and reject if there was some type of timeout (faz sentido, mandas uma tx,
    // se não for minada fica na queue, e só consideras que falha se tiveres um timeout senão está na queue para algum momento ser minada)
    //This promise only returns when resolve() or reject() is called, e no fund() chamamos isto com await por isso vai esperar pela promise.
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve() //only once this transaction gets fired where it receives the transactionReceipt (transaction was mined) are we gonna resolve this promise (call resolve())
            //resolve() is inside the provider.once so that only when the event is triggered (transactionResponse.hash), this function is called, and at that point we're
            //safe to resolve because at that point the transaction has been mined. Fora de provider.once resolve() dava trigger antes de transactionResponse.has acontecer
            //porque a função não é async, o que resolveria a promise sem transactionResponse.hash se verificar.
            //we're telling the promise to only resolve when transactionResponse.hash is found, visto que resolve() está inside de provider.once.
            //Assim, a promise ta dependente do evento ser chamado, que é exatamente o que nós queremos verificar que acontece (confuso mas percebi))
        })
        //in future lessons this listenForTransactionMine is gonna be abstracted away for us and life will be much easier, but its important to understand whats going on here.
    })
}

//
//
//
//
//para me lembrar, criámos um segundo terminal e demos cd ..; cd hardhat-fund-me-fcc; yarn hardhat node; para criar o node através do outro repo e sacar a address do contrato
//deployed e uma private key para usar sem ter que ter dois vscode repos abertos (lembrar que quando criamos um node, os contratos no folder deploy sao sempre
// automaticamente deployed)

//Criámos uma network hardhat-localhost no metamask para usar onde introduzimos o RPC-URL que sacamos do localhost que criámos no terminal.
//E importamos uma das private keys do localhost que criámos para o metamask, porque são as conectadas à localhost e que têm money.
//            (metamask -> bola superior direita das accounts -> import account -> select type: private key; introduzir a private key do localhost; voilá)

//Garantir que estamos conectados à acc da private key que introduzmos. Tava-me a bugar e a dizer que não tinha saldo mas era porque continuava conectado à primeira conta,
//apesar de estar a selecionar a outra. E dizia-me connected mas, era conected à primeira. Dar disconnect e conectar à conta 2.

//Se der um erro na consola (ou falar a transaçao) de "nounce too high" é porque fechámos o hardhat node e reabrimos, e quando abre o nonce no hardhat node da reset mas na
// metamask não, e como não coincidem da bug. Temos que na metamask ir ao canto superior direito das contas -> settings -> advanced -> reset account.
