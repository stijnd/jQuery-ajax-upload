/*
    --------------------------------
    jQuery "Ajax" upload
    --------------------------------
    + http://stijnd.be/jquery-upload/
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

            //add an iframe - //don't clutter the dom with iframe and hidden forms!
            if($('.upload_hidden_iframe').length <= 0)
            {
                $iframe = $('<iframe frameborder="0" name="upload_hidden" class="upload_hidden_iframe" style="display:none;" />');
                $('body').append($iframe);
            }
            else
            {
                $iframe = $('.upload_hidden_iframe');
            }

            //add a form - //don't clutter the dom with iframe and hidden forms!
            if($('.uploaden_hidden_form').length <= 0)
            {
                $form = $('<form method="POST" enctype="multipart/form-data" action="'+plugin.settings.upload_url+'" class="uploaden_hidden_form" target="upload_hidden" style="visibility:hidden; height:0; width:0;"><input type="file" name="'+plugin.settings.fieldname+'" id="'+plugin.settings.fieldname+'" /></form>');
                $('body').append($form);
            }
            else
            {
                $form = $('.uploaden_hidden_form');
            }

            //add upload button!
            $button = $('<a href="#" class="ajax_upload_btn">'+plugin.settings.btn_text+'</a>');
            $loader = $('<span class="ajax_upload_loader" style="display:none;"></span>');

            $hidden.after($button, $loader);

            //add listener to button
            $button.click(function(e){
                //prevent hash-url
                e.preventDefault();

                //do the click_action method
                click_action();  
            });
        }

        // plugin.foo_public_method = function() {
        //     // code goes here
        // }

        var click_action = function() {
            //add listener to the iframe
            $iframe.unbind().load(function(e){
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
                            plugin.settings.succes(response);
                        }
                    }
                    else
                    {
                        //fire error event
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

                //unbind to prevent other upload-boxes to react!
                $iframe.unbind();
                $('#'+plugin.settings.fieldname, $form).unbind();
            });

            //add listener to hidden upload-field
            $('#'+plugin.settings.fieldname, $form).unbind().change(function(e){
                $loader.show();

                if(typeof plugin.settings.selected == 'function')
                {
                    plugin.settings.selected();   
                }

                $form.submit();
            });

            //trigger fileupload field
            $('#'+plugin.settings.fieldname, $form).click();
        }

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