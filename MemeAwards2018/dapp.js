let contract;
var userAccounts;
var hasClaimed;
var youtubeSubscription = false;
var userAccess;

// Check for subscription every 1s
var interval = setInterval(checkSubscription, 1000);
var accessInterval;

window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            initialize();
        } catch (error) {
            // User denied account access...
            userAccess = false;
            $('#Web3Notification, #Web3Notification img').fadeToggle(100);
            notify(2);
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        userAccess = true;
    }
    // Non-dapp browsers...
    else {
        // userAccess is undefined
    }
});

// Initialize contract instance, load user data
async function initialize() {
    userAccess = true;
    $('#Web3Notification, #gainAccess').hide();
    $('#Loading').show();
    $('#Loading .info').text('Loading DApp');
    try {
    //let address = "0xCA011eD921eE5a91FdFB86F41d2e317bf5a5B5fC"; old
    let address = "0x756fee561baa951264cd6912e431111a80185fcf"; //no claim check
    let ABI = [
    {
        "constant":false,
        "inputs":[],
        "name":"claimMeme",
        "outputs":[],
        "payable":false,
        "stateMutability":"nonpayable",
        "type":"function"
    },
    
    {
        "constant":true,
        "inputs":[{"name":"_owner","type":"address"}],
        "name":"getMemesByOwner",
        "outputs":[{"name":"","type":"uint256[]"}],
        "payable":false,
        "stateMutability":"view",
        "type":"function"
    },
    
    {
        "constant":true,
        "inputs":[{"name":"","type":"address"}],
        "name":"hasClaimed",
        "outputs":[{"name":"","type":"bool"}],
        "payable":false,
        "stateMutability":"view",
        "type":"function"
    },
    	
    {
    	"constant":true,
    	"inputs":[],
    	"name":"isAirdropOver",
    	"outputs":[{"name":"","type":"bool"}],
    	"payable":false,
    	"stateMutability":"view",
    	"type":"function"
    },
    
    {
        "constant":true,
        "inputs":[],
        "name":"getEndTime",
        "outputs":[{"name":"","type":"uint256"}],
        "payable":false,
        "stateMutability":"view",
        "type":"function"
    },
    
    {
        "constant":true,
        "inputs":[{"name":"tokenId","type":"uint256"}],
        "name":"tokenURI",
        "outputs":[{"name":"","type":"string"}],
        "payable":false,
        "stateMutability":"view",
        "type":"function"
    },
    
    {
        "constant":true,
        "inputs":[{"name":"owner","type":"address"}],
        "name":"balanceOf",
        "outputs":[{"name":"","type":"uint256"}],
        "payable":false,
        "stateMutability":"view",
        "type":"function"
    }];
    contract = new web3.eth.Contract(ABI, address);
    userAccounts = await web3.eth.getAccounts();
    hasClaimed = await contract.methods.hasClaimed(userAccounts[0]).call();
    
        if(hasClaimed){
            // Load the card 
            loadCardData();
        } else {
            // idk yet
        }
    
    } catch (error) {
        console.error(error);
    } finally {
        $('#Loading').fadeOut(200);
    }
}

// Button to confirm userAccess 
$(document).on('click', '#gainAccess', function(){
    $('#Web3Notification, #Web3Notification img').fadeToggle(100);
    if(typeof userAccess === "undefined"){
        console.log("undefined");
        if(window.ethereum){
            console.log("web3");
            notify(0);
        } else {
            console.log("not web3");
            notify(1);
        }
    }
    if(userAccess = false){
        notify(2);
        console.log("user access false");
    }
});


// Call handleAuthClick function when user clicks on "Authorize" button.
$(document).on('click', '#confirmYoutubeSubscription', function(e){ //give event for FireFox
	e.preventDefault(); // now it'll work
	handleAuthClick(event);
}); 


// Clicks on claim token button 
$(document).on('click', '#claimTokenButton', function(){
    // Tell user to confirm 
    $('#Loading').fadeTo(200);
    $('#Loading .info').text('Please confirm this transaction...');
    function waitForReceipt(hash, cb) {
      web3.eth.getTransactionReceipt(hash, function (err, receipt) {
        if (err) {
          error(err);
        }
        if (receipt !== null) {
          // Transaction went through
          if (cb) {
            cb(receipt);
          }
        } else {
          // Try again in 1 second
          window.setTimeout(function () {
            waitForReceipt(hash, cb);
          }, 1000);
        }
      });
    }
    contract.methods.claimMeme().send({from: userAccounts[0]},
    function(error,hash){
        if(!error){
		$('#Loading').fadeIn(200);
            $('#Loading .info').html('Waiting for <a href="https://ropsten.etherscan.io/tx/'+hash+'" target="_blank">transaction</a> to confirm...');
            waitForReceipt(hash, function (receipt) {
                // Success! Transaction confirmed 
                $('#claimTokenButton').hide();
                setTimeout(loadCardData, 2000); //Bigger than waitForReceipt
                $('#Loading .info').text('Transaction confirmed!');
                $('#Loading').fadeOut(2000);
            });
        } else {
		$('#Loading').fadeIn(200);
            $('#Loading .info').text('Error. Transaction rejected?');
            $('#Loading').fadeOut(2000);
            console.log(error);
        }
    })
});


// Close button
$(document).on('click', '#closeButton', function(){
    $('#Web3Notification, #Web3Notification img').fadeToggle(100);
});


// Flip the card
function flip(){
    $('#cardContainer').css('transform', 'rotateY(180deg)');
	window.setTimeout(function() {
	    // Because frame is transparent and the back showed through :P
		$('.cardFront').css('display', 'none');
	}, 250);
}


// Load card data & flip 
async function loadCardData(){
    // Button no longer needed
    $('#gainAccess, #claimTokenButton').hide();
    try{
        let ownedTokens = await contract.methods.getMemesByOwner(userAccounts[0]).call();
        let ownedTokensUri = await contract.methods.tokenURI(ownedTokens[0]).call();
        $.getJSON(ownedTokensUri, function(data) {
            $("#cardTitle").text(data.name);
            $("#cardDescription").text(data.description);
            $("#cardImage").attr("src",data.image); 
        })
        $('.cardWrapper').fadeIn(200);
    } catch (error) {
        console.error(error);
    } finally {
        flip();
    }
}

// Notify the user
function notify(arg){
    switch (arg) {
        
        // Waiting
        case 0:
        $('#Web3Info h1').text('Not yet connected');
        $('#Web3Info p').text('You seem to be using a Web3 ready browser\
        but you have not yet confirmed the connection request. If you did not\
        see a confirmation popup initially then refreshing the page might\
        help.');
        $('#Web3Info').append('<a href="https://metamask.io" target="_blank" \
        rel="nofollow"><img src="../images/metafox.png" alt="MetaMask logo"/></a>');
        break;
        
        // No web3
        case 1:
        $('#Web3Info h1').text('Non-dapp browser detected!');
        $('#Web3Info p').text('It looks like your browser does not currently \
        support Web3. We recommend getting MetaMask to unlock the web of tomorrow \
        in your browser today.');
        $('#Web3Info').append('<a href="https://metamask.io" target="_blank" \
        rel="nofollow"><img src="../images/metamask.png" alt="MetaMask logo"/></a>');
        break;
        
        // Denied
        case 2:
        $('#Web3Info h1').text('Web3 access denied!');
        $('#Web3Info p').text('In order to interact with this DApp you need \
        to allow Web3 access. Consider refreshing the page and allowing access.');
        $('#Web3Info').append('<a href="https://metamask.io" target="_blank" \
        rel="nofollow"><img src="../images/metafox.png" alt="MetaMask logo"/></a>');
        break;
        
    }
 
}


function checkSubscription(){
    if(!youtubeSubscription){
        // Not subscribed to PewDiePie...
    } else {
        // Subscribed to PewDiePie!
        clearInterval(interval);
        $('#confirmYoutubeSubscription').hide();
        
        // Start new...
        accessInterval = setInterval(checkUserAccess, 1000);
    }
}


function checkUserAccess(){
    if(!userAccess){
        $('#accessNotification').text("Great! Your subscription is valid.\
        Now all that's left to do is connect your Web3 provider and you\
        will be able to claim your crypto collectible ;)");
        
        $('#gainAccess').show();
        
        console.log("subscribed!, not yet connected");
    } else {
        clearInterval(accessInterval);
        $('#gainAccess').hide();
        
        $('#accessNotification').text("Epic style! You have confirmed your subscription to\
        PewDiePie and we have established a solid Web3 connection. You're free to claim\
        your very own, super rare, Meme Awards 2018 limited edition shiny and fabulous\
        ERC721 cryptocurrency token.");
        
        $('#claimTokenButton').show();
    }
}
