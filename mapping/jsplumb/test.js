/**
 * Created by yuriy on 2/1/14.
 */
jsPlumb.ready(function() {
    jsPlumb.makeSource($('.item'), {
        connector: 'StateMachine'
    });
    jsPlumb.makeTarget($('.item'), {
        anchor: 'Continuous'
    });
});
