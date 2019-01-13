var contract;
var userAccounts;
var hasClaimed;

var web3Connected;
var yp; // Youtube progress
var wp; // Web3 progress
var op; // Overall progress
var progress = setInterval(checkProgress, 100);

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
            web3Connected = false;
            $('#Web3Notification, #Web3Notification img').fadeToggle(100);
            notify(2);
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        initialize();
    }
    // Non-dapp browsers...
    else {
        // web3Connected is undefined
    }
});

// Initialize contract instance, load user data
async function initialize() {
    wp = true;
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
    
        if(hasClaimed && typeof hasClaimed !== 'undefined'){
            // Overall progress 
            op = true;
			loadCardData();
        }
    
    } catch (error) {
        console.error(error);
    } finally {
        $('#Loading').fadeOut(200);
    }
}

// Button to confirm web3Connected 
$(document).on('click', '#gainAccess', function(){
    $('#Web3Notification, #Web3Notification img').fadeToggle(100);
    if(typeof web3Connected === "undefined"){
        if(window.ethereum){
            notify(0);
        } else {
            notify(1);
        }
    }
    if(web3Connected = false){
        notify(2);
    }
});

// Call Google's handleAuthClick
$(document).on('click', '#confirmYoutubeSubscription', function(event){
	handleAuthClick(event);
}); 

// Clicks on claim token button 
$(document).on('click', '#claimTokenButton', function(){
    $('#Loading').fadeTo(200, 1);
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
            $('#Loading .info').html('Waiting for <a href="https://ropsten.etherscan.io/tx/'+hash+'" target="_blank">transaction</a> to confirm...');
            waitForReceipt(hash, function (receipt) {
                // Success!
				op = true;
                $('#Loading .info').text('Transaction confirmed!');
                $('#Loading').fadeOut(2000);
            });
        } else {
            $('#Loading .info').text('Error. Transaction rejected?');
            $('#Loading').fadeOut(2000);
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
    // Buttons no longer needed
    $('#confirmYoutubeSubscription, #gainAccess, #claimTokenButton').hide();
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



function checkProgress(){
	
	if(op === true && typeof op !== 'undefined'){
		// All the steps are completed!
		clearInterval(progress);
		$('#claimTokenButton, #gainAccess, #confirmYoutubeSubscription').hide();
		
		$('#ClaimERC721 h3').text('Your token is delivered!');
		$('#accessNotification').text("This is your very own \
		limited edition, super rare, extra shiny, unique and \
		dare I say, priceless relic from the great Meme Awards \
		of 2018.");

	} else {
		if(wp === true && typeof wp !== 'undefined'){
			// Web3 progress
			$('#gainAccess').hide();
			$('#confirmYoutubeSubscription').hide();
			$('#ClaimERC721 h3').text('Almost there...');
			$('#accessNotification').html('<span style="color: green;\
			font-weight: bold">Epic style!</span><br><br> \You have \
			confirmed your loyalty to PewDiePie and we have established \
			a solid Web3 connection. You can now claim your token \
			by clicking the button below. <br><br>Depending on network \
			load and the amount of Gas you\'re willing to spend, this may \
			take a moment.');

			$('#claimTokenButton').toggle();
		} else {
			if(yp === true && typeof yp !== 'undefined'){
				// Youtube confirmed!
				$('#confirmYoutubeSubscription').toggle();
				$('#accessNotification').html('<span style="color: orange; \
				font-weight: bold">Great!</span><br><br> Your subscription is \
				valid.<br><br> \Now all that\'s left to do is connect your \
				Web3 provider (MetaMask or other) and find out which card \
				you\'ll get!');
				
				$('#gainAccess').toggle();
			} else {
				// No Youtube confirmation...
				$('#accessNotification').html('Before you can claim your meme \
				crypto collectible you need to confirm that you are indeed \
				subscribed to PewDiePie. If you\'re not yet a subscriber, you can \
				subscribe to his channel \
				<a href="https://www.youtube.com/channel/UC-lHJZR3Gqxm24_Vd_AJ5Yw?sub_confirmation=1" target="_blank" rel="nofollow">right here</a>. \
				Otherwise click the button below and we\'ll do a quick read-only \
				check on your Youtube account to confirm your subscription.');
				
				$('#confirmYoutubeSubscription').toggle();
			}
		}
	}
}
