import jQuery from 'jquery';

function menu(event, stack, move)
{
    // Special case meaning "close it, we are finished"
    if (event === null) {
        while (stack.length > 1) {
            const top = stack.pop();
            jQuery(top.label).removeClass('open hover');
            jQuery(top.submenu).hide();
        }
        stack.pop();
        return null;
    }

    // Ignore until menu was clicked
    if (stack.length == 0 && event.type != 'click') {
        return null;
    }

    let stack_length_orig = stack.length;
    let is_special = false;
    let special_label = null;

    // 1. determine element with label
    // 2. determine submenu
    // -----------
    // 1. click on item: return item
    // 2. click on submenu: toggle submenu
    const label = jQuery(event.target).addBack().closest('li').get(0);
    if (label) {
        // XXX hack
        if (stack.length == 0) {
            stack.push(null);
        }
        while (stack.length > 1) {
            const top = stack.pop();
            jQuery(top.label).removeClass('hover');
            if (!top.submenu) {
                is_special = true;
            }
            if (!special_label) {
                special_label = top.label;
            }
            if (jQuery(top.submenu).find(label).length) {
                stack.push(top);
                break;
            }
            jQuery(top.label).removeClass('open');
            jQuery(top.submenu).hide();
        }
        if (event.type == 'click' && stack_length_orig > stack.length + is_special) {
            // Clicking on opened top menu means "close menu and exit"
            if (stack.length == 1) {
                stack.pop();
            }
            else {
                jQuery(special_label).addClass('hover');
            }
            return null;
        }
        const submenu = jQuery(label).children('ul').get(0);
        if (submenu) {
            if (move) {
                move(label, submenu);
            }
            else {
                const {top, left, right, bottom} = label.getBoundingClientRect();
                if (stack.length <= 1) {
                    jQuery(submenu).show().css({top: bottom, left});
                }
                else {
                    jQuery(submenu).show().css({top: top, left: right});
                }                
            }
            jQuery(label).addClass('open hover');
            stack.push({label, submenu});
            return null;
        }
        else {
            stack.push({label, submenu: null});
            jQuery(label).addClass('hover');
        }
        return label;
    }
}

export default menu;
