pragma solidity ^0.5.0;
contract TestWallet {

    event Deposit(address indexed sender, uint value);
    event Execution(uint indexed transactionId);
    
    mapping (uint => Transaction) public transactions;
    uint public transactionCount;
    struct Transaction {
        address payable destination;
        uint value;
        bytes data;
        bool executed;
    }
    function()
        external
        payable
    {
        if (msg.value > 0)
            emit Deposit(msg.sender, msg.value);
    }
    constructor()
        public
    {
        
    }
    function submitTransaction(address payable destination, uint value, bytes memory data)
        public
        returns (uint transactionId)
    {
        transactionId = addTransaction(destination, value, data);
    }
    function executeTransaction(uint transactionId)
        public
    {
        Transaction storage txToExecute = transactions[transactionId];
        txToExecute.executed = true;
        address payable addr = txToExecute.destination;
        (bool x, ) = addr.call.value(txToExecute.value)(txToExecute.data);
        if (x)
            emit Execution(transactionId);
            
    }
    function addTransaction(address payable destination, uint value, bytes memory data)
    internal
    returns (uint transactionId)
    {
        transactionId = transactionCount;
        transactions[transactionId] = Transaction({
            destination: destination,
            value: value,
            data: data,
            executed: false
        });
        transactionCount = transactionCount + 1;
    }
}