/*
    --------------------------------
    jQuery Ajax upload
    --------------------------------
    + https://github.com/stijnd/jquery-upload
    + version 1.0
    + Copyright 2011 Stijn Debacker
    + Licensed under the MIT license
    
    + Documentation: http://stijnd.be/jquery-upload/
*/
(function($) {

    $.ajaxUpload = function(element, options) {

        var defaults = {
            fieldname   : 'ajax_upload_field',
            upload_url  : 'upload.php',
            btn_text    : 'Browse'
        }

        var plugin = this;

        plugin.settings = {}

        var $element = $(element),
             element = element,
             startup = true,
            $hidden  = null,
            $iframe  = null,
            $form    = null,
            $loader  = null,
            $button  = null;

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);
            // code goes here

            //get parent form
            var par_form = $element.parents('form');

            //get attributes
            var tmpName  = $element.attr('name');
            var tmpId    = $element.attr('id');
            var tmpClass = $element.attr('class'); 

            //prep hidden field with this name
            $hidden = $('<input type="hidden" name="'+tmpName+'" id="'+tmpId+'" class="'+tmpClass+'" />');
            $element.after($hidden).remove();

            //add an iframe
            $iframe = $('<iframe frameborder="0" name="upload_hidden" id="upload_hidden" style="display:none;" />');
            par_form.after($iframe);

            //add a form
            $form = $('<form method="POST" enctype="multipart/form-data" action="'+plugin.settings.upload_url+'" target="upload_hidden" style="display:none;"><input type="file" name="'+plugin.settings.fieldname+'" id="'+plugin.settings.fieldname+'" /></form>');
            par_form.after($form);

            //add upload button!
            $button = $('<a href="#" class="ajax_upload_btn">'+plugin.settings.btn_text+'</a>');
            $loader = $('<span class="ajax_upload_loader" style="display:none;"></span>');

            $hidden.after($button, $loader);

            //add listener to the iframe
            $iframe.load(function(e){
                var response = document.all? this.contentDocument.body.innerText : this.contentDocument.body.textContent;//.innerText;
                response = response.length > 0 ? $.parseJSON(response) : null;

                if(response != null)
                {
                    //upload was done
                    if(response.succes)
                    {
                        //fire succes event
                        $hidden.val(response.url);

                        //callback
                        if(typeof plugin.settings.succes == 'function')
                        {
                            plugin.settings.succes();
                        }
                    }
                    else
                    {
                        //fire error event
                        //console.log(response.error);

                        //callback
                        if(typeof plugin.settings.error == 'function')
                        {
                            plugin.settings.error(response.error);
                        }
                    }
                }
                else if(!startup)
                {
                    if(typeof plugin.settings.error == 'function')
                    {
                        plugin.settings.error('The upload-handler could not be found on this url: '+plugin.settings.upload_url);
                    }
                }

                $loader.hide();
            });
            
            //add listener to hidden upload-field
            $('#ajax_upload_field', $form).change(function(e){
                $loader.show();

                if(typeof plugin.settings.selected == 'function')
                {
                    plugin.settings.selected();   
                }

                $(this).parents('form').submit();
            });

            //add listener to button
            $button.click(function(e){
                startup = false;

                //prevent hash-url
                e.preventDefault();

                //trigger fileupload field
                $('#ajax_upload_field', $form).click();  
            });
        }

        // plugin.foo_public_method = function() {
        //     // code goes here
        // }

        // var foo_private_method = function() {
        //     // code goes here
        // }

        plugin.init();

    }

    $.fn.ajaxUpload = function(options) {

        return this.each(function() {
            if (undefined == $(this).data('pluginName')) {
                var plugin = new $.ajaxUpload(this, options);
                $(this).data('ajaxUpload', plugin);
            }
        });

    }

})(jQuery);