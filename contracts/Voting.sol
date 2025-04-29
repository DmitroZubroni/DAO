// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Governor, GovernorVotesQuorumFraction, GovernorVotes, GovernorCountingSimple, IVotes} from "./GovernanceBundle.sol";
import {ProfiCoin, RTKCoin} from "./Tokens.sol";

contract MyGovernance is
    Governor,
    GovernorVotesQuorumFraction,
    GovernorCountingSimple
{
    // Типы предложений
    enum ProposeType {
        A,
        B,
        C,
        D,
        E,
        F
    }

    // Поддерживаемые механизмы кворума
    enum QuorumMechanism {
        SimpleMajority,
        SuperMajority,
        Weighted
    }

    // Структура, описывающая информацию о предложении
    struct ProposeLib {
        uint256 proposeId;
        address proposer;
        address[] targets;
        uint256[] values;
        bytes[] calldatas;
        uint256 voteEnd;
        ProposeType proposeType;
        QuorumMechanism quorumType;
        ProposalState status;
    }

    // Маппинг ID предложения -> счетчик голосов
    mapping(uint256 => ProposalVote) private _proposalVotes;

    // Пользователь уже голосовал по предложению
    mapping(uint256 => mapping(address => bool)) public customHasVoted;

    // список проголосовавших
    mapping(uint256 => address[]) public votersForProposal;

    // Членство в DAO
    mapping(address => bool) public isMember;

    // маппинг всех предложений
    mapping(uint256 => ProposeLib) private proposeMapping;

    // мапинг для определения того каким количеством проголосовал пользователь по определённому голосованию
    mapping(uint256 => mapping(address => uint256)) public lockedTokens;

    // Инстансы токенов
    ProfiCoin public profiCoin;
    RTKCoin public rtkCoin;

    // Настройки голосования
    uint32 public delay = 0;
    uint48 public period = 12;

    // сила profi
    uint256 profiPower = 3;

    // сила wrap токена
    uint256 rtkPower = 6;

    // список id для вывода предложений на фронте
    uint256[] private allProposalIDs;

    /// @notice Ограничение: только участник DAO
    modifier onlyMember() {
        require(isMember[msg.sender], unicode"Только участники DAO");
        _;
    }

    // Конструктор: инициализация токенов, участников и делегирования
    constructor(
        address tom,
        address ben,
        address rick,
        address jack,
        address _profiCoin,
        address _rtkCoin
    )
        Governor("DAO")
        GovernorVotes(IVotes(_profiCoin))
        GovernorVotesQuorumFraction(1)
    {
        profiCoin = ProfiCoin(_profiCoin);
        rtkCoin = RTKCoin(_rtkCoin);

        // Добавляем участников DAO
        isMember[tom] = true;
        isMember[ben] = true;
        isMember[rick] = true;

        // Делегируем системные токены
        profiCoin.delegate(tom);
        profiCoin.delegate(ben);
        profiCoin.delegate(rick); 
        profiCoin.delegate(jack);

        // Выпускаем RTK-токены
        rtkCoin.mint(address(this), 20_000_000 * 10**12);
    }

    //  Задержка перед голосованием
    function votingDelay() public view override returns (uint256) {
        return delay;
    }

    // Длительность голосования
    function votingPeriod() public view override returns (uint256) {
        return period;
    }

    ///  Купить RTK-токены
    function buyToken(uint256 amount) external payable {
        require(
            amount * rtkCoin.price() <= msg.value,
            unicode"Недостаточно средств"
        );
        rtkCoin.transfer(msg.sender, amount);
    } 

    //  Подсчет голосовой силы пользователя (PROFI и RTK)
    function _calculateVotingPower(address _member, uint256 amount)
        private
        view
        returns (uint256)
    {
        uint256 profiP = amount / profiPower;
        uint256 rtkP =  rtkCoin.getVotes(_member) / rtkPower;
        return profiP + rtkP;
    }

    function _quorumReached(uint256 proposalId)
        internal
        view
        override(Governor, GovernorCountingSimple)
        returns (bool)
    {
        ProposalVote storage vote = _proposalVotes[proposalId];
        QuorumMechanism quorumType = proposeMapping[proposalId].quorumType;
        uint256 totalVotes = vote.againstVotes + vote.forVotes;

        if (quorumType == QuorumMechanism.Weighted) {
            // Голоса по весу: зависит от количества токенов
            return vote.forVotes > vote.againstVotes;
        } else if (quorumType == QuorumMechanism.SuperMajority) {
            //Супер большинство: 2/3 голосов
            return vote.forVotes * 3 > totalVotes * 2;
        } else if (quorumType == QuorumMechanism.SimpleMajority) {
            //Простое большинство: 50% +1 голос
            return totalVotes / 2 + 1 < vote.forVotes;
        }
        revert(
            unicode"Ошибка в 'DAO._quorumReached' QuorumTypes doesn't exist"
        );
    }

    // Добавить участника в DAO
    function addMember(address _member) external onlyGovernance {  
        if (!isMember[_member]) {
            isMember[_member] = true;
        }
    }

    //  Удалить участника из DAO
    function removeMember(address _member) external onlyGovernance {
        require(isMember[_member], unicode"Участник не найден");
        isMember[_member] = false;
    }

    // Установить новую силу голосования для PROFI
    function setProfiPower(uint256 newProfiPower) external onlyGovernance {
        profiPower = newProfiPower;
    }

    // Установить новую силу голосования для RTK
    function setRtkPower(uint256 newRtkPower) external onlyGovernance {
        rtkPower = newRtkPower;
    }

    //  Делегирование RTK-токенов (не DAO-участниками)
    function delegateRTK(address to) external {
        require(isMember[to], unicode"Делегировать можно только участнику DAO");
        require(rtkCoin.balanceOf(msg.sender) > 0, unicode"Нет RTK токенов для делегирования");
        rtkCoin.delegate(to); 
    }

    function setProposal(
        uint32 _delay,
        uint48 _period,
        ProposeType proposeType,
        QuorumMechanism quorumType,
        address target,
        uint256 amount
    ) external onlyMember returns (uint256) {
        // устанавливаем задержку и период
        delay = _delay;
        period = _period;
     
        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);

        if (proposeType == ProposeType.A || proposeType == ProposeType.B) {
            targets[0] = target;
            values[0] = amount * 1 ether;
            calldatas[0] = abi.encodeWithSignature(
                "transfer(uint256)",
                amount * 1 ether
            ); // Передаем в wei;
        } else if (proposeType == ProposeType.C) {
            // добавление нового участника
            targets[0] = target;
            calldatas[0] = abi.encodeWithSignature(
                "addMember(address)",
                target
            );
        } else if (proposeType == ProposeType.D) {
            // удаление участника
            targets[0] = target;
            calldatas[0] = abi.encodeWithSignature(
                "removeMember(address)",
                target
            );
        } else if (proposeType == ProposeType.E) {
            // изменение ProfiPower
            targets[0] = address(this);
            values[0] = amount;
            calldatas[0] = abi.encodeWithSignature(
                "setProfiPower(uint256)",
                amount
            );
        } else if (proposeType == ProposeType.F) {
            // изменение RtkPower
            targets[0] = address(this);
            values[0] = amount;
            calldatas[0] = abi.encodeWithSignature(
                "setRtkPower(uint256)",
                amount
            );
        }

        // создаём предложение
        uint256 ID = super.propose(targets, values, calldatas, "");

        // сохраняем метаданные
        proposeMapping[ID] = ProposeLib({
            proposeId: ID,
            targets: targets,
            values: values,
            calldatas: calldatas,
            proposer: msg.sender,
            voteEnd: uint256(block.timestamp + _period),
            proposeType: proposeType,
            quorumType: quorumType,
            status: ProposalState.Active
        });

        return ID;
    }

    // Проголосовать за предложение
    function castVote(
        uint256 proposalID,
        bool support,
        uint256 amount
    ) public returns (uint256) {
        require(
            !customHasVoted[proposalID][msg.sender],
            unicode"Уже голосовал"
        );

        ProposalVote storage vote = _proposalVotes[proposalID];

        uint256 weight = _calculateVotingPower(msg.sender, amount);

        if (support == false) {
            vote.againstVotes += weight;
        } else if (support == true) {
            vote.forVotes += weight;
        }
        profiCoin.transfer(msg.sender, address(this), amount);
        customHasVoted[proposalID][msg.sender] = true;
        // Сохраняем только количество заблокированных токенов
        lockedTokens[proposalID][msg.sender] = amount;
        // Добавляем пользователя в список проголосовавших
        votersForProposal[proposalID].push(msg.sender);
        return amount;
    }

    //  Отменить предложение (только инициатор)
    function cancelProposal(uint256 proposalID) external onlyMember {
        ProposeLib storage prop = proposeMapping[proposalID];
        require(
            msg.sender == prop.proposer,
            unicode"Только инициатор может отменить"
        );

        // Возвращаем токены всем проголосовавшим пользователям
        address[] storage voters = votersForProposal[proposalID];

        for (uint256 i = 0; i < voters.length; i++) {
            address voter = voters[i];
            uint256 amount = lockedTokens[proposalID][voter];
            if (amount > 0) {
                profiCoin.transfer(address(this), voter, amount);
                lockedTokens[proposalID][voter] = 0; // Обнуляем заблокированные токены
            }
        }

        super.cancel(
            prop.targets,
            prop.values,
            prop.calldatas,
            keccak256(abi.encodePacked(""))
        );
    }

    function executePropose(uint256 proposalId)
        public
        payable
        returns (uint256)
    {
        return
            super.execute(
                proposeMapping[proposalId].targets,
                proposeMapping[proposalId].values,
                proposeMapping[proposalId].calldatas,
                ""
            );
    }

    //  Получить балансы пользователя
    function getPerson()
        external
        view
        returns (
            uint256 profi,
            uint256 rtk,
            bool isDao
        )
    {
        return (
            profiCoin.balanceOf(msg.sender),
            rtkCoin.balanceOf(msg.sender),
            isMember[msg.sender]
        );
    }

    // получение всех id предложений
    function getAllProposalIDs() external view returns (uint256[] memory) {
        return allProposalIDs;
    }

    // получение информации о предложении
    function getProposalFull(uint256 proposalId)
        external
        view
        returns (ProposeLib memory)
    {
        ProposeLib storage prop = proposeMapping[proposalId]; // Сначала получаем из storage

        // Теперь собираем копию в memory
        ProposeLib memory data = ProposeLib({
            proposeId: prop.proposeId,
            targets: prop.targets,
            values: prop.values,
            calldatas: prop.calldatas,
            proposer: prop.proposer,
            voteEnd: prop.voteEnd,
            proposeType: prop.proposeType,
            quorumType: prop.quorumType,
            status: prop.status
        });

        return data;
    }

    function getProposalVotes(uint256 proposalID)
        external
        view
        returns (uint256 forVotes, uint256 againstVotes)
    {
        ProposalVote storage vote = _proposalVotes[proposalID];
        return (vote.forVotes, vote.againstVotes);
    }
}
