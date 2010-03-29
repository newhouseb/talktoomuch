
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

function GChatWindowWaiter(target) {
    var me = 0;
    var you = 0;
    var name = undefined;

    /* TODO: Make this work */
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
    //alert(past_kl.length + "," + past_km.length);
    /* ENDTODO */
     
    target.addEventListener('DOMNodeInserted', function(g) {
        if (g.target.className == 'kl') {
            if(g.target.parentNode.getAttribute("chat-dir") == 't') you++;
            if(g.target.parentNode.getAttribute("chat-dir") == 'f') me++;
        } else if(g.target.className == 'km') {
            if(g.target.getAttribute("chat-dir") == 't') you++;
            if(g.target.getAttribute("chat-dir") == 'f') me++;
        }
    });

    target.addEventListener('DOMSubtreeModified', function(g) {
        if(name == undefined
            & target.getElementsByClassName('Hp')[0].innerHTML != "&nbsp;"
            & target.getElementsByClassName('Hp')[0].innerHTML != "...") {
            name = target.getElementsByClassName('Hp')[0].innerHTML;
        } else if (name != undefined) {
            if((me + you) > 0)
                target.getElementsByClassName('Hp')[0].innerHTML = name + " " + 
                    Math.round(100*me/(me + you)) + "% is you talking";
        } 
    });
}

var TalkTooMuch = new GChatSystemWaiter();
TalkTooMuch.start();
