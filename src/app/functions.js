/*=============================================
OwlCarouselConfig
=============================================*/

export let OwlCarouselConfig = {

    fnc: function () {

        var target = $('.owl-slider');
        if (target.length > 0) {
            target.each(function () {
                var el = $(this),
                    dataAuto = el.data('owl-auto'),
                    dataLoop = el.data('owl-loop'),
                    dataSpeed = el.data('owl-speed'),
                    dataGap = el.data('owl-gap'),
                    dataNav = el.data('owl-nav'),
                    dataDots = el.data('owl-dots'),
                    dataAnimateIn = (el.data('owl-animate-in')) ? el.data('owl-animate-in') : '',
                    dataAnimateOut = (el.data('owl-animate-out')) ? el.data('owl-animate-out') : '',
                    dataDefaultItem = el.data('owl-item'),
                    dataItemXS = el.data('owl-item-xs'),
                    dataItemSM = el.data('owl-item-sm'),
                    dataItemMD = el.data('owl-item-md'),
                    dataItemLG = el.data('owl-item-lg'),
                    dataItemXL = el.data('owl-item-xl'),
                    dataNavLeft = (el.data('owl-nav-left')) ? el.data('owl-nav-left') : "<i class='icon-chevron-left'></i>",
                    dataNavRight = (el.data('owl-nav-right')) ? el.data('owl-nav-right') : "<i class='icon-chevron-right'></i>",
                    duration = el.data('owl-duration'),
                    datamouseDrag = (el.data('owl-mousedrag') == 'on') ? true : false;
                if (target.children('div, span, a, img, h1, h2, h3, h4, h5, h5').length >= 2) {
                    el.owlCarousel({
                        animateIn: dataAnimateIn,
                        animateOut: dataAnimateOut,
                        margin: dataGap,
                        autoplay: dataAuto,
                        autoplayTimeout: dataSpeed,
                        autoplayHoverPause: true,
                        loop: dataLoop,
                        nav: dataNav,
                        mouseDrag: datamouseDrag,
                        touchDrag: true,
                        autoplaySpeed: duration,
                        navSpeed: duration,
                        dotsSpeed: duration,
                        dragEndSpeed: duration,
                        navText: [dataNavLeft, dataNavRight],
                        dots: dataDots,
                        items: dataDefaultItem,
                        responsive: {
                            0: {
                                items: dataItemXS
                            },
                            480: {
                                items: dataItemSM
                            },
                            768: {
                                items: dataItemMD
                            },
                            992: {
                                items: dataItemLG
                            },
                            1200: {
                                items: dataItemXL
                            },
                            1680: {
                                items: dataDefaultItem
                            }
                        }
                    });
                }

            });
        }

    }

}

/*=============================================
BackgroundImage
=============================================*/

export let BackgroundImage = {

    fnc: function () {

        var databackground = $('[data-background]');
        databackground.each(function () {
            if ($(this).attr('data-background')) {
                var image_path = $(this).attr('data-background');
                $(this).css({
                    'background': 'url(' + image_path + ')'
                });
            }
        });

    }
}

/*=============================================
CarouselNavigation
=============================================*/

export let CarouselNavigation = {

    fnc: function () {

        var prevBtn = $('.ps-carousel__prev'),
            nextBtn = $('.ps-carousel__next');
        prevBtn.on('click', function (e) {
            e.preventDefault();
            var target = $(this).attr('href');
            $(target).trigger('prev.owl.carousel', [1000]);
        });
        nextBtn.on('click', function (e) {
            e.preventDefault();
            var target = $(this).attr('href');
            $(target).trigger('next.owl.carousel', [1000]);
        });


    }

}

/*=============================================
SlickConfig
=============================================*/

export let SlickConfig = {

    fnc: function () {
        var product = $('.ps-product--detail');
        if (product.length > 0) {
            var primary = product.find('.ps-product__gallery'),
                second = product.find('.ps-product__variants'),
                vertical = product.find('.ps-product__thumbnail').data('vertical');
            primary.slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                asNavFor: '.ps-product__variants',
                fade: true,
                dots: false,
                infinite: false,
                arrows: primary.data('arrow'),
                prevArrow: "<a href='#'><i class='fa fa-angle-left'></i></a>",
                nextArrow: "<a href='#'><i class='fa fa-angle-right'></i></a>",
            });
            second.slick({
                slidesToShow: second.data('item'),
                slidesToScroll: 1,
                infinite: false,
                arrows: second.data('arrow'),
                focusOnSelect: true,
                prevArrow: "<a href='#'><i class='fa fa-angle-up'></i></a>",
                nextArrow: "<a href='#'><i class='fa fa-angle-down'></i></a>",
                asNavFor: '.ps-product__gallery',
                vertical: vertical,
                responsive: [
                    {
                        breakpoint: 1200,
                        settings: {
                            arrows: second.data('arrow'),
                            slidesToShow: 4,
                            vertical: false,
                            prevArrow: "<a href='#'><i class='fa fa-angle-left'></i></a>",
                            nextArrow: "<a href='#'><i class='fa fa-angle-right'></i></a>"
                        }
                    },
                    {
                        breakpoint: 992,
                        settings: {
                            arrows: second.data('arrow'),
                            slidesToShow: 4,
                            vertical: false,
                            prevArrow: "<a href='#'><i class='fa fa-angle-left'></i></a>",
                            nextArrow: "<a href='#'><i class='fa fa-angle-right'></i></a>"
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 3,
                            vertical: false,
                            prevArrow: "<a href='#'><i class='fa fa-angle-left'></i></a>",
                            nextArrow: "<a href='#'><i class='fa fa-angle-right'></i></a>"
                        }
                    },
                ]
            });
        }
    }

}

/*=============================================
ProductLightbox
=============================================*/

export let ProductLightbox = {

    fnc: function () {
        var product = $('.ps-product--detail');
        if (product.length > 0) {
            $('.ps-product__gallery').lightGallery({
                selector: '.item a',
                thumbnail: true,
                share: false,
                fullScreen: false,
                autoplay: false,
                autoplayControls: false,
                actualSize: false
            });
            if (product.hasClass('ps-product--sticky')) {
                $('.ps-product__thumbnail').lightGallery({
                    selector: '.item a',
                    thumbnail: true,
                    share: false,
                    fullScreen: false,
                    autoplay: false,
                    autoplayControls: false,
                    actualSize: false
                });
            }
        }
        $('.ps-gallery--image').lightGallery({
            selector: '.ps-gallery__item',
            thumbnail: true,
            share: false,
            fullScreen: false,
            autoplay: false,
            autoplayControls: false,
            actualSize: false
        });
        $('.ps-video').lightGallery({
            thumbnail: false,
            share: false,
            fullScreen: false,
            autoplay: false,
            autoplayControls: false,
            actualSize: false
        });
    }
}

/*=============================================
CountDown
=============================================*/

export let CountDown = {

    fnc: function () {
        var time = $(".ps-countdown");
        time.each(function () {
            var el = $(this),
                value = $(this).data('time');
            var countDownDate = new Date(value).getTime();
            var timeout = setInterval(function () {
                var now = new Date().getTime(),
                    distance = countDownDate - now;
                var days = Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds = Math.floor((distance % (1000 * 60)) / 1000);
                el.find('.days').html(days);
                el.find('.hours').html(hours);
                el.find('.minutes').html(minutes);
                el.find('.seconds').html(seconds);
                if (distance < 0) {
                    clearInterval(timeout);
                    el.closest('.ps-section').hide();
                }
            }, 1000);
        });
    }

}

/*=============================================
Rating
=============================================*/

export let Rating = {

    fnc: function () {
        $('select.ps-rating').each(function () {
            var readOnly;
            if ($(this).attr('data-read-only') == 'true') {
                readOnly = true
            } else {
                readOnly = false;
            }
            $(this).barrating({
                theme: 'fontawesome-stars',
                readonly: readOnly,
                emptyValue: '0'
            });
        });
    }

}

/*=============================================
ProgressBar
=============================================*/

export let ProgressBar = {

    fnc: function () {
        var progress = $('.ps-progress');
        progress.each(function (e) {
            var value = $(this).data('value');
            $(this).find('span').css({
                width: value + "%"
            })
        });
    }

}

/*=============================================
DinamicRating
=============================================*/

export let DinamicRating = {

    fnc: function(response){

        /*=============================================
        Calculamos el total de las calificaciones de las reseñas
        =============================================*/    

        let totalReview = 0;
        let rating = 0;

        for(let i = 0; i < JSON.parse(response.reviews).length; i++){

            totalReview += Number(JSON.parse(response.reviews)[i]["review"]);

        }

        rating = Math.round(totalReview/JSON.parse(response.reviews).length);

        return rating;

    }

}

/*=============================================
DinamicReview
=============================================*/

export let DinamicReviews = {


     fnc: function(response){

        /*=============================================
        Clasificamos la cantidad de estrellas según la calificación
        =============================================*/    

        let reviews = [];

        for(let r = 0; r < 5; r++){

            if(response < (r+1)){

                reviews[r] = 2
            
            }else{

                reviews[r] = 1
            }    
        }

        return reviews;
    }

}

/*=============================================
DinamicPrice
=============================================*/

export let DinamicPrice = {

    fnc: function(response){
    
        let type;
        let value;
        let offer;
        let price;
        let disccount;
        let arrayPrice = [];
        let offerDate;
        let today = new Date();


        if(response.offer != ""){

            offerDate = new Date(

                parseInt(JSON.parse(response.offer)[2].split("-")[0]),
                parseInt(JSON.parse(response.offer)[2].split("-")[1])-1,
                parseInt(JSON.parse(response.offer)[2].split("-")[2])

            )

            if(today < offerDate){

                type = JSON.parse(response.offer)[0];
                value = JSON.parse(response.offer)[1];

                if(type == "Disccount"){

                    offer = (response.price-(response.price * value/100)).toFixed(2)    
                }    

                if(type == "Fixed"){

                    offer = value;
                    value = Math.round(offer*100/response.price);

                }

                disccount = `<div class="ps-product__badge">-${value}%</div>`;

                price = `<p class="ps-product__price sale">$<span class="end-price">${offer}</span> <del>$${response.price} </del></p>`;

            }else{

                price = `<p class="ps-product__price">$<span class="end-price">${response.price}</span></p>`; 
            }

        }else{

            price = `<p class="ps-product__price">$<span class="end-price">${response.price}</span></p>`;
        }

        /*=============================================
        Definimos si el producto tiene stock
        =============================================*/    

        if(response.stock == 0){

            disccount = `<div class="ps-product__badge out-stock">Out Of Stock</div>`;

        }

        arrayPrice[0] = price;
        arrayPrice[1] = disccount;

        return arrayPrice;
    }

}

/*=============================================
Pagination
=============================================*/
export let Pagination = {

    fnc: function(){

        var target = $('.pagination');
        
        if (target.length > 0) {

            target.each(function() {
                
                var tg = $(this),
                    totalPages = tg.data('total-pages'),                
                    actualPage = tg.data('actual-page'),
                    currentRoute = tg.data('current-route');    
   
                tg.twbsPagination({
                    totalPages: totalPages,
                    startPage: actualPage,
                    visiblePages: 4,
                    first: "First",
                    last: "Last",
                    prev: '<i class="fas fa-angle-left"></i>',
                    next: '<i class="fas fa-angle-right"></i>'
                }).on("page", function(evt, page){

                     window.location.href = currentRoute+"&"+page;

                })
               

            })
        }

    }

}

/*=============================================
Select2Cofig
=============================================*/
export let Select2Cofig = {

    fnc: function(){

        $('select.ps-select').select2({
            placeholder: $(this).data('placeholder'),
            minimumResultsForSearch: -1
        });
    }
}

/*=============================================
Search
=============================================*/
export let Search = {

    fnc: function(response){

        var search = response.toLowerCase();

        var match = /^[a-z0-9ñÑáéíóú ]*$/;

        if(match.test(search)){

            var searchTest = search.replace(/[ ]/g, "_");
            searchTest = searchTest.replace(/[ñ]/g, "n");
            searchTest = searchTest.replace(/[á]/g, "a");
            searchTest = searchTest.replace(/[é]/g, "e");
            searchTest = searchTest.replace(/[í]/g, "i");
            searchTest = searchTest.replace(/[ó]/g, "o");
            searchTest = searchTest.replace(/[ú]/g, "u");

            return searchTest;

        }

    }

}

/*=============================================
Tabs
=============================================*/
export let Tabs = {

    fnc: function() {
        $('.ps-tab-list  li > a ').on('click', function(e) {
            e.preventDefault();
            var target = $(this).attr('href');
            $(this).closest('li').siblings('li').removeClass('active');
            $(this).closest('li').addClass('active');
            $(target).addClass('active');
            $(target).siblings('.ps-tab').removeClass('active');
        });
        $('.ps-tab-list.owl-slider .owl-item a').on('click', function(e) {
            e.preventDefault();
            var target = $(this).attr('href');
            $(this).closest('.owl-item').siblings('.owl-item').removeClass('active');
            $(this).closest('.owl-item').addClass('active');
            $(target).addClass('active');
            $(target).siblings('.ps-tab').removeClass('active');
        });
    }

}

/*=============================================
Quantity
=============================================*/
export let Quantity = {

    fnc:function(){

        $(".quantity").each(function(){

            var spinner = $(this),
            input = spinner.find('input[type="number"]'),
            btnUp = spinner.find('.up'),
            btnDown = spinner.find('.down'),
            min = input.attr("min"),
            max = input.attr("max")


            btnUp.click(function(){

                var oldValue = parseInt(input.val());

                if(oldValue >= max){

                    var newVal = oldValue;

                }else{

                    var newVal = oldValue + 1;
                }

                input.val(newVal)
                input.trigger("change")

            })

            btnDown.click(function(){

                var oldValue = parseInt(input.val());

                if(oldValue <= min){

                    var newVal = oldValue;

                }else{

                    var newVal = oldValue - 1;
                }

                input.val(newVal)
                input.trigger("change")

            })

        })

    }

}

/*=============================================
Capitalize
=============================================*/

export let Capitalize = {

    fnc: function(value){

        value = value.toLowerCase();

        let names = value.split(' ');

        names = names.map( name => {

            return name[0].toUpperCase() + name.substr(1)

        })

        return names.join(' ');

    }

}

/*=============================================
Sweetalert
=============================================*/

export let Sweetalert = {

    fnc:function(type, text, url){

        switch (type) {

            case "error":

            if(url == null){

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: text
                }) 

            }else{

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: text
                }).then((result) => {

                    if (result.value) { 

                        window.open(url, "_top")
                    }

                })

            } 

            break; 

            case "success":

            if(url == null){

                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: text
                }) 

            }else{

                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: text
                }).then((result) => {

                    if (result.value) { 

                        window.open(url, "_top")
                    }

                })

            } 

            break; 

            case "loading":

              Swal.fire({
                allowOutsideClick: false,
                type: 'info',
                text:text
              })
              Swal.showLoading()

            break; 

            case "html":

            Swal.fire({
                allowOutsideClick: false,
                title: 'Click to continue with the payment...',
                icon: 'info',
                html:text,
                showConfirmButton: false,
                showCancelButton: true,
                cancelButtonColor: '#d33'
            })

            break;

            case "close":

                Swal.close()

            break;

        }

       
    }

}

/*=============================================
Tooltip
=============================================*/

export let Tooltip = {

    fnc: function(){

        $('[data-toggle="tooltip"]').tooltip();
    }

}

/*=============================================
Paypal
=============================================*/

export let Paypal = {

    fnc: function(price){

        return new Promise(resolve=>{

            paypal.Buttons({
    
                // Sets up the transaction when a payment button is clicked
                createOrder: function(data, actions) {
                  return actions.order.create({
                    purchase_units: [{
                      amount: {
                        value: price // Can reference variables or functions. Example: `value: document.getElementById('...').value`
                      }
                    }]
                  });
                },
        
                // Finalize the transaction after payer approval
                onApprove: function(data, actions) {
                  return actions.order.capture().then(function(orderData) {
    
                    if(orderData.status == "COMPLETED"){

                        //En caso de presentar fallas en la DB, cambiar "orderData" por "details" para que coincida la ruta

                        localStorage.setItem("id_payment", orderData.id)
    
                        resolve(true);
    
                    }
                  });
    
                },
    
                onCancel: function (data) {
    
                    resolve(false);
    
                },
    
                onError: function (err) {
    
                    resolve(false);
    
                }
            }).render('#paypal-button-container');

        })


    }
}

