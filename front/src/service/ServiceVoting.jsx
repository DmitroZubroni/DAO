import {Web3} from "web3";
import abi from "./abi.json";

class ServiceVoting {

    web3 = new Web3(window.ethereum);
    contractAddess = "0x980a5b0D6C7968E0492cF037D102539102d76242";
    contract = new this.web3.eth.Contract(abi, this.contractAddess);

    async buyToken(amount, valueAmount, wallet){
        await this.contract.methods.buyToken(amount).send({from: wallet, value: valueAmount});
    }
    async setProposal( delay, period, proposeType,  quorumType, params, wallet) {
        await this.contract.methods.setProposal(delay, period, proposeType,  quorumType, params).send({from: wallet});
    }

    async cancelProposal(proposalID, wallet) {
        await this.contract.methods.cancelProposal(proposalID).send({from: wallet});
    }

    async castVote(proposalId, support, amount, wallet){
        await this.contract.methods.castVote(proposalId, support, amount).send({from: wallet});
    }

    async delegateRTK(to, amount, wallet){
        await this.contract.methods.delegateRTK(to, amount).send({from: wallet});
    }

    async callExecute(proposalID, wallet) {
        await this.contract.methods.cancelProposal(proposalID).send({from: wallet});
    }

    async getProposes(wallet){
       return await this.contract.methods.getProposes().call({from: wallet});
    }


    async getBalance(wallet) {
        return await this.contract.methods.getBalance().call({ from: wallet });
    }

    async getProposal(proposalID, wallet){
       return await this.contract.methods.getProposes(proposalID).call({from: wallet, });
    }


}
export default new ServiceVoting();