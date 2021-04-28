$(document).ready(Core);

function Core()
{
    SetTabSwitcher();
    SetModal();
    InitOwl();
    SetQuestion();
    SetMobileMenu();
    SetAncors();
}

function SetTabSwitcher()
{
    $('.btn__tab__switch').on('click', function(e) {
        e.preventDefault();
        if ($(this).hasClass('active'))
        {
            return;
        }

        $('.btn__tab__switch').removeClass('active');
        $(this).addClass('active');

        let targetTab = $(this).attr('target');

        SwitchTab(targetTab)
    })
}

function SwitchTab(target)
{
    
    $('.tab.active').animate({
        opacity: 0
    }, 500, function() {
        $('.tab.active').removeClass('active');

        $(`[tab-name="${target}"]`).css('opacity', 0);
        $(`[tab-name="${target}"]`).addClass('active');
        
        let tabHeight = $(`[tab-name="${target}"]`)[0].clientHeight;
        $(`[tab-name="${target}"]`).closest('.tab__viewer').css('height', `${tabHeight}px`)

        $(`[tab-name="${target}"]`).animate({
            opacity: 1
        }, 500)
    })
}

function SetModal()
{
    $('[modal]').on('click', function()
    {
        let modalId = $(this).attr('modal');
        ShowModal(`#${modalId}`);
    });

    $('.modal__dialog').on('click', function(e) {
        e.stopPropagation();
    });

    $('.modal').on('click', function() {
        HideModal(`#${$(this).attr('id')}`);
    });

    $('.btn__modal__close').on('click', function ()
    {
        let modalId = $(this).closest('.modal').attr('id');
        HideModal(`#${modalId}`);
    });
}

function ShowModal(modalId)
{
    $(modalId + ' .modal__dialog').off('animationend');
    $(modalId).addClass('active');
    $('body').addClass('lock');
    $(modalId + ' .modal__dialog').addClass('fadeInDownBig')
    
    $('body').append('<div class="modal__backdrop"></div>');
    setTimeout(function() {
        $('.modal__backdrop').addClass('active');
    }, 50)
}

function HideModal(modalId)
{
    $(modalId + ' .modal__dialog').removeClass('fadeInDownBig');
    $(modalId + ' .modal__dialog').addClass('fadeOutDownBig');
    $('.modal__backdrop').removeClass('active');
    $('body').removeClass('lock');
    $(modalId + ' .modal__dialog').on('animationend', function() {
        if (!$(modalId).hasClass('active'))
        {
            return;
        }
        $(modalId).removeClass('active');
        $(modalId + ' .modal__dialog').removeClass('fadeOutDownBig');
        $('.modal__backdrop').remove();
    });
}

function InitOwl()
{
    $('section.examples__slider .owl-carousel').owlCarousel({
        items: 1,
        nav: true,
        navContainer: $('section.examples__slider .owl-nav'),
        dots: false
    })
}

function SetQuestion()
{
    $('.faq .question').on('click', function() {
        if ($(this).hasClass('active'))
        {
            $(this).removeClass('active');
            $(this).find('.content').css('max-height', `0px`);
        }
        else
        {
            $(this).addClass('active');
            let height = $(this).find('.content span').outerHeight();
            $(this).find('.content').css('max-height', `${height}px`);
        }
        
    })
}

function SetMobileMenu()
{
    $('.btn__menu').on('click', function() {
        if($(this).hasClass('active'))
        {
            $('.mobile__menu').removeClass('active');
            $(this).removeClass('active');
            $('body').removeClass('lock');
        }
        else
        {
            $('.mobile__menu').addClass('active');
            $(this).addClass('active');
            $('body').addClass('lock');
        }
        
    })
}

function SetAncors()
{
    $('[ancore]').on('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: $($(this).attr('ancore')).position().top - 90,
            left: 0,
            behavior: 'smooth'
        });
    })
}