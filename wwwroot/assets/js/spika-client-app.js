(function() {
    
    // handles window ( mainly size change )
    var windowManager = {
        
        init : function(window){
            
            var self = this;
            $(window).resize(function() {
                self.onResize();
            });
            
            this.onResize();
            
        },
        onResize : function(){
            var headerHeight = $('.navbar-static-top').height();
            var chatboxHeight =  $('#chat_block').height();

            $('body').height(window.innerHeight);
            $('.sidebar-collapse .tab-content').height(window.innerHeight - headerHeight - 50);
            $('#conversation_block').height(window.innerHeight - chatboxHeight - headerHeight - 10);
        }  
        
    };
    
    // handles modal dialogs
    var alertManager = {
        
        showAlert : function(title,message,buttonText,onClose){
            
            $('#modalAlertDialog #modalTitle').text(title);
            $('#modalAlertDialog #modalText').text(message);
            $('#modalAlertDialog #modalDismissButton').text(buttonText);
            
            $('#modalAlertDialog').modal('show');
            $('#modalAlertDialog').on('hide.bs.modal', function (e) {
                onClose();
            })
        },
        showError : function(message){
            
            $('#modalAlertDialog #modalTitle').text(_lang.labelErrorDialogTitle);
            $('#modalAlertDialog #modalText').text(message);
            $('#modalAlertDialog #modalDismissButton').text(_lang.labelCloseButton);
            
            $('#modalAlertDialog').modal('show');
        },
        showLoading : function(){
            $('#modalLoading').modal('show');
        },
        hideLoading : function(){
            $('#modalLoading').modal('hide');
        }
            
    };
    
    var navigationBarManager = {
        
        templateUserRowWithImage : _.template('<li><a href="javascript:"><img src="' + _consts.RootURL + '/api/filedownloader?file=<%= avatar_thumb_file_id %>" alt="" width="40" height="40" class="person_img img-circle" /><%= name %></a></li>'),
        templateGroupsRowWithImage : _.template('<li><a href="javascript:"><img src="' + _consts.RootURL + '/api/filedownloader?file=<%= avatar_thumb_file_id %>" alt="" width="40" height="40" class="person_img img-circle" /><%= name %></a></li>'),
        templateUserRowWithoutImage : _.template('<li><a href="javascript:"><img src="http://dummyimage.com/60x60/e2e2e2/7a7a7a&text=nopicture" alt="" width="40" height="40" class="person_img img-circle" /><%= name %></a></li>'),
        templateGroupsRowWithoutImage : _.template('<li><a href="javascript:"><img src="http://dummyimage.com/60x60/e2e2e2/7a7a7a&text=nopicture" alt="" width="40" height="40" class="person_img img-circle" /><%= name %></a></li>'),
        
        renderContacts : function(userList){
            
            var self = this;
            _spikaClient.getContacts(function(users){
                
                var html = '';
                _.each(users, function(user){
                    
                    if(_.isEmpty(user.avatar_thumb_file_id)){
                        html += self.templateUserRowWithoutImage(user);
                    }else{
                        html += self.templateUserRowWithImage(user);
                    }
                    
                });
                
                $('#tab-users ul').html(html);
                
                
            },function(errorMessage){
            
                alertManager.showError(_lang.messageGeneralError);
                
            });
            
        },
        renderGroups : function(userList){
        
            var self = this;
            _spikaClient.getFavoriteGroups(function(groups){
                
                var html = '';
                _.each(groups, function(group){

                    if(_.isEmpty(group.avatar_thumb_file_id)){
                        html += self.templateGroupsRowWithoutImage(group);
                    }else{
                        html += self.templateGroupsRowWithImage(group);
                    }
                    
                });
                
                $('#tab-groups ul').html(html);
                
            },function(errorMessage){
            
                alertManager.showError(_lang.messageGeneralError);
                
            });
            
        }
    }
    
    $(document).ready(function() {
    
        alertManager.showLoading();
        
        windowManager.init(window);
        
        // login
        _spikaClient.login(_loginedUser.email,_loginedUser.password,function(data){
            
            _loginedUser = data;
            _spikaClient.setCurrentUser(_loginedUser);
            
            navigationBarManager.renderContacts();
            navigationBarManager.renderGroups();
            
            alertManager.hideLoading();
            
        },function(errorString){
        
            alertManager.showAlert(_lang.labelErrorDialogTitle,_lang.messageTokenError,_lang.labelCloseButton,function(){
                location.href = "login";
            });
            
        });
            
        
    });

})();