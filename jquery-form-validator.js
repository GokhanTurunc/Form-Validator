/**
 * Author:  Gökhan Turunç
 *          <gokhan.turunc@gmail.com>
 *          www.gokhanturunc.com
 * Tested:  Mozilla Firefox 7
 *          Google Chrome 
 *          Chromium
 *          Internet Explorer 8
 *          Opera
 */

$(function(){
    $.fn.validate = function(options){     
        
        var that = this;
        var notificationType = options.notificationLevel || 1;
        var mainErrorText = options.formErrorText || 'Zorunlu alanları doldurunuz!';
        var hasError = false;        
        var itemErrorClass = options.itemErrorClass || null;
        var caseSensitive = options.caseSensitive || false;
        
        $(this).find('input').addClass('formElement');
        $(this).find('textarea').addClass('formElement');
        $(this).find('select').addClass('formElement');
        
        // Form Submit
        $(this).submit(function(){           
            
            var formElementCount = 0
            formElementCount += $(this).find('.formElement').length;
            
            for (var i = 0; i < formElementCount - 1; i++) {
                
                var $item = $(this).find('.formElement').eq(i);
                
                var validation = $item.attr('validate');
                var rule = $item.attr('rule');
                var message = $item.attr('message') || 'Message Here!';
                
                var value = $item.val();
                value = $.trim(value);
                
                var requiredValue = $item.attr('requiredValue') || null;
                
                if (validation == 'true' && rule != null) {
                    
                    var result = that.validate(rule, value, requiredValue);
                    
                    if (result == false) {
                        hasError = true;
                        that.notification(message, $item);
                    } else {                        
                        $item.next('span.error').text('');
                        if ($item.hasClass('error') == true) {
                            $item.removeClass('error');
                        }
                    }       
                    
                }
                
            }
            
            if (hasError == true) {
                if (notificationType != 3) {
                    that.mainError(this);
                }
                hasError = false;
                return false;
            }
            
        });
        
        this.validate = function(type, value, requiredValue) {
            
            if (caseSensitive == false) {
                value = that.toLowerCaseString(value);
                requiredValue = that.toLowerCaseString(requiredValue);
            }
            
            switch (type) {
                case 'notNull':
                    if (value == '' || value == null) return false;
                    break;
                case 'isEmail' :
                    var pattern=/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
                    if (pattern.test(value) == false) return false;
                    break;
                case 'equalTo' :
                    if (value != requiredValue) return false;
                    break;
                case 'number' : 
                    value = parseFloat(value);
                    if (isNaN(value)) return false; 
                    break;
                    
            }
        };
        
        this.notification = function(message, $item) {
            $item.addClass('error');
            
            if (notificationType == 1) {
                var spanError = '<span class="error">' + message + '</span>';
                if ($item.next('.error').length > 0) {
                    $item.next('.error').text(message);
                } else {
                    $item.parent().append(spanError);
                }
            }
        };
        
        this.mainError = function($form) {
            var markup = '<span id="mainErrorText">' + mainErrorText + '</span>';
            $('#mainErrorText', $form).remove();
            $($form).append(markup);  
            
        };
        
        this.toLowerCaseString = function(value) {

            if (value != '' && value != null) {
                return value.toLowerCase();
            } else {
                return null;
            }
        };
        
    }
});