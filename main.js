 /// <reference path="jquery-3.6.0.js" />


 let sixthChosen = [];
 
 $(() => {
     
    
        // Navbar links
        $('#homePage').on('click', () => {
            $('#reports').hide();
            $('#about').hide();
            $('#coins').show();
            $('.parallax').show();
        });

        $('#reportsPage').on('click', () => {
            $('#coins').hide();
            $('#reports').show();
            $('#about').hide();
        });

        $('#aboutPage').on('click', () => {
            $('#about').empty();
            $('#coins').hide();
            $('#reports').hide();
            $('#about').show();
            $('.parallax').hide();
            $('#about').append(`
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <h1>About</h1>
                        </div>

                        <div class="col-md-12">
                            <p>  </p>
                        </div>
                    </div>
                </div>
            `);
        });
    

    //  Fixed navbar 
    $(window).scroll(function () {
        if ($(this).scrollTop() > 630) {
            $('.navbar').addClass('fixed-top');
            
        } else {
            $('.navbar').removeClass('fixed-top');
        }
    });

    // Parralax scrolling
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        $('.parallax').css({
            'background-position': 'center ' + (-scroll / 50) + 'px'
        });
    });



     
    // Reads the JSON file and stores it in a variable
     $("#coins").ready(async () => { 
         $('#reports').hide();
            $('#about').hide();
         try {
             const getCoins = await getJSON("https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD");
             displayCoinList(getCoins);
            }
            catch(err) {
                alert("Error...")
            }
        });
        
        // Get JSON from API
        function getJSON(url) {
            return new Promise((resolve, reject) => { 
                $.ajax({
                    url: url,
                    success: data => resolve(data),
                    error: err => reject(err)
                });
            });
        }
        
        // Displays the coin list
        function displayCoinList(getCoins) {

            $('#coins').empty();
            for ( let i = 0; i < 100; i ++) {
                $('#coins').append(`
                    <div class="col" id="${getCoins[i].symbol}">
                    <div class="card" >
                    <div  class="card-body text-center ">
                    <div class="form-check  form-switch">
                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
                    <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                    </div>
                    <h4 card-title >${getCoins[i].symbol.toUpperCase()}</h4>
                    <p>${getCoins[i].name}</p>
                    <p><a id=${getCoins[i].id} class="btn btn-primary" href="javascript:void(0)" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="collapseExample">More Info</a></p>
                    <div class="${getCoins[i].id} collapse col-12"></div>
                    </div>
                    </div>
                `);
            }
            
        }
        
        // Collapse Button
        /// Toggle Collapse
        $(document).on("click", `.btn-primary`, async function () {
            if ($(`.${this.id}`).attr("class") == `${this.id} col-12 collapse show`) {
                $(`.${this.id}`).collapse("toggle");
                setTimeout(() => {
                    $(`.${this.id}`).empty();
                }, 700);
            } else {
                loadingCollapse(`${this.id}`);
                displayCollapse(this.id);
                $(`.${this.id}`).collapse("toggle");
            }
        });
        // Displaying content + Validating Local Storage Content
        function displayCollapse(currency) {
            if (localStorage.getItem(currency) === null) {
                $.getJSON((`https://api.coingecko.com/api/v3/coins/${currency}`), Response => {
                    $(`.${currency}`).empty();
                    $(`.${currency}`).append(`
                        <div class="row">
                        <img class=" img-fluid rounded mx-auto d-block " src="${Response.image.small}">
                        <div class="col-xs-4">
                        <p>USD: ${Response.market_data.current_price.usd}&dollar;</p>
                        <p>EUR: ${Response.market_data.current_price.eur}&euro;</p>
                        <p>ILS: ${Response.market_data.current_price.ils}&#8362;</p>
                        </div></div>
                    `);
                    
                    localStorage.setItem(`${currency}`, JSON.stringify({
                        image: img,
                        usd: p1,
                        eur: p2,
                        ils: p3
                    }));
                    setTimeout(() => {
                        localStorage.removeItem(currency);
                    }, 120000);
                }).fail(() => {
                    alert(`Failed retrieving from server, please try again later`);
                    $(`.${currency}`).collapse("toggle");
                    setTimeout(() => {
                        $(`.${currency}`).empty();
                    }, 700);
                });
            }
            else {
                const storageDraw = JSON.parse(localStorage.getItem(`${currency}`));
                const newDiv = `<div class="row">${storageDraw.image}<div class="col-xs-4">${storageDraw.usd}${storageDraw.eur}${storageDraw.ils}</div></div>`;
                $(`.${currency}`).empty();
                $(`.${currency}`).append(newDiv);
            }
        }
        // Collapser Loading
        function loadingCollapse(id) {
            $(`.${id}`).append(`
                <section class="main">
                <div id="container__loader"class="container">
                <div class="loader">
                </div>
                </div>
                </selection>
            `);
        }
        
        
        // Search Bar 
        $(".form-control").keyup(function () {
            $('.parallax').hide();
            let search = $(this).val().toLowerCase();
            $('.col').each(function () {
                let text = $(this).text().toLowerCase();
                (text.indexOf(search) !== -1) ? $(this).show() : $(this).hide();
            });

            if (search.length === 0) {
                $('.col').show();
                $('.parallax').show();
            }

        });

       $('#search').on('click', function() {
           console.log('click');
       })

        
        // TODO: Checkbox for choosing currencies
        let coinsArr = [];
        $(document).on('click', '#flexSwitchCheckDefault',function() {
            if((this).checked === true) {
                coinsArr.push($(this).parents('.col').get(0).id);
                console.log(coinsArr);
            }
            
            else {
                $(coinsArr).each((index,value) => {
                    if (value === $(this).parents('.col').get(0).id) {
                        coinsArr.splice(index,1);
                        console.log(coinsArr);
                        
                    }
                })
            }
            
            if ( coinsArr.length === 6) {
                $(this).prop('checked',false);
                sixthChosen = [coinsArr[5]];
                console.log(sixthChosen);
                coinsArr.splice(5,1);
                createModal();
                $(`#modal`).modal('show');
                $(".modal-body").empty();
                createModalBody();
                
            }
        })

        
        // TODO: Create Modal 
        function createModal() {
            $("body").append(`<div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Please choose coins to remove</h5>
                    </button>
                </div>
                <div class="modal-body"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-danger">Save changes</button>
                </div>
                </div>
                </div>
                </div>`);
        }
        
        // TODO: Create Modal Body
        function createModalBody() {
            $.each(coinsArr, function(index,value) {
                const p = `<p>${value}</p>`;
                const input = `<div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="${index}">
                <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                </div>`;
                const newDiv = `<div id="${value}">${input}${p}</div>`;
                $(".modal-body").append(newDiv);
                removeCurrencyArr = [];

            })
        };

        //TODO: Modal Check Boxes
        let removeCurrencyArr = [];
        $(document).on("click", ".modal-body .form-check-input", function () {
            let index = $(this).attr('id');
            removeCurrencyArr.push(index);
            console.log(removeCurrencyArr);
            
        });

        //TODO: Modal Button. Save Changes
        $(document).on("click", ".modal-footer>.btn-danger", function () {
            $(`#modal`).modal('hide');
            $(`input`).prop("checked", false);
            if (coinsArr.length !== 5) {
                coinsArr.push(sixthChosen[0]);
            }
            for (let item of removeCurrencyArr) {
                coinsArr.splice(0, 1);
                console.log(item);
                console.log(coinsArr);
            }
            for (let item of coinsArr) {
                $(`#${item} #flexSwitchCheckDefault`).prop("checked", true);
            }
        });

        // TODO: Modal Button. Close
        $(document).on("click", ".modal-footer>.btn-secondary", function () {
            $(`#modal`).modal('hide');

        });

        // TODO: Create about page
     
    
});