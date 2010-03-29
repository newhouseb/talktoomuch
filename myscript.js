
/* Listens on the document for the chat system to initialize */
function GChatSystemWaiter() {
    var dwContainer = null;
    var noContainer = null; 
    var chatWindowListeners = [];

    /* This adds listeners to each chat window as needed */
    var chatWindowInsertedHandler = function(e) {
        if(e.target.parentNode == noContainer) {
            chatWindowListeners[chatWindowListeners.length] = new GChatWindowWaiter(e.target);
        }
    };

    /* This waits for a div of class "no" inside a div of class "dw" */
    var noInsertedHandler = function(e) {
            noContainer = (e.target.className == 'no') ? e.target : e.target.getElementsByClassName('no')[0];
            if(noContainer == undefined) return;

            noContainer.addEventListener('DOMNodeInserted', chatWindowInsertedHandler, false);
            dwContainer.removeEventListener('DOMNodeInserted', noInsertedHandler, false);
    };

    /* This waits for a div of class "dw" in the document root */
    var dwInsertedHandler = function(e) {
            if(e.target.className == 'dw') {
                dwContainer = e.target;
                dwContainer.addEventListener('DOMNodeInserted', noInsertedHandler, false);

                document.removeEventListener('DOMNodeInserted', dwInsertedHandler, false);
            }
    };

    /* Kicks off the document listener */
    this.start = function() {
        document.addEventListener('DOMNodeInserted', dwInsertedHandler, false);
    };
}

/* Listens on a specific window for updates */
function GChatWindowWaiter(target) {
    var me = 0;
    var you = 0;
    var name = undefined;

    /* Watch for new chat lines */
    target.addEventListener('DOMNodeInserted', function(g) {
        /* One of these is when the speaker changes ie. a name is printed, 
           another is when the speaker remains the same */
        if (g.target.className == 'kl') {
            if(g.target.parentNode.getAttribute("chat-dir") == 't') you++;
            if(g.target.parentNode.getAttribute("chat-dir") == 'f') me++;
        } else if(g.target.className == 'km') {
            if(g.target.getAttribute("chat-dir") == 't') you++;
            if(g.target.getAttribute("chat-dir") == 'f') me++;
        }
    });

    /*Each chat insert tends to reset our customized name, so we need to
      display our extra data only after the tree has been completely modified*/
    target.addEventListener('DOMSubtreeModified', function(g) {
        /* Wait for the box to finish initializing */
        if(name == undefined
            & target.getElementsByClassName('Hp')[0].innerHTML != "&nbsp;"
            & target.getElementsByClassName('Hp')[0].innerHTML != "...") {

            /* Get the original title/name because we're overwriting it/adding
               to it our extra metrics */
            name = target.getElementsByClassName('Hp')[0].innerHTML;

            /* Count up pre-existing chat lines */
            var past_kl = target.getElementsByClassName('kl');
            for(var i = 0; i < past_kl.length; i++) {
                if(past_kl[i].parentNode.getAttribute("chat-dir") == 't') you++;
                if(past_kl[i].parentNode.getAttribute("chat-dir") == 'f') me++;
            }
            var past_km = target.getElementsByClassName('km');
            for(var i = 0; i < past_km.length; i++) {
                if(past_km[i].getAttribute("chat-dir") == 't') you++;
                if(past_km[i].getAttribute("chat-dir") == 'f') me++;
            }
        } else if (name != undefined) {
            /* Redraw the stats back in */
            if((me + you) > 0)
                target.getElementsByClassName('Hp')[0].innerHTML = name + " " + 
                    Math.round(100*me/(me + you)) + "% is you talking";
        } 
    });
}

var TalkTooMuch = new GChatSystemWaiter();
TalkTooMuch.start();
