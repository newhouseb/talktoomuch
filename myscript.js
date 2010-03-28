var container = null;
document.addEventListener('DOMNodeInserted', function(e) {
    if(e.target.className == 'dw') {
        e.target.addEventListener('DOMNodeInserted', function(f) {
            var next = (f.target.className == 'no') ? f.target : f.target.getElementsByClassName('no')[0];
            if(next == undefined) return;
            next.addEventListener('DOMNodeInserted', function(f) {
                if(f.target.parentNode == next) {
                    var chatbox = f.target;
                    chatbox.i = 0;
                    chatbox.me = 0;
                    chatbox.you = 0;
                    chatbox.addEventListener('DOMNodeInserted', function(g) {
                        chatbox.i++;
                        if (g.target.className == 'kl') {
                            if(g.target.parentNode.getAttribute("chat-dir") == 't') chatbox.you++;
                            if(g.target.parentNode.getAttribute("chat-dir") == 'f') chatbox.me++;
                        } else if(g.target.className == 'km') {
                            if(g.target.getAttribute("chat-dir") == 't') chatbox.you++;
                            if(g.target.getAttribute("chat-dir") == 'f') chatbox.me++;
                        }
                    });
                    chatbox.addEventListener('DOMSubtreeModified', function(g) {
                        if(chatbox.name == undefined
                            & chatbox.getElementsByClassName('Hp')[0].innerHTML != "&nbsp;"
                            & chatbox.getElementsByClassName('Hp')[0].innerHTML != "...") {
                            chatbox.name = chatbox.getElementsByClassName('Hp')[0].innerHTML;
                        } else if (chatbox.name != undefined) {
                            if((chatbox.me + chatbox.you) > 0)
                                chatbox.getElementsByClassName('Hp')[0].innerHTML = chatbox.name + " " + 
                                    Math.round(100*chatbox.me/(chatbox.me + chatbox.you)) + "% is you talking";
                        } 
                    });
                }
            });
        });
    }
});
