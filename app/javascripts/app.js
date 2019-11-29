// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";
import "../css/home.css"
import "../css/borrower.css"
import "../css/lender.css"

// Import libraries we need.
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

// Import our contract artifacts and turn them into usable abstractions.
import test_wallet_artifacts from '../../build/contracts/TestWallet.json'
var TestWallet = contract(test_wallet_artifacts);
var request = new XMLHttpRequest();

var accounts;
var account;

window.App = {
  start: function () {
    var self = this;

    // Bootstrap the TestWallet abstraction for Use.
    TestWallet.setProvider(web3.currentProvider);
    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert(accs); // for debug
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      // alert(accs.length);
      accounts = accs;
      account = accounts[0];

      self.getBalance();
    });
  },

  getBalance: function () {
    return web3.eth.getBalance(account, function (error, result) {
      if (!error) {
        console.log(result.toNumber());
        $("#port-val").text(web3.fromWei(result, "ether").toFixed(3));
      } else {
        console.error(error);
      }
    })
  },

  signup: async function () {
    var borrow = document.getElementById("check-borrow").checked;
    var username = undefined;
    var password = undefined;
    var university = undefined;
    var identity = undefined;
    var occupation = undefined;
    var studentID = undefined;
    var body = {};
    if (borrow) {
      username = document.getElementById("username-borrower").value;
      password = document.getElementById("password-borrower").value;
      identity = "borrower";
      university = document.getElementById("university").value;
      studentID = document.getElementById("studentId").value;
      body = {
        username:username,
        password:password,
        identity:identity,
        university:university,
        studentID:studentID
      }
    } else {
      username = document.getElementById("username-lender").value;
      password = document.getElementById("password-lender").value;
      identity = "lender";
      occupation = document.getElementById("occupation").value;
      body = {
        username:username,
        password:password,
        identity:identity,
        occupation:occupation
      }
    }
    console.log(body);
    await fetch("/api/signup", {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(res => {
      console.log("Request complete! response:", res);
    });
    // window.location.href = "index.html";
  },

  login: function () {
    var self = this;

    var username = document.getElementById("username").value;
    var password = document.getElementById("pwd").value;
    console.log(username);
    // window.location.href = "borrowtransaction.html";
    if (username == "Anna") {
      window.location.href = "borrowtransaction.html";
    } else if (username == "Bobby") {
      window.location.href = "lender.html";
    }
  },

  depositLoan: function () {
    var self = this;

    var amount = parseInt(document.getElementById("loan-input").value);

    var meta;
    return TestWallet.deployed().then(function (instance) {
      meta = instance;
      // localStorage.setItem("contract", instance.address);
      instance.sendTransaction({ from: account, value: web3.toWei(amount) }).then(function (result) {
        console.log("transaction sent");
      });
    }).then(function () {
      self.getBalance();
    }).catch(function (e) {
      console.log(e);
    });
  },

  requestLoan: function () {
    var self = this;
    var amount = parseInt(document.getElementById("borrow-input").value);
    console.log(amount);
    var meta;
    return TestWallet.deployed().then(function (instance) {
      meta = instance;
      instance.submitTransaction(account, web3.toWei(amount), "0x", {from: account}).then(function (result) {
        return meta.transactionCount.call({from: account});
      }).then(function(count) {
        return meta.executeTransaction(parseInt(count.toLocaleString()) - 1, {from: account});
      }).catch(function (e) {
        console.log(e);
      });
    }).then(function() {
      self.getBalance();
    }).catch(function (e) {
      console.log(e);
    });
  }
};

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.start();
});
