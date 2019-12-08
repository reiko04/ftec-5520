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
import { stat } from "fs";
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
        // alert(accs); // for debug
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      // alert(accs.length);
      accounts = accs;
      account = accounts[0];

      self.getUserInfo("username");
      self.getBalance();
      if (window.location.href == "http://localhost:8080/borrowtransaction.html") {
        self.listBorrowRequest();
      }
      if (window.location.href == "http://localhost:8080/lender.html") {
        self.listAvailableLoan();
      }
    });
  },

  getUserInfo: function(type) {
    var name = type + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) 
    {
      var c = ca[i].trim();
      if (c.indexOf(name)==0) {
        if (type == "username")
          $("#login-username").text(c.substring(name.length,c.length));
        return c.substring(name.length,c.length)
      };
    }
    
    return "";
  },

  getBalance: function () {
    return web3.eth.getBalance(account, function (error, result) {
      if (!error) {
        // console.log(result.toNumber());
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
    window.location.href = "index.html";
  },

  login: async function () {
    var self = this;
    var username = document.getElementById("username").value;
    var password = document.getElementById("pwd").value;
    console.log(username);
    var body = {
      username:username,
      password:password
    };
    // window.location.href = "borrowtransaction.html";
    var user = await fetch("/api/login", {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(res => {
      return res.text();
    });
    user = JSON.parse(user);
    console.log(user);
    if (!user) {
      console.log("login error!");
    } 
    if (user.identity == "borrower") {
      document.cookie = "username=" + user.username
      document.cookie = "identity=" + "borrower";
      window.location.href = "borrowtransaction.html";
    } else if (user.identity == "lender") {
      document.cookie = "username=" + user.username+ + ";" + "identity=" + "lender";;
      window.location.href = "lender.html";
    }
  },

  postBorrowRequest: async function() {
    var self = this;
    var username = self.getUserInfo();
    var amount = document.getElementById("amount").value;
    var interest = document.getElementById("interest").value;
    var purpose = document.getElementById("purpose").value;
    var maturity = document.getElementById("maturity").value;
    var body = {
      borrower: username,
      amount: amount,
      interest: interest,
      purpose: purpose,
      maturity: maturity
    };
    await fetch("api/postborrowrecord", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(res => {
      console.log("Request complete! response:", res);
    });
    window.location.href = "borrowtransaction.html";
  },

  listBorrowRequest: async function() {
    var self = this;
    var username = self.getUserInfo("username");
    var identity = self.getUserInfo("identity");
    if (username != undefined && identity == "borrower") {
      // console.log("finding...")
      var records = await fetch("/api/getborrowrecord?username="+username, {
        method: "GET", 
        headers: { "Content-Type": "application/json" }
      }).then(res => {
        return res.text();
      });
      records = JSON.parse(records);
      // console.log(records);
      for (var i = 0, len = records.length; i < len; i++) {
        var record = records[i];
        // console.log(record);
        var lender_name = "";
        var status = "Requesting";
        var interest_rate = record.interestRate;
        var purpose = record.purpose;
        var maturity = record.maturity;
        
        if (record.lender != undefined) {
          var lender_id = record.lender;
          var lender = await fetch("/api/getuserbyid?userid="+lender_id, {
            method: "GET", 
            headers: { "Content-Type": "application/json" }
          }).then(res => {
            return res.text();
          });
          lender_name = lender.username;
          status = "Borrowing";
        }
        var $new = $("<li><div></div><div></div><div></div><div></div><div></div></li>");
        console.log($new);
        $new.find("div").eq(0).text(status);
        $new.find("div").eq(1).text(lender_name);
        $new.find("div").eq(2).text(interest_rate);
        $new.find("div").eq(3).text(purpose);
        $new.find("div").eq(4).text(maturity);

        $("#request-record").append($new);
      }
    }
  
  },

  listAvailableLoan: async function () {
    var self = this;
    var records = await fetch("/api/getloan?established=false", {
      method: "GET", 
      headers: { "Content-Type": "application/json" }
    }).then(res => {
      return res.text();
    });
    records = JSON.parse(records);
    console.log(records);
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.lender != undefined) {
        continue;
      }
      // console.log(record);
      var borrower_name = "";
      var interest_rate = record.interestRate;
      var purpose = record.purpose;
      var maturity = record.maturity;
      
      if (record.borrower != undefined) {
        var borrow_id = record.borrower;
        var borrower = await fetch("/api/getuserbyid?userid="+borrow_id, {
          method: "GET", 
          headers: { "Content-Type": "application/json" }
        }).then(res => {
          return res.text();
        });
        console.log(borrower);
        borrower = JSON.parse(borrower);
        borrower_name = borrower.username;
        status = "Borrowing";
      }
      var $new = $("<li><div></div><div></div><div></div><div></div><div></div></li>");
      console.log($new);
      $new.find("div").eq(0).text(borrower_name);
      $new.find("div").eq(1).text(interest_rate);
      $new.find("div").eq(2).text(purpose);
      $new.find("div").eq(3).text(maturity);

      $("#available-loan").append($new);
    }
  },

  logout: function () {
    document.cookie = "username=; identity=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
