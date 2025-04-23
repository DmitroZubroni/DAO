import {Web3} from "web3";
import abi from "./abi.json";

class ServiceVoting {

    web3 = new Web3(window.ethereum);
    contractAddess = "0xcfea908CF0fdc3B0E317902B94036aEC89e4f107";
    contract = new this.web3.eth.Contract(abi, this.contractAddess);

    async buyToken(amount, valueAmount, wallet){
        await this.contract.methods.buyToken(amount).send({from: wallet, value: valueAmount});
    }
    async setProposal( delay, period, proposeType, quorumType, target, amount, valueAmount, wallet) {
        await this.contract.methods.setProposal(delay, period, proposeType, quorumType, target, amount).send({from: wallet, value: valueAmount});
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

    async getAllProposalIDs(wallet){
       return await this.contract.methods.getAllProposalIDs().call({from: wallet});
    }


    async getBalance(wallet) {
        return await this.contract.methods.getBalance().call({ from: wallet });
    }

    async getProposalFull(proposalID, wallet) {
        return await this.contract.methods.getProposalFull(proposalID).call({ from: wallet });
    }

    async getProposalVotes(proposalID, wallet) {
        return await this.contract.methods.getProposalVotes(proposalID).call({ from: wallet });
    }

    async getVoteData(proposalID, wallet) {
        return await this.contract.methods.getVoteData(proposalID).call({ from: wallet });
    }
}
export default new ServiceVoting();