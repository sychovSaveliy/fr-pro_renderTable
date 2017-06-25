window.onload = function(){


    document.querySelector(".popup__close").addEventListener("click", function(){
        document.querySelector('.popup__container').classList.remove("active");
    });

    document.querySelector('.clear_local').addEventListener("click", function(){
        window.localStorage.clear();
        location.reload();
    });
    
    


    function RenderServices(){
        this.getDataFromAPI = function(type, url){
            var self = this;

            if(window.localStorage.data){
                self.setData( JSON.parse( window.localStorage.data ) );
            } else {
                var xhr = new XMLHttpRequest();
                
                xhr.open(type, url, false);

                xhr.onreadystatechange = function(){
                    if (this.readyState != 4) return;


                    let result = this.responseText; 

                    self.setData(JSON.parse(result));

                }
                xhr.send();
            }
        }

        

        this.getData = function(){
            return this.data;
        }
    }


    RenderServices.prototype.setData = function(data){
        this.data = data;
        window.localStorage.data = JSON.stringify( data );
    }

    RenderServices.prototype.render = function(selectorOfContainer){
        var checkTable = document.querySelector(selectorOfContainer + " .main__table");

        if(checkTable){
            checkTable.remove();
        }


        var table = document.createElement('table');
        table.classList.add("main__table");
        var data = this.getData();

        renderTH(table, data.services.CategoryElement_1[0]);
        

        for(var cat in data.services){
            var category = data.services;
            for(var service in category[cat]){
                // console.log(data.services[cat][service])
                var tr = document.createElement('tr');
                tr.dataset.category = cat;
                tr.dataset.position = service;
                var serviceIn = category[cat];
                for(var item in serviceIn[service]){
                    var td = document.createElement('td');
                    td.innerHTML = serviceIn[service][item];
                    td.dataset.property = item;
                    tr.appendChild(td);
                }

                var buttonsTd = document.createElement('td');
                var btn = document.createElement("button");
                btn.innerHTML = "Remove";
                var self = this;
                btn.addEventListener("click", doClick.bind(btn, service, cat));



                function doClick(servicePos, serviceCat){
                    // delete self.data.services[serviceCat][servicePos];
                    
                    self.data.services[serviceCat].splice(servicePos, 1);
                    window.localStorage.data = JSON.stringify(self.data);
                    
                    let parent = this.parentElement.parentElement;
                    parent.classList.add("hideElement");

                    setTimeout(()=>{
                        parent.remove();
                    }, 1000);
                }


                buttonsTd.appendChild(btn);
                tr.appendChild(buttonsTd);

                table.appendChild(tr);
            }
        }

        renderTH(table, data.services.CategoryElement_1[0]);

        var self = this;
        table.addEventListener("contextmenu", function(event){
            event.preventDefault();
            var popup = document.querySelector(".popup__container");

            popup.querySelector("p").innerHTML = event.target.innerHTML;
            popup.querySelector("textarea").value = event.target.innerHTML;

            document.querySelector(".popup__submit").onclick = function(){
                event.target.innerHTML = popup.querySelector('textarea').value;
                popup.classList.remove("active");
                
                
                var toModel = {
                    cat: event.target.parentElement.dataset.category,
                    pos: event.target.parentElement.dataset.position,
                    property: event.target.dataset.property
                }
                
                self.data.services[toModel.cat][toModel.pos][toModel.property] = popup.querySelector('textarea').value;
                window.localStorage.data = JSON.stringify(self.data);
            };

            popup.style.left = event.clientX - 40 + "px";
            popup.style.top = event.clientY+40 + "px";
            popup.classList.add("active");
        });

        document.querySelector(selectorOfContainer).appendChild(table);



        function renderTH(table, obj) {
            
            var tr = document.createElement('tr');
            for(var item in obj){
                var th = document.createElement('th');
                th.innerHTML = item;

                tr.appendChild(th);
            }
            table.appendChild(tr);
        }

    };



    var p1 = new RenderServices();
    p1.getDataFromAPI("GET", 'assets/data.json');
    
    p1.render(".container");
}