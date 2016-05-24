/**
 * Created by LeeMoonSeong on 2016-04-08.
 */

$(document).ready(function(){
    $(function () {
        // Remove Search if user Resets Form or hits Escape!
        $('body, .navbar-collapse form[role="search"] button[type="reset"]').on('click keyup', function(event) {
            console.log(event.currentTarget);
            $("#srch1").removeClass("important");
            $("#srch1").addClass("search-default");
            if (event.which == 27 && $('.navbar-collapse form[role="search"]').hasClass('active')
               ) {
                closeSearch();
            }
        });

        function closeSearch() {
            var $form = $('.navbar-collapse form[role="search"].active')
            $form.find('input').val('');
            $form.removeClass('active');
            $form.addClass('comeback');
        }

        // Show Search if form is not active // event.preventDefault() is important, this prevents the form from submitting
        $(document).on('click', '.navbar-collapse form[role="search"]:not(.active) button[type="submit"]', function(event) {
            event.preventDefault();
            $("#srch1").removeClass("search-default");
            $("#srch1").addClass("important");
            var $form = $(this).closest('form'),
                $input = $form.find('input');
            $form.removeClass('comeback');
            $form.addClass('active');
            $input.focus();
        });

        // Autofocus for collapsed mode
        $(document).on('click', '.navbar-header button.navbar-toggle:last-of-type', function(event) {
            var $form = $('.navbar-collapse form[role="search"]').find('input').focus();
        });

        // ONLY FOR DEMO // Please use $('form').submit(function(event)) to track from submission
        // if your form is ajax remember to call `closeSearch()` to close the search container
        $(document).on('click', '.navbar-collapse form[role="search"].active button[type="submit"]', function(event) {
            event.preventDefault();
            var $form = $(this).closest('form'),
                $input = $form.find('input');
            $('#showSearchTerm').text($input.val());
            closeSearch()
        });
    });
});
