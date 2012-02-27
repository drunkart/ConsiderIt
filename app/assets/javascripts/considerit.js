var ConsiderIt; //global namespace for ConsiderIt js methods

(function($) {

$j = jQuery.noConflict();



ConsiderIt = {
  study : false,
  subdirectory: '',//'/blogademia',
  init : function() {

    ConsiderIt.delegators();

    ConsiderIt.per_request();

    $j(document).ajaxComplete(function() {
      ConsiderIt.per_request();
    });
    
    $j('a.smooth_anchor').click(function(){
      $j('html, body').animate({
        scrollTop: $j($j(this).attr('href')).offset().top}, 1000);
        return false;
    });

    $j("#points_other_pro, #points_other_con").each(function(){
      $j(this).infiniteCarousel({
        speed: 1000,
        vertical: true,
        total_items: parseInt($j(this).find('.total').filter(":first").text()),
        items_per_page: 3,
        loading_from_ajax: true, 
        dim: 750,
        resetSizePerPage: true,
        total_items_callback: function($carousel){
          if ($carousel.find('.total').filter(":first").length > 0) {
            return parseInt($carousel.find('.total').filter(":first").text());
          } else {
            return $carousel.find('li.point_in_list').length;
          }
        }
      });
    }); 

    $j('#intro .proposals.horizontal').infiniteCarousel({
      speed: 1500,
      vertical: false,
      total_items: 5,
      items_per_page: 5,
      loading_from_ajax: false,
      dim: 680
    });

    $j('.proposal_prompt .proposals.horizontal').infiniteCarousel({
      speed: 1500,
      vertical: false,
      total_items: 8,
      items_per_page: 8,
      loading_from_ajax: false,
      dim: 720
    });    


    ConsiderIt.positions.update_participants_block('all');

    // $j('.proposals.vertical').infiniteCarousel({
    //   speed: 1500,
    //   vertical: true,
    //   total_items: 5,
    //   items_per_page: 5,
    //   loading_from_ajax: false,
    //   dim: 250
    // });

    

    if( $j('#intro').length == 0 ){
      //$j('#masthead').append('<a class="home" href="/">home</a>');
    }

    //ConsiderIt.points.create.initialize_counters('.newpointform, .editpointform');

    // google analytics
    (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
        
  },
  per_request : function() {

    $j('.point_in_list_margin.pro').draggable({
      helper: 'clone',
      cursor: 'move'
      //snap: '#drop-pro'
    });

    $j('.point_in_list_margin.con').draggable({
      helper: 'clone',
      cursor: 'move'
      //snap: '#drop-con'
    });

    $j('#points_on_board_con').droppable( {
      hoverClass: 'hovered',
      drop: function( event, ui ) {
        var draggable = ui.draggable;
        $j('.inclusion_submit', draggable).trigger('click');
      },
      accept: '.con'
    } );

    $j('#points_on_board_pro').droppable( {
      hoverClass: 'hovered',
      drop: function( event, ui ) {
        var draggable = ui.draggable;
        $j('.inclusion_submit', draggable).trigger('click');
      },
      accept: '.pro'
    } );      
           
    $j('.has_example').each(function(){
      if($j(this).val() == '') {
        $j(this).example(function() {
          return $j(this).attr('title'); 
        });
      }
    });

    $j('.add_qtip').each(function(){
      if(!$j(this).data('qtip')) {
        $j(this).qtip({ 
          style: { name: 'cream', tip: true }, 
          position: {corner: { target: 'bottomMiddle', tooltip: 'topMiddle' } }
        });
      }
    });

    $j('.new_comment .is_counted, .pro_con_list .is_counted').each(function(){
      if( !$j(this).data('has_noblecount') ){        

        $j(this).NobleCount($j(this).siblings('.count'), {
          block_negative: true,
          max_chars : parseInt($j(this).siblings('.count').text()),          
          on_negative : ConsiderIt.noblecount.on_negative,
          on_positive : ConsiderIt.noblecount.on_positive
        });
      }
    });  

    $j("#ranked_points .full_column").each(function(){
      $j(this).infiniteCarousel({
        speed: 1000,
        vertical: true,
        total_items: parseInt($j(this).find('.total').filter(":first").text()),
        items_per_page: 4,
        loading_from_ajax: true, 
        dim: 700,
        resetSizePerPage: true,
        total_items_callback: function($carousel){
          return parseInt($carousel.find('.total').filter(":first").text());
        }
      });
    });   

    // $j('.participant_carousel .vertical_carousel').infiniteCarousel({
    //   speed: 1500,
    //   vertical: true,
    //   //total_items: 5,
    //   items_per_page: 20,
    //   loading_from_ajax: false,
    //   dim: 270,
    //   resetSizePerPage: false
    // });

    ConsiderIt.update_carousel_heights();

  },

  delegators : function() {

    /////////////
    // ACCOUNTS
    /////////////

    $j(document).delegate('#confirmation_sent button#go', 'click', function(){
        $j('#pledge_dialog').dialog('close');
      });

    $j(document).delegate('#site_registration a.cancel', 'click', function(){
      $j('.user_dialog, #settings_dialog').dialog('close');
    });

    $j(document).delegate('#acknowledgment a', 'click', function(){
      show_tos(500, 700);  
    });

    $j(document).delegate('#zipcode_entered .reset a', 'click', function(){
      $j(this).siblings('.resetform').show();
    });

    //////////////
    // PROPOSALS
    //////////////
    $j(document).delegate('.proposal_prompt a.show_proposal_description', 'click', function(){
      $j('.proposal_prompt').removeClass('hiding');
      $j(this).remove();
    });

    $j(document).delegate('.description_wrapper .prompt a', 'click', function(){
      if($j(this).hasClass('hidden')){
        $j(this).parents('.prompt').filter(":first").siblings('.full').slideDown();
        $j(this).text('hide');
      } else {
        $j(this).parents('.prompt').filter(":first").siblings('.full').slideUp();
        $j(this).text('show');
      }
      $j(this).toggleClass('hidden');

    });
            
    //////////////
    // POINTS
    //////////////

    // mouseover a point
    $j('.point_list').delegate('.point_in_list', 'hover', function( event ) {
      var el = $j(this).find('.operations');
      if ( event.type === 'mouseenter' ) {
        el.stop(true, false)
          .fadeTo('slow', 1.0, 'easeInQuart');
      } else {
        el.stop(true, false)
          .fadeOut('fast');
      }
    });

    // mouseover read more button
    $j('.point_in_list_margin').delegate('.point_text_toggle.more', 'hover', function(event){
      var parent = $j(this).parents('.point_in_list_margin');
      if ( event.type === 'mouseenter' ) {
        parent.draggable( "disable" );
        parent.removeClass('ui-draggable-disabled ui-state-disabled');
      } else {
        parent.draggable( "enable" );
      }

    });

    // new button clicked
    $j('.pro_con_list.dynamic').delegate('.newpoint .newpointbutton button', 'click', function(){
      $j('.droppable').fadeOut();
      $j(this).fadeOut(function(){
        $j(this).parents('.newpoint').filter(":first").find('.pointform').fadeIn('fast');    
      });  
      //show_lightbox();
    });

    // edit point clicked
    $j('.pro_con_list.dynamic').delegate('a.editpoint', 'click', function(){
      $j('.droppable').fadeOut();
      $j(this).fadeOut(function(){
        $j(this).parents('.edit').filter(":first").find('.pointform').fadeIn('fast');    
      });  
      //show_lightbox();
    });

    // new/edit point cancel clicked
    $j('.pro_con_list.dynamic').delegate('.new_point_cancel', 'click', function(){
      $j(this).parents('.pointform').filter(":first").fadeOut(function(){
        $j(this).parents('.newpoint').find('.write_new').fadeIn();  //hide_lightbox();
        $j('.droppable').fadeIn();
      });
    });

    // Create callback
    $j('.pro_con_list.dynamic').delegate('.newpoint .newpointform form', 'ajax:success', function(data, response, xhr){
      $j(this).parents('.full_column').filter(":first").find('.point_list').filter(":first").append(response['new_point']);
      $j(this).find('textarea').val('');
      $j(this).find('.point-title-group .count').html(140);
      $j(this).find('.point-description-group .count').html(2000);
      
      $j(this).find('.new_point_cancel').trigger('click');
    });

    // Update callback
    $j('.pro_con_list.dynamic').delegate('.editpointform form', 'ajax:success', function(data, response, xhr){
      $j(this).parents('.point_in_list').filter(":first").replaceWith(response['new_point']);
      hide_lightbox(); 
    });

    // Delete confirmation prompt
    $j('.pro_con_list.dynamic').delegate('a.delete_point', 'click', function(){
      $j(this).siblings('form').show();  
    });
    $j('.pro_con_list.dynamic').delegate('.deletepointform a.cancel', 'click', function(){
      $j(this).parents('form').hide();  
    });

    // Delete callback
    $j('.pro_con_list.dynamic').delegate('.deletepointform form', 'ajax:success', function(data, response, xhr){
      $j(this).parents('.point_in_list').filter(":first").fadeOut();
    });

    var close_point_click = function(e){
      if ( $j(e.target).parents('.point_in_list.expanded').length == 0  && $j('body > .ui-widget-overlay').length == 0) {
        $j('.point_in_list.expanded .toggle.less:visible').trigger('click');
      }
    };

    var close_point_key = function(e) { 
      if (e.keyCode == 27 && $j('body > .ui-widget-overlay').length == 0) {
        $j('.point_in_list.expanded .toggle.less:visible').trigger('click');
      }
    };

    // Toggle point details ON
    $j(document).delegate('.point_in_list .toggle.more', 'click', function(){
      var real_point = $j(this).parents('.point_in_list'),
          point_id = real_point.attr('id').substring(6);  
          
      real_point.draggable( "disable" );

      var placeholder = $j('<li>'); 
      placeholder
        .attr('id', real_point.attr('id'))
        .height(real_point.height())
        .addClass(real_point.attr('class'))
        .css('visibility', 'hidden');

      //close other open points...
      $j('.point_in_list.expanded .toggle.less:visible').trigger('click');

      real_point.after(placeholder);

      real_point = real_point.detach();
      $j('body').append(real_point);

      real_point
        .addClass('expanded')
        .css({
          'top': placeholder.offset().top - $j('#content').offset().top,
          'left': placeholder.offset().left 
        });

      //start complex animation...
      var nutshell = real_point.find('.nutshell'),
        extra = real_point.find('.extra'),
        is_pro = real_point.hasClass('pro'),
        details_loaded = extra.find('> .ajax_loading').length == 0;
      
      if ( details_loaded ) {
        extra.css({'width': '488px'});
        real_height = extra.height();
        extra.css({'width': '', 'height': real_height});
      }

      extra.addClass('animation_state-extra_expand', 'slow', 'easeOutQuint', function(){

        nutshell.css({
           'display': 'inline',
           'position': 'absolute'
        });

        nutshell.addClass('animation_state-nutshell_spill', 'slow', 'easeInQuad', function(){

          real_point.find('.avatar').fadeIn();
          real_point.find('.bullet_point').fadeOut();

          real_point.addClass('animation_state-finished');

          if ( !details_loaded ) {
            var proposal_id = $j('#proposal_id').text();
            $j.get('/proposals/' + proposal_id + '/points/' + point_id, function(data){
              $j('.extra', real_point)
                .html(data.details)
                .css({height: 'auto'});
              real_height = extra.height();
              extra.animate('slow', {'height': real_height});                      
            });
          }
        });

        $j(document)
          .click(close_point_click)
          .keypress(close_point_key);

      });


      real_point.find('.toggle.more').fadeOut();
    });

    // Toggle point details OFF
    $j(document).delegate('.point_in_list .toggle.less', 'click', function(){

      var real_point = $j(this).parents('.point_in_list'), 
          placeholder = $j('#' + real_point.attr('id') + ':not(.expanded)'),
          is_pro = real_point.hasClass('pro'),
          nutshell = real_point.find('.nutshell'),
          extra = real_point.find('.extra');

      $j(document)
        .unbind('click', close_point_click)
        .unbind('keypress', close_point_key);

      real_point.find('.avatar').hide();
      real_point.find('.bullet_point').show();

      real_point.removeClass('animation_state-finished');
      nutshell.removeClass('animation_state-nutshell_spill', 'fast', 'easeOutQuad');
      extra.removeClass('animation_state-extra_expand', 'fast', 'easeOutQuad', function(){        
        nutshell.css({ 'display': '', 'position': '' });

        real_point
          .css({left:'',top:''})
          .removeClass('expanded');
        placeholder.replaceWith(real_point);

        if ( real_point.hasClass('point_in_list_margin') ) {
          real_point.draggable( "enable" );
        }

        placeholder.remove();
        real_point.find('.operations').hide().find('.more').show();

      });        

    });

    //////////////
    // INCLUSIONS
    //////////////

    // Include in list
    $j(document).delegate('.include .judgepointform form', 'ajax:success', function(data, response, xhr){
      var included_point = $j(this).parents('.point_in_list_margin'), 
      replacement_point = $j(response['new_point']);
    
      if ( included_point.hasClass('pro') ) {
        var user_point_list = $j('#points_on_board_pro .point_list');
        var other_point_list = $j('#points_other_pro .point_list');
      } else {
        var user_point_list = $j('#points_on_board_con .point_list');
        var other_point_list = $j('#points_other_con .point_list');
      }

      var carousel = other_point_list.parents('.infiniteCarousel').filter(":first"),
          replacement_point_already_in_list = other_point_list.find('#' + replacement_point.attr('id')).length > 0;

      included_point.fadeOut('slow', function() {
        // only use replacement point if it doesn't already exist in the list
        included_point = replacement_point && replacement_point.length > 0 && !replacement_point_already_in_list
           ? included_point.replaceWith(replacement_point) 
           : included_point.detach();

        replacement_point.draggable({
          helper: 'clone',
          cursor: 'move'
        });
        user_point_list.append(included_point);
        included_point
          .removeClass('point_in_list_margin')
          .addClass('point_in_list_self')
          .fadeIn('slow', function(){
            $j('.pro_con_list .droppable').fadeOut('slow').remove();
          });

        carousel.infiniteCarousel({'operation': 'refresh', 'total_items': parseInt(response['total_remaining'])});
      });
    });

    // Remove from list
    $j(document).delegate('.remove .judgepointform form', 'ajax:success', function(data, response, xhr){
      var old_point = $j(this).parents('.point_in_list_self').filter(":first"),
        other_point_list = old_point.hasClass('pro') ? $j('#points_other_pro .point_list') : $j('#points_other_con .point_list'),
        carousel = other_point_list.parents('.infiniteCarousel').filter(":first");

      old_point.fadeOut('slow', function(){
        old_point = old_point.detach(); 
        other_point_list.append(old_point);
        carousel.infiniteCarousel({'operation': 'refresh', 'total_items': parseInt(response['total_remaining'])});
        old_point
          .fadeIn('slow')
          .removeClass('point_in_list_self')
          .addClass('point_in_list_margin')
          .draggable({
            helper: 'clone',
            cursor: 'move'
          });
      });
    });

    //////////////
    //COMMENTS
    //////////////

    // post new comment
    $j(document).delegate('.new_comment form', 'ajax:success', function(data, response, xhr){
        
      var new_point = response['new_point'],
      $parent = $j(this).parents('.comment').filter(":first");
      //because we cloned the point in order to show an expanded version when the point in the list 
      // is contained in the carousel, need to add the comment in both places...
      $parent = $j('#' + $parent.attr('id'));
      if($parent.length > 0){
        $parent.find('.comment_children').filter(":first").prepend(new_point);
        $j('.new_comment textarea').val("");
        $parent.find('.reply_row a.cancel').trigger('click');
      } else {
        $j(this).parents('.new_comment').filter(":first").before(new_point);
        $j(this).find('textarea, .the_subject input').val("");
      }

    });

    //////////////
    // POSITIONS
    //////////////

    // Toggle position statement clicked

    $j("body").delegate(".statement a, .position_statement a.close", 'click', function(event){
      var user_id = $j.trim($j(this).parent().find('.userid').text()),
          prompt = $j("#user-" + user_id + " a").find('.read_statement'),
          closing = !$j(this).hasClass('.view_statement') && $j(this).find('.username:visible').length == 0,
          position_statement = $j("#user-" + user_id + "-full"),
          statement = $j("#user-" + user_id);

      if ( closing ) {
        statement.removeClass('active');
        position_statement.children('.discuss').slideUp();
        hide_lightbox();
      } else {
        $j('.position_statement a.close:visible').trigger('click');
        statement.addClass('active');

        show_lightbox();
      }

      position_statement.slideToggle('slow', function(){
        if (!closing) { 
          position_statement.children('.discuss').slideDown('slow');
        }
      });

      if ( !closing ) {
        ConsiderIt.positions.stance_group_clicked('user-' + user_id);
      } else if ( event.which ) { // don't want to do anything if triggered programmatically

      }


    });    

    //////////////
    //HISTOGRAM
    //////////////

    $j('.histogram').delegate('.bar:not(.selected)', 'click', function(){
      
      var bucket = $j(this).attr('id').substring(7),
          $stored = $j('.domain_'+bucket);

      $j(this)
        .addClass('selected')
        .siblings().removeClass('selected');

      $j('.vizbase, .pro_con_list')
        .addClass('segmented');

      var mouseover_callback = function(data){
        $j('#ranked_points .pro_con_list, .statements').hide();

        if(data) {
          $j('.results_narrative, #ranked_points').removeClass('loading');
          $j('#ranked_points').append(data['points']);
          $j('.statements').filter(":first").after(data['participants']);            
        } else {
          $stored.show();            
        }         
        ConsiderIt.positions.update_participants_block(bucket);
        $j('.full_column', $stored).infiniteCarousel({'operation': 'refresh'});
      };

      if( $stored.length > 0 ) {
        mouseover_callback();
      } else {
        $j('.results_narrative, #ranked_points').addClass('loading');
        $j.get(ConsiderIt.subdirectory + "/proposals/" + $j('#proposal_id').text() + "/points", { bucket: bucket },
          mouseover_callback);
      }

      $j('.position_statement:visible a.close').trigger('click');

    });

    $j('.histogram').delegate('.bar.selected', 'click', function(){
      
      $j('.domain_all')
        .show()
        .siblings('.pro_con_list').hide();
      
      $j('.vizbase, .pro_con_list')
        .removeClass('segmented');
      
      ConsiderIt.positions.update_participants_block('all');
      $j(this).removeClass('selected');
    });
        
    $j('body').delegate(".position_statement .important_points .show, .position_statement .important_points .hide", 'click', function(){
      $j(this).parent().children().fadeToggle(); 
    });

  },

  positions : {

    update_participants_block : function( bucket ) {
      var p = $j('.participants'),
          dim = p.data('participant_img_dim_'+bucket),
          participants = $j('> .statement', p),
          show_participants = bucket == 'all' ? participants.find('img') : participants.filter('.bucket-'+bucket).find('img'),
          hide_participants = bucket == 'all' ? null : participants.filter(':not(.bucket-'+bucket+')').find('img');

      if ( !dim ) {
        dim = get_tile_size(610, 80, show_participants.length)
        p.data('participant_img_dim_'+bucket, dim);
      }

      if (hide_participants) hide_participants.hide();
      show_participants
        .css({width: dim, height: dim})
        .show();



      // if ( from_all ){
      //   show_participants.animate({width: dim + 'px', height: dim + 'px'});                
      // } else {
      //   show_participants.css({width: dim + 'px', height: dim + 'px'});                
      // }


      
    },

    set_slider_value : function(new_value){
        
      var supporting = new_value > 0,
        size = new_value * 50;
      if ( supporting ) {
        $j( '.slider_table .right').css('font-size', 100 + 1.5 * size + '%');
        $j( '.slider_table .left').css('font-size', 100 - size + '%');
      } else {
        $j( '.slider_table .right').css('font-size', 100 + size + '%');
        $j( '.slider_table .left').css('font-size', 100 - 1.5 * size + '%');
      }
      
      $j('#stance-value').val( new_value );  
    },
    
    close_segment_click : function(e){
      if ( $j(e.target).parents('.point_in_list.expanded').length == 0  && $j('body > .ui-widget-overlay').length == 0) {
        $j('.point_in_list.expanded .toggle.less:visible').trigger('click');
      }
    },

    close_segment_key : function(e) { 
      if (e.keyCode == 27) {
        $j('.point_in_list.expanded .toggle.less:visible').trigger('click');
      }
    },

    stance_group_clicked : function(bucket) {


      var proposal_id = $j('#proposal_id').text(),
          position_id = $j('#position_id').text(),
          nest = '.domain_'+bucket,
          $stored = $j(nest);

      // update position statements
      if ( bucket.toString().substring(0,4) == 'user' ){
        if( $stored.length > 0 ) {
          $stored.fadeIn();
        } else {
          $j.get(ConsiderIt.subdirectory + "/proposals/" + proposal_id + "/points", { bucket: bucket },
            function(data){
              $j('.position_statement:visible .important_points').append(data['points']);
          } );
        }
      } 

    
      //if (ConsiderIt.study){
      //  $j.post('/home/study/3', {
      //    position_id: position_id,
      //    proposal_id: proposal_id,
      //    detail1: bucket
      //  });  
      //}
                  
    },
    
    set_stance : function(bucket, dontadjust) {
      if (dontadjust) bucket = parseInt(bucket)
      $j('.stance_name').text(ConsiderIt.positions.stance_name(bucket));
    },
    
    stance_name : function(d) {
      switch (d) {
        case 0: 
          return "strong opposers"
        case 1: 
          return "opposers"
        case 2:
          return "mild opposers"
        case 3:
          return "neutral parties"
        case 4:
          return "mild supporters"
        case 5:
          return "supporters"
        case 6:
          return "strong supporters"
      }
    }  
    
  },

  update_carousel_heights: function(){
    $j('.points_other .point_list').css({
      'height': $j('.pro_con_list').height()
    })
  },
  noblecount :  {
    positive_count : function( t_obj, char_area, c_settings, char_rem ) {
      var submit_button = t_obj.parents( 'form' ).find( 'input[type="submit"]' );
      
      if ( char_area.hasClass( 'too_many_chars' ) ) {
        char_area.removeClass( 'too_many_chars' ).css( {
          'font-weight' : 'normal',
          'font-size' : '125%'
        } );
    
        submit_button
            .animate( {
              opacity : 1,
              duration : 50
            } ).attr( 'disabled', false ).css( 'cursor', 'pointer' );
        t_obj.data( 'disabled', false );
      } else if ( char_rem < c_settings.max_chars && $j( t_obj ).data( 'disabled' ) ) {
        t_obj.data( 'disabled', false );
        submit_button
            .attr( 'disabled', false );
      } else if ( char_rem == c_settings.max_chars ) {
        t_obj.data( 'disabled', true );
        submit_button
            .attr( 'disabled', true );
      }
      
    },    
    negative_count : function( t_obj, char_area, c_settings, char_rem ) {
      var submit_button = t_obj.parents( 'form' ).find( 'input[type="submit"]' );
      if ( !char_area.hasClass( 'too_many_chars' ) ) {
        char_area.addClass( 'too_many_chars' ).css( {
          'font-weight' : 'bold',
          'font-size' : '175%'
        } );
    
        t_obj.parents( parent_selector ).find( submit_selector )
            .animate( {
              opacity : .25,
              duration : 50
            } ).attr( 'disabled', true ).css( 'cursor', 'default' );
        t_obj.data( 'disabled', true );
    
      } 
    }
  }
  
};

})(jQuery);


// TODO: integrate better into code

function show_lightbox(callback){
  $j('#lightbox').css({
    'background' : '#000000',
    'z-index' : 1000
  });
  if ( !$j.browser.msie ) {

    $j('#lightbox').fadeIn('slow', callback);
  } else {
    
  }
}

function hide_lightbox(callback){
  if ( !$j.browser.msie ) {
    $j('#lightbox').fadeOut('slow', callback);
  } else {
    $j('#lightbox').css({
      'background' : 'transparent',
      'z-index' : -100
    });    
  }
}

// FROM: https://github.com/ryanb/complex-form-examples/blob/master/public/javascripts/application.js
function remove_fields(link) {
  jQuery(link).parents('.point_link_form').remove();
}

function add_fields(link, association, content) {
  var new_id = new Date().getTime();
  var regexp = new RegExp("new_" + association, "g");
  var new_content = content.replace(regexp, new_id);
  jQuery(link).parent().prepend(new_content);
}

function show_tos(width, height) {
  var screenX     = typeof window.screenX != 'undefined' ? window.screenX : window.screenLeft,
      screenY     = typeof window.screenY != 'undefined' ? window.screenY : window.screenTop,
      outerWidth  = typeof window.outerWidth != 'undefined' ? window.outerWidth : document.body.clientWidth,
      outerHeight = typeof window.outerHeight != 'undefined' ? window.outerHeight : (document.body.clientHeight - 22),
      left        = parseInt(screenX + ((outerWidth - width) / 2), 10),
      top         = parseInt(screenY + ((outerHeight - height) / 2.5), 10),
      features    = ('width=' + width + ',height=' + height + ',left=' + left + ',top=' + top + ',scrollbars=yes');

      var tos = window.open('/home/terms-of-use', 'Terms of Use', features);

  if (tos.focus)
    tos.focus();

  return false;
}

function login(provider_url, width, height) {
  var screenX     = typeof window.screenX != 'undefined' ? window.screenX : window.screenLeft,
      screenY     = typeof window.screenY != 'undefined' ? window.screenY : window.screenTop,
      outerWidth  = typeof window.outerWidth != 'undefined' ? window.outerWidth : document.body.clientWidth,
      outerHeight = typeof window.outerHeight != 'undefined' ? window.outerHeight : (document.body.clientHeight - 22),
      left        = parseInt(screenX + ((outerWidth - width) / 2), 10),
      top         = parseInt(screenY + ((outerHeight - height) / 2.5), 10),
      features    = ('width=' + width + ',height=' + height + ',left=' + left + ',top=' + top + ',scrollbars=yes');

  newwindow = window.open(provider_url, '_blank', features);

  if (window.focus)
    newwindow.focus();

  return false;
}

function get_tile_size(width, height, tileCount){

  // come up with an initial guess
  var aspect = height/width, 
    xf = Math.sqrt(tileCount/aspect),
    yf = xf*aspect,
    x = Math.max(1.0, Math.floor(xf)),
    y = Math.max(1.0, Math.floor(yf)),
    x_size = Math.floor(width/x),
    y_size = Math.floor(height/y),
    tileSize = Math.min(x_size, y_size);

  // test our guess:
  x = Math.floor(width/tileSize);
  y = Math.floor(height/tileSize);
  if (x*y < tileCount) { // we guessed too high
  
    if (((x+1)*y < tileCount) && (x*(y+1) < tileCount)){
      // case 2: the upper bound is correct
      //         compute the tileSize that will
      //         result in (x+1)*(y+1) tiles
      x_size = Math.floor(width/(x+1));
      y_size = Math.floor(height/(y+1));
      tileSize = Math.min(x_size, y_size);
    } else {
      // case 3: solve an equation to determine
      //         the final x and y dimensions
      //         and then compute the tileSize
      //         that results in those dimensions
      var test_x = Math.ceil(tileCount/y),
          test_y = Math.ceil(tileCount/x);
      x_size = Math.min(Math.floor(width/test_x), Math.floor(height/y));
      y_size = Math.min(Math.floor(width/x), Math.floor(height/test_y));
      tileSize = Math.max(x_size, y_size);
    }
  }

  return tileSize;
}