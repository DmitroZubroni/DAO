import {Web3} from "web3";
import abi from "./abi.json";

class ServiceVoting {

    web3 = new Web3(window.ethereum);
    contractAddess = "0xd2870376f0e53206C3dca4C1273dbF66308C1759";
    contract = new this.web3.eth.Contract(abi, this.contractAddess);

    async buyToken(amount, valueAmount, wallet){
        await this.contract.methods.buyToken(amount).send({from: wallet, value: valueAmount});
    }
    async setProposal( delay, period, proposeType, quorumType, target, amount, wallet) {
        await this.contract.methods.setProposal(delay, period, proposeType, quorumType, target, amount).send({from: wallet});
    }

    async cancelProposal(proposalID, wallet) {
        await this.contract.methods.cancelProposal(proposalID).send({from: wallet});
    }

    async castVote(proposalID, support, amount, wallet){
        await this.contract.methods.castVote(proposalID, support, amount).send({from: wallet});
    }

    async delegateRTK(to, amount, wallet){
        await this.contract.methods.delegateRTK(to, amount).send({from: wallet});
    }

    async callExecute(proposalID, wallet) {
        await this.contract.methods.cancelProposal(proposalID).send({from: wallet});
    }

    async getAllProposalIDs(wallet){
       return await this.contract.methods.getAllProposalIDs().call({from: wallet});
    }


    async getBalance(wallet) {
        return await this.contract.methods.getBalance().call({ from: wallet });
    }

    async getProposalFull(proposalID) {
        return await this.contract.methods.getProposalFull(proposalID).call();
    }

    async getProposalVotes(proposalID) {
        return await this.contract.methods.getProposalVotes(proposalID).call();
    }

    async getVoteData(proposalID) {
        return await this.contract.methods.getVoteData(proposalID).call();
    }
}
export default new ServiceVoting();