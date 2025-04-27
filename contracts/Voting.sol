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
        uint256 proposeID;
        ProposeType proposeType;
        address proposer;
        uint256 voteEnd;
        QuorumMechanism quorumType;
        ProposalState status;
    }

    // Структура, описывающая голосование
    struct Vote {
        uint256 id;
        address[] targets;
        uint256[] values;
        bytes[] calldatas;
    }

    // Маппинг ID предложения -> структура голосования
    mapping(uint256 => Vote) private voteData;

    // Маппинг ID предложения -> счетчик голосов
    mapping(uint256 => ProposalVote) private _proposalVotes;

    // Пользователь уже голосовал по предложению
    mapping(uint256 => mapping(address => bool)) public customHasVoted;

    // список проголосовавших
    mapping(uint256 => address[]) public votersForProposal;

    // Членство в DAO
    mapping(address => bool) public isMember;

    // Делегированные RTK-токены для голосов
    mapping(address => uint256) public delegatedRTK;

    // Замена массива на маппинг
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
        addMember(tom);
        addMember(ben);
        addMember(rick);

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

    // расчёт силы пользователя по определённому предложению
    function _calculateVotingPower(address _member, uint256 proposalID)
        private
        view
        returns (uint256)
    {
        // Получаем количество PROFI токенов, заблокированных на голосование
        uint256 amount = lockedTokens[proposalID][_member];

        // Вычисляем силу по PROFI и RTK, с учётом делегированных RTK
        uint256 profiP = amount / profiPower;
        uint256 rtkP = delegatedRTK[_member] / rtkPower;

        return profiP + rtkP;
    }

    function _checkQuorum(ProposalVote storage vote, QuorumMechanism quorumType)
        internal
        view
        returns (bool)
    {
        uint256 totalVotes = vote.forVotes + vote.againstVotes;

        if (quorumType == QuorumMechanism.SimpleMajority) {
            return vote.forVotes > vote.againstVotes;
        } else if (quorumType == QuorumMechanism.SuperMajority) {
            return vote.forVotes * 3 > totalVotes * 2; // 2/3 голосов
        } else {
            return false;
        }
    }

    // Добавить участника в DAO
    function addMember(address _member) internal {
        if (!isMember[_member]) {
            isMember[_member] = true;
        }
    }

    //  Удалить участника из DAO
    function removeMember(address _member) internal {
        require(isMember[_member], unicode"Участник не найден");
        isMember[_member] = false;
    }

    // Установить новую силу голосования для PROFI
    function setProfiPower(uint256 newProfiPower) internal {
        profiPower = newProfiPower;
    }

    // Установить новую силу голосования для RTK
    function setRtkPower(uint256 newRtkPower) internal {
        rtkPower = newRtkPower;
    }

    //  Делегирование RTK-токенов (не DAO-участниками)
    function delegateRTK(address to, uint256 amount) external {
        require(
            !isMember[msg.sender],
            unicode"Участники DAO не могут делегировать таким способом"
        );
        require(isMember[to], unicode"Делегировать можно только участнику DAO");

        rtkCoin.transfer(msg.sender, to, amount);
        delegatedRTK[to] += amount;
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
                amount * 1 ether // Передаем в wei
            );
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
            proposeID: ID,
            proposeType: proposeType,
            proposer: msg.sender,
            voteEnd: uint256(block.timestamp + _period),
            quorumType: quorumType,
            status: ProposalState.Active
        });

        voteData[ID].id = ID;
        voteData[ID].targets = targets;
        voteData[ID].values = values;
        voteData[ID].calldatas = calldatas;
        allProposalIDs.push(ID);

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

        ProposalVote storage pv = _proposalVotes[proposalID];

        if (support == false) {
            pv.againstVotes += amount;
        } else if (support == true) {
            pv.forVotes += amount;
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
        prop.status = ProposalState.Canceled;

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

        Vote storage v = voteData[proposalID];
        super.cancel(
            v.targets,
            v.values,
            v.calldatas,
            keccak256(abi.encodePacked(""))
        );
    }

    // Выполнить предложение, если голосование завершено
    function callExecute(uint256 proposalID) external payable onlyMember {
        ProposeLib storage prop = proposeMapping[proposalID];
        require(
            prop.status == ProposalState.Active,
            unicode"Голосование не активно"
        );

        ProposalVote storage result = _proposalVotes[proposalID];

        // Проверка кворума
        bool approved = _checkQuorum(result, prop.quorumType);

        Vote storage v = voteData[proposalID];

        if (!approved) {
            return;
        }

        // В зависимости от типа предложения выполняем соответствующее действие
        if (
            prop.proposeType == ProposeType.A ||
            prop.proposeType == ProposeType.B
        ) {
            // Тип A и B - перевести средства на адрес стартапа
            address startup = abi.decode(v.calldatas[0], (address));
            uint256 amount = v.values[0];
            // Выполняем перевод
            payable(startup).transfer(amount);
        } else if (prop.proposeType == ProposeType.C) {
            // Тип C - добавить нового участника
            address newMember = abi.decode(v.calldatas[0], (address));

            // Добавляем нового участника в DAO
            addMember(newMember);
        } else if (prop.proposeType == ProposeType.D) {
            // Тип D - удалить участника
            address memberToRemove = abi.decode(v.calldatas[0], (address));

            // Удаляем участника из DAO
            removeMember(memberToRemove);
        } else if (prop.proposeType == ProposeType.E) {
            // Тип E - изменить силу голосов для PROFI
            uint256 newProfiPower = v.values[0];

            // Обновляем силу голосов для PROFI
            setProfiPower(newProfiPower);
        } else if (prop.proposeType == ProposeType.F) {
            // Тип F - изменить силу голосов для RTK
            uint256 newRtkPower = v.values[0];
            // Обновляем силу голосов для RTK
            setRtkPower(newRtkPower);
        }

        super.execute(
            v.targets,
            v.values,
            v.calldatas,
            keccak256(abi.encodePacked(""))
        );

        // Если предложение одобрено, меняем статус на "Approved"
        prop.status = ProposalState.Executed;
    }

    //  Получить балансы пользователя
    function getBalance()
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
    function getProposalFull(uint256 proposalID)
        external
        view
        returns (
            uint256 proposeID,
            uint8 proposeType,
            address proposer,
            uint256 voteEnd,
            uint8 quorumType,
            uint8 status
        )
    {
        return (
            proposeMapping[proposalID].proposeID,
            uint8(proposeMapping[proposalID].proposeType),
            proposeMapping[proposalID].proposer,
            uint256(proposeMapping[proposalID].voteEnd),
            uint8(proposeMapping[proposalID].quorumType),
            uint8(proposeMapping[proposalID].status)
        );
    }

    function getProposalVotes(uint256 proposalID)
        external
        view
        returns (uint256 forVotes, uint256 againstVotes)
    {
        ProposalVote storage vote = _proposalVotes[proposalID];
        return (vote.forVotes, vote.againstVotes);
    }

    //функция возвращает информации о
    function getVoteData(uint256 proposalID)
        external
        view
        returns (
            uint256 id,
            address[] memory targets,
            uint256[] memory values
        )
    {
        Vote storage vote = voteData[proposalID];
        return (vote.id, vote.targets, vote.values);
    }
}
